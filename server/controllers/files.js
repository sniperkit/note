import _ from "lodash";
import joi from "joi";
import Sequelize from "sequelize";
import sequelize from "../models/database.js";

import ERR from "../../common/error.js";
import gitlab from "../../common/api/gitlab.js";
import util from "../../common/util.js";

import qiniu from "../models/qiniu.js";
import filesModel from "../models/files.js";

const storage = qiniu;

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

//Files.prototype.getFileFolder = async function(key) {
	//const parentKey = key.substring(0, key.lastIndexOf("/", key.length-2) + 1);

	//const result = await storage.get(parentKey);

	//if (result.isErr()) return {};

	//return result.getData();
//}

Files.prototype.raw = async function(ctx) {
	const key = decodeURIComponent(ctx.params.id);

	const url = storage.getDownloadUrl(key).getData();

	ctx.redirect(url);
}

Files.prototype.token = async function(ctx) {
	const key = decodeURIComponent(ctx.params.id);
	const username = ctx.state.user.username;

	if (key.indexOf(username + "/") != 0) return ERR.ERR_PARAMS();

	return storage.getUploadToken(key);
}

Files.prototype.statistics = async function(ctx) {
	const userId = ctx.state.user.userId;
	let result = await sequelize.query("SELECT SUM(size) AS `sum`, COUNT(*) as `count` from `files where `userId` = :userId`", {
		type: sequelize.QueryTypes.SELECT,
		raw: true,
		replacements:{
			userId: userId,
		},	
	});
	let data = result[0] || {};
	
	data.total = 2 * 1024 * 1024 * 1024;
	//console.log(result);

	return ERR.ERR_OK(data);
}

Files.prototype.url = async function(ctx) {
	const key = decodeURIComponent(ctx.params.id);
	const username = ctx.state.user.username;
	const params = ctx.state.params;

	return 
}

Files.prototype.upsert = async function(ctx) {
	const params = ctx.state.params;
	const key = decodeURIComponent(ctx.params.id);
	const username = ctx.state.user.username;
	const userId = ctx.state.user.userId;
	params.userId = userId;
	params.key = key;

	if (key.indexOf(username + "/") != 0) {
		return ERR.ERR_PARAMS();
	}
	
	const content = params.content;
	params.content = undefined;
	// 内容存在，则写文件
	if (content) {
		let result = await storage.upload(key, content);
		if (result.isErr()) return result;

		params.hash = result.getData().hash;

		// 往git写一份
		writeGitFile({key, content});
	}

	let data = await this.model.upsert(params);

	return ERR.ERR_OK(data);
}

Files.prototype.delete = async function(ctx) {
	const key = decodeURIComponent(ctx.params.id);
	const userId = ctx.state.user.userId;

	let data = await storage.delete(key);
	if (data.isErr()) return data;

	data = await this.model.destroy({
		where: {
			key: key,
			userId: userId,
		}
	});

	return ERR.ERR_OK(data);
}

Files.prototype.find = async function(ctx) {
	const params = ctx.state.params;
	const userId = ctx.state.user.userId;

	if (params.raw) {
		return storage.list(params.prefix || username);
	}

	
	const where = {};
	if (userId) {
		where.userId = userId;
	} else {
		where.public = true;
	}

	if (params.type) {
		where.type = params.type;
	} else {
		where.type = {[ne]:"pages"};
	}

	let data = await this.model.findAll({
		where: where,
		limit: params.limit,
		offset: params.offset,
	})

	return ERR.ERR_OK(data);
}

Files.prototype.findOne = async function(ctx) {
	const key = decodeURIComponent(ctx.params.id);
	//const userId = ctx.state.user.userId;

	let content = undefined;
	let isPage = false;
	if (_.endsWith(key, ".md")) {
		content = await storage.get(key).then(ret => ret.getData());
		isPage = true;
	}

	let data = await this.model.findOne({
		where: {
			key: key,
			//username: username,
		}
	})

	if (!data) {
		if (isPage) return ERR.ERR_OK({key, content});

		return ERR.ERR_NOT_FOUND();
	}

	data = data.get({plain: true});
	data.content = content;

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
	const srcKey = data.key;
	const dstKey =srcKey.substring(0, srcKey.lastIndexOf("/") + 1) + filename;
	data = await storage.move(srcKey, dstKey);
	if (data.isErr()) return data;
	
	data = await this.model.update({
		key: dstKey,
		filename: filename,
	}, {
		where: {
			id: id,
		}
	})
	
	return ERR.ERR_OK(data);
}

Files.prototype.qiniu = async function(ctx) {
	const params = ctx.request.body;

	let data = await this.model.upsert({
		userId: params.userId,
		siteId: params.userId,
		key:  params.key,
		hash: params.hash,
		size: params.size,
		type: params.type,
		filename: params.filename,
		level: params.level,
	});
	
	// 添加记录失败 应删除文件
	if (!data) {
	}

	return ERR.ERR_OK(data);
}

Files.prototype.transform = async function(ctx) {
	let list = await storage.list("xiaoyao");
	list = list.data.items;

	const moves = [];

	for (var i = 0; i < list.length; i++) {
		let srcKey = list[i].key;
		let paths = srcKey.split("/");
		let username = paths[0];
		let dstKey = srcKey;
		paths.splice(1, 0, username.split("_")[1] || "pages");
		paths[0] = "xiaoyao";
		dstKey = paths.join("/");
		console.log(srcKey, dstKey);
		moves.push({
			srcKey,
			dstKey,
		});
	}

	await storage.batchMove(moves);

	return ERR.ERR_OK(list);
}

Files.getRoutes = function() {
	const self = this;
	self.pathPrefix = "files";
	const routes = [
	{
		path: "transform",
		method: "get",
		action: "transform",
	},
	{
		path: "qiniu",
		method: "post",
		action: "qiniu",
	},
	{
		path: "statistics",
		method: "get",
		action: "statistics",
		authentated: true,
	},
	{
		path: ":id/raw",
		method: "GET",
		action: "raw",
		validate: {
			params: {
				id: joi.string().required(),
			}
		}
	},
	{
		path: ":id/url",
		method: "GET",
		action: "url",
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
		action: "token",
		authentated: true,
		validate: {
			params: {
				id: joi.string().required(),
			}
		}
	},
	{
		path: ":id",
		method: "POST",
		action: "upsert",
		authentated: true,
		validate: {
			body: {
				key: joi.string().required(),
			},
		},
	},
	{
		path: ":id",
		method: "DELETE",
		action: "delete",
		authentated: true,
		validate: {
			params: {
				id: joi.string().required(),
			}
		},
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
		path: ":id",
		method: "GET",
		action: "findOne",
		//authentated: true,
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
	//{
		//path: "uploadFile",
		//method: "post",
		//action: "uploadFile",
		//validate: {
			//body: {
				//key: joi.string().required(),
			//}
		//},
		//authentated: true,
	//},
	];

	return routes;
}

export default Files;
