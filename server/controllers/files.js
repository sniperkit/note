import joi from "joi";
import Sequelize from "sequelize";

import ERR from "../../common/error.js";
import gitlab from "../../common/api/gitlab.js";

import qiniu from "./qiniu.js";
import filesModel from "../models/files.js";

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

Files.prototype.getContent = async function(ctx) {
	const username = ctx.state.user.username;
	const params = ctx.state.params;
	params.username = username;

	return await qiniu.get(ctx);
}

Files.prototype.getFile = async function(ctx) {
	const username = ctx.state.user.username;
	const params = ctx.state.params;
	params.username = username;

	let result = await qiniu.get(ctx);
	if (result.isErr()) return result;
	
	let record = await this.model.findOne({
		where : {
			key: params.key,
		},
	});
	if (!record) return ERR.ERR_NOT_FOUND();
	record = record.get({plain:true});

	record.content = result.getData();

	return ERR.ERR_OK(record);
}

Files.prototype.uploadFile = async function(ctx) {
	const username = ctx.state.user.username;
	const params = ctx.state.params;
	params.username = username;
	
	let result = await qiniu.upload(ctx);
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

	let result = await qiniu.delete(ctx);

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

	const result = await qiniu.list(ctx);
	if (result.isErr()) return result;

	const data = result.getData();

	return ERR.ERR_OK(data);
}

Files.prototype.getByUsername = async function(ctx) {
	const params = ctx.state.params;

	ctx.state.params = {
		prefix: params.username,
	}
	const result = await qiniu.list(ctx);
	if (result.isErr()) return result;

	const data = result.getData();
	//const list = await this.model.findAll({where: {
		//key: {
			//[like]: params.username + "/%",
		//}
	//}});

	return ERR.ERR_OK(data);
}

Files.prototype.statics = async function(ctx) {
	ctx.redirect('http://git.keepwork.com/gitlab_rls_lixizhi/keepworkdatasource/raw/master/lixizhi_images/img_1520938234618.jpeg');

	
}

Files.getRoutes = function() {
	const self = this;
	self.pathPrefix = "files";
	const routes = [
	{
		path: "list",
		method: "get",
		action: "list",
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
		path: "getContent",
		method: "get",
		action: "getContent",
		validate: {
			query: {
				key: joi.string().required(),
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
	{
		path: "statics",
		method: "get",
		action: "statics",
	},
	];

	return routes;
}

export default Files;
