import joi from "joi";

import ERR from "../../common/error.js";

import siteModel from "../models/site.js";

export const Site = function() {
	this.model = siteModel;
}

Site.prototype.create = async function(ctx) {
	const params = ctx.state.params;
	const username = ctx.state.user.username;
	params.username = username;

	let data = await this.model.findOne({
		where: {
			username:username,
		    sitename: params.sitename,	
		}
	});
	
	if (data) return ERR.ERR.setMessage("站点已存在");

	data = await this.model.create(params);	
	if (!data) return ERR.ERR;

	data = data.get({plain:true});

	return ERR.ERR_OK.setData(data);
}

Site.prototype.getByUsername = async function(ctx) {
	const params = ctx.state.params;
	const username = params.username || ctx.state.user.username;

	if (!username) return ERR.ERR_PARAMS;

	let data = await this.model.findAll({
		where: {
		   username: username,
		},
	});

	if (!data) return ERR.ERR;

	return ERR.ERR_OK.setData(data);
}

Site.prototype.update = async function(ctx) {
	const params = ctx.state.params;
	const username = ctx.state.user.username;

	if (username != params.username) {
		return ERR.ERR_PARAMS;
	}

	const result = await this.model.update(params, {
		where: {
			id: params.id
		},
		fields: ['description'],
	});

	if (!result || result[0] == 0) {
		return ERR.ERR_NOT_FOUND;
	}

	return ERR.ERR_OK;
}

Site.prototype.delete = async function(ctx) {
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
		return ERR.ERR_NOT_FOUND;
	}

	return ERR.ERR_OK;
}

Site.prototype.getRoutes = function() {
	const prefix = "site";
	const routes = [
	{
		path: prefix + "/getByUsername",
		method: "get",
		action: "getByUsername",
	},
	{
		path: prefix + "/delete",
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
		path: prefix + "/update",
		method: "put",
		action: "update",
		authenticated: true,
	},
	{
		path: prefix + "/create",
		method: "post",
		action: "create",
		authenticated: true,
		validate: {
			body: {
				sitename: joi.string().max(48).required(),
			},
		}
	},
	];

	return routes;
}

export default new Site();

