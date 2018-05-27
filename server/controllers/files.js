import joi from "joi";
import Sequelize from "sequelize";

import ERR from "../../common/error.js";
import gitlab from "../../common/api/gitlab.js";
import util from "../../common/util.js";

import Qiniu from "./qiniu.js";
import filesModel from "../models/files.js";

const storage = new Qiniu();

const {like, gt, lte, ne, in: opIn} = Sequelize.Op;

export const Files = function(){
	this.model = filesModel;
}

function writeGitFile(params) {
	const path = params.key;
	const options = {
		content: params.content,
		commit_message: "note site create or update",
	}

	gitlab.upsertFile(params.key, {content:params.content});
}

//Files.prototype.getContent = async function(ctx) {
	//const username = ctx.state.user.username;
	//const params = ctx.state.params;
	//params.username = username;

	//return await storage.get(ctx);
//}

Files.prototype.getFile = async function(ctx) {
	const username = ctx.state.user.username;
	const params = ctx.state.params;
	params.username = username;

	let result = await storage.get(ctx);
	if (result.isErr()) return result;
	
	let record = await this.model.findOne({
		where : {
			key: params.key,
		},
	});
	if (!record) return ERR.ERR_NOT_FOUND({content: result.getData()});
	record = record.get({plain:true});

	record.content = result.getData();

	return ERR.ERR_OK(record);
}

Files.prototype.uploadFile = async function(ctx) {
	const username = ctx.state.user.username;
	const params = ctx.state.params;
	params.username = username;
	
	let result = await storage.upload(ctx);
	if (result.isErr()) return result;

	params.hash = result.getData().hash;
	await this.model.upsert(params);

	// 往git写一份
	writeGitFile(params);

	return ERR.ERR_OK({hash:params.hash});
}

Files.prototype.deleteFile = async function(ctx) {
	const username = ctx.state.user.username;
	const params = ctx.state.params;
	params.username = username;

	let result = await storage.delete(ctx);

	await this.model.destroy({where:{
		key: params.key,
	}});

	return ERR.ERR_OK();
}

Files.prototype.list = async function(ctx) {
	const params = ctx.state.params;

	ctx.state.params = {
		prefix: params.prefix || "",
	}

	const result = await storage.list(ctx);
	if (result.isErr()) return result;

	const data = result.getData();

	return ERR.ERR_OK(data);
}

Files.prototype.getByUsername = async function(ctx) {
	const params = ctx.state.params;

	ctx.state.params = {
		prefix: params.username,
	}
	const result = await storage.list(ctx);
	if (result.isErr()) return result;

	const data = result.getData();
	//const list = await this.model.findAll({where: {
		//key: {
			//[like]: params.username + "/%",
		//}
	//}});

	return ERR.ERR_OK(data);
}

Files.prototype.raw = async function(ctx) {
	const params = ctx.state.params;
	const filename = params.filename;
	const key = util.getKeyByPath(filename);

	const url = storage.getDownloadUrl(key);
	console.log(url);

	ctx.redirect(url || 'http://git.keepwork.com/gitlab_rls_lixizhi/keepworkdatasource/raw/master/lixizhi_images/img_1520938234618.jpeg');
}

Files.prototype.getToken = async function(ctx) {
	const key = decodeURIComponent(ctx.params.id);
	const username = ctx.state.user.username;

	const keys = key.split("/");
	
	if (keys.length < 2 || key.indexOf(username) != 0) return ERR.ERR_PARAMS();
	const filetype = keys[0].replace(username+ "_", "");

	//console.log(keys, key, filetype);
	if (filetype != "pages" && filetype != "files" && filetype != "images" && filetype == "datas") {
		return ERR.ERR_PARAMS();
	}

	ctx.state.params = {key:key};

	const result =  storage.getUploadToken(ctx);
	if (result.isErr()) return result;

	const token = result.data;
	
	return ERR.ERR_OK({token});
}

Files.prototype.getUrl = async function(ctx) {
	const key = decodeURIComponent(ctx.params.id);
	const username = ctx.state.user.username;
	const params = ctx.state.params;


	return 

}

Files.prototype.create = async function(ctx) {
	const params = ctx.state.params;
	const username = ctx.state.user.username;
	const key = params.key;
	params.username = username;

	//if (key.indexOf(username + "_files/") != 0) {
		//return ERR.ERR_PARAMS();
	//} 
	
	let data = await this.model.upsert(params);

	return ERR.ERR_OK(data);
}

// 修改接口 主要用来修改文件名
Files.prototype.update = async function(ctx) {
	const params = ctx.state.params;
	const username = ctx.state.user.username;
	params.username = username;
	// 禁止相关字段修改
	let data = await this.model.update(params, {
		where: {
			id: params.id,
		},
		fields: ["hash", "size", "type", "public"],
	});

	return ERR.ERR_OK(data);
}

Files.prototype.delete = async function(ctx) {
	const params = ctx.state.params;
	const username = ctx.state.user.username;

	let data = await this.model.findOne({
		where: {
			id: params.id,
			username: username,
		}
	});
	
	if (!data) return ERR.ERR_PARAMS();

	data = data.get({plain: true});
	ctx.state.params = {key: data.key};
	data = await storage.delete(ctx);
	if (!data.isErr()) return data;

	data = await this.model.delete({
		where: {
			id: params.id,
			username: username,
		}
	});

	return ERR.ERR_OK(data);
}

