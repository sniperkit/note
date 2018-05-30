import joi from "joi";

import ERR from "../../common/error.js";

import sitesModel from "../models/sites.js";
import siteGroupsModel from "../models/siteGroups.js";

export const Sites = function() {
	this.model = sitesModel;
}

Sites.prototype.create = async function(ctx) {
	const params = ctx.state.params;
	const username = ctx.state.user.username;
	params.username = username;

	let data = await this.model.findOne({
		where: {
			username:username,
		    sitename: params.sitename,	
		}
	});
	
	if (data) return ERR.ERR().setMessage("站点已存在");

	data = await this.model.create(params);	
	if (!data) return ERR.ERR();

	data = data.get({plain:true});

	return ERR.ERR_OK().setData(data);
}

Sites.prototype.find = async function(ctx) {
	const params = ctx.state.params;
	const username = ctx.state.user.username;

	const where = {public: true};

	if (params.username) where.username = params.username;

	if (params.owned && username) {
		where.username = username;
		delete where.public;
	}

	let data = await this.model.findAll({
		where: where,
	});

	if (!data) return ERR.ERR();

	return ERR.ERR_OK().setData(data);
}

Sites.prototype.update = async function(ctx) {
	const params = ctx.state.params;
	const username = ctx.state.user.username;

	if (username != params.username) {
		return ERR.ERR_PARAMS();
	}

	const result = await this.model.update(params, {
		where: {
			id: params.id
		},
		fields: ['description'],
	});

	if (!result || result[0] == 0) {
		return ERR.ERR_NOT_FOUND();
	}

	return ERR.ERR_OK();
}

Sites.prototype.delete = async function(ctx) {
	const params = ctx.state.params;
	const username = ctx.state.user.username;
	params.username = username;

	const result = await this.model.destroy({
		where: {
			username: params.username,
			sitename: params.sitename,
		}
	})

	if (!result || result[0] == 0){
		return ERR.ERR_NOT_FOUND();
	}

	return ERR.ERR_OK();
}

Sites.prototype.addGroup = async function(ctx) {
	const params = ctx.state.params;
	const id = ctx.params.id;
	const userId = ctx.state.user.userId;

	let data = await this.model.findOne({
		where: {
			id: id,
			userId: userId,
		}
	});

	if (!data) return ERR.ERR_PARAMS();

	let result = await groupMembersModel.upsert({
		userId: userId,
		siteId: id,
		groupId: params.groupId,
		level: params.level,
	});

	return ERR.ERR_OK(result);
	
}

Sites.prototype.removeGroup = async function(ctx) {
	const id = ctx.params.id;
	const groupId = ctx.params.groupId;
	const userId = ctx.state.user.userId;

	let result = await groupMembersModel.destroy({
		userId: userId,
		siteId: id,
		groupId: groupId,
	});

	return ERR.ERR_OK(result);

}

Sites.getRoutes = function() {
	this.pathPrefix = "sites";
	const routes = [
	{
		method: "get",
		action: "find",
	},
	{
		method: "delete",
		action: "delete",
		authenticated: true,
		validate: {
			query: {
				sitename: joi.string().max(48).required(),
				username: joi.string().max(48).required(),
			},
		},
	},
	{
		method: "put",
		action: "update",
		authenticated: true,
	},
	{
		method: "post",
		action: "create",
		authenticated: true,
		validate: {
			body: {
				sitename: joi.string().max(48).required(),
			},
		}
	},
	{
		path: ":id/groups",
		method: "post",
		action: "addGroup",
		authenticated: true,
		validate: {
			params: {
				id: joi.number().required(),
			},
			body: {
				groupId: joi.number().required(),
			},
		}
	},
	{
		path: ":id/groups/:groupId",
		method: "delete",
		action: "removeGroup",
		authenticated: true,
		validate: {
			params: {
				id: joi.number().required(),
				groupId: joi.number().required(),
			},
		},
	},
	];

	return routes;
}

export default Sites;

