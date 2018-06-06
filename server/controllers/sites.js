import joi from "joi";

import ERR from "../../common/error.js";

import sitesModel from "../models/sites.js";
import siteGroupsModel from "../models/siteGroups.js";

export const Sites = function() {
	this.model = sitesModel;
}

Sites.prototype.create = async function(ctx) {
	const params = ctx.state.params;
	const userId = ctx.state.user.userId;
	params.userId = userId;

	let data = await this.model.findOne({
		where: {
			userId:userId,
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
	const userId = ctx.state.user.userId;
	const username = ctx.state.user.username;

	const where = {public: true};

	if (params.userId) where.userId = params.userId;

	if (params.owned && userId) {
		where.userId = userId;
		delete where.public;
	}

	let data = await this.model.findAll({
		where: where,
	});

	if (!data) return ERR.ERR();

	return ERR.ERR_OK().setData(data);
}

Sites.prototype.update = async function(ctx) {
	const siteId = ctx.params.id;
	const userId = ctx.state.user.userId;

	const result = await this.model.update(params, {
		where: {
			id: siteId,
			userId: userId,
		},
		fields: ['description'],
	});

	if (!result || result[0] == 0) {
		return ERR.ERR_NOT_FOUND();
	}

	return ERR.ERR_OK();
}

Sites.prototype.delete = async function(ctx) {
	const siteId = ctx.params.id;
	const userId = ctx.state.user.userId;

	const result = await this.model.destroy({
		where: {
			id: siteId,
			userId:userId,
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
		path: ":id",
		method: "delete",
		action: "delete",
		authenticated: true,
		validate: {
			params: {
				id: joi.number().required(),
			},
		},
	},
	{
		path: ":id",
		method: "put",
		action: "update",
		authenticated: true,
		validate: {
			params: {
				id: joi.number().required(),
			},
		},
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