Files.prototype.find = async function(ctx) {
	const params = ctx.state.params;
	const username = ctx.state.user.username;

	if (params.raw) {
		return this.list(ctx);
	}

	
	const where = {};
	if (username) {
		where.username = username;
	} else {
		where.public = true;
	}

	if (params.type) {
		where.type = params.type;
	} else {
		where.type = {[ne]:"pages"};
	}

	where.username = username || params.username;

	let data = await this.model.findAll({
		where: where,
		limit: params.limit,
		offset: params.offset,
	})

	return ERR.ERR_OK(data);
}

Files.prototype.findOne = async function(ctx) {
	const id = ctx.params.id;
	const username = ctx.state.user.username;

	let data = await this.model.findOne({
		where: {
			id: id,
			username: username,
		}
	})

	return ERR.ERR_OK(data);
}

// 重命名
Files.prototype.rename = async function(ctx) {
	const filename = ctx.state.params.filename;
	const id = ctx.params.id;
	const username = ctx.state.user.username;
	
	let data = await this.model.findOne({
		where: {
			id: id,
			username: username,
		}
	});

	if (!data) return ERR.ERR_NOT_FOUND();

	data = data.get({plain:true});
	
	// 七牛改名
	const srcKey = username + "_files/" + data.filename;
	const dstKey = username + "_files/" + filename;
	data = await storage.move({srcKey, dstKey});
	if (data.isErr()) return data;
	
	data = await this.model.update({
		filename: filename,
	}, {
		where: {
			id: id,
		}
	})
	
	return ERR.ERR_OK(data);
}

Files.prototype.getContent = async function(ctx) {
	const username = ctx.state.user.username;
	let id = ctx.params.id;
	let key = decodeURIComponent(id);
	let where = {username: username};

	if (/^\d+$/.test(id)) {
		key = undefined;
		where.id = id;
	} else {
		id = undefined;
		where.key = key;
	}

	let data = await this.model.findOne({where:where});

	if (!data) {
		if (!key) return ERR.ERR_PARAMS();
		data = {key:key};
	} else {
		data = data.get({plain: true});
	}

	ctx.state.params = {key: data.key};

	let result = await storage.get(ctx);
	data.content = result.getData();

	return ERR.ERR_OK(data);
}

Files.prototype.upsertContent = async function(ctx) {
	const username = ctx.state.user.username;
	const params = ctx.state.params;
	params.username = username;
	
	let result = await storage.upload(ctx);
	if (result.isErr()) return result;

	params.hash = result.getData().hash;
	await this.model.upsert(params);

	// 往git写一份
	writeGitFile(params);

	return ERR.ERR_OK({hash:params.hash});
}

Files.prototype.callback = async function(ctx) {
	
}

Files.getRoutes = function() {
	const self = this;
	self.pathPrefix = "files";
	const routes = [
	{
		path: "raw",
		method: "get",
		action: "raw",
	},
	{
		path: ":id/url",
		method: "GET",
		action: "getUrl",
		authentated: true,
		validate: {
			params: {
				id: joi.string().required(),
			}
		}
	},
	{
		path: ":id/token",
		method: "GET",
		action: "getToken",
		authentated: true,
		validate: {
			params: {
				id: joi.string().required(),
			}
		}
	},
	{
		path: "",
		method: "POST",
		action: "create",
		authentated: true,
		validate: {
			body: {
				key: joi.string().required(),
			},
		},
	},
	{
		path: ":id",
		method: "PUT",
		action: "update",
		authentated: true,
		validate: {
			body: {
				key: joi.string().required(),
			},
			params: {
				id: joi.number().required(),
			}
		},
	},
	{
		path: ":id",
		method: "DELETE",
		action: "delete",
		authentated: true,
		validate: {
			params: {
				id: joi.number().required(),
			}
		},
	},
	{
		path: ":id",
		method: "GET",
		action: "findOne",
		authentated: true,
		validate: {
			params: {
				id: joi.string().required(),
			}
		},
	},
	{
		path: "",
		method: "GET",
		action: "find",
		authentated: true,
	},
	{
		path: ":id/content",
		method: "GET",
		action: "getContent",
		authentated: true,
		validate: {
			params: {
				id: joi.string().required(),
			}
		}
	},
	{
		path: ":id/content",
		method: ["POST", "PUT"],
		action: "upsertContent",
		authentated: true,
		validate: {
			params: {
				id: joi.string().required(),
			}
		}
	},
	{
		path: ":id/rename",
		method: "PUT",
		action: "update",
		authentated: true,
		validate: {
			body: {
				filename: joi.string().required(),
			},
			params: {
				id: joi.number().required(),
			}
		},
	},
	{
		path: "getByUsername",
		method: "get",
		action: "getByUsername",
		validate: {
			query: {
				username: joi.string().required(),
			}
		},
		authentated: true,
	},
	{
		path: "getFile",
		method: "get",
		action: "getFile",
		validate: {
			query: {
				key: joi.string().required(),
			}
		},
		authentated: true,
	},
	{
		path: "uploadFile",
		method: "post",
		action: "uploadFile",
		validate: {
			body: {
				key: joi.string().required(),
			}
		},
		authentated: true,
	},
	{
		path: "deleteFile",
		method: "delete",
		action: "deleteFile",
		validate: {
			query: {
				key: joi.string().required(),
			}
		},
		authentated: true,
	},
	];

	return routes;
}

export default Files;
