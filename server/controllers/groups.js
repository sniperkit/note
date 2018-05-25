import joi from "joi";

import {consts} from "../common.js";
import groupsModel from "../models/groups.js";

import ERR from "../../common/error.js";

const USER_ACCESS_LEVEL_NONE = consts.USER_ACCESS_LEVEL.USER_ACCESS_LEVEL_NONE;
const USER_ACCESS_LEVEL_READ = consts.USER_ACCESS_LEVEL.USER_ACCESS_LEVEL_READ;
const USER_ACCESS_LEVEL_WRITE = consts.USER_ACCESS_LEVEL.USER_ACCESS_LEVEL_WRITE;

export const Groups = function() {
	this.model = groupsModel;
}

Groups.prototype.find = function() {
	console.log(ctx.params);
}

Groups.prototype.findOne = async function(ctx) {
	const id = ctx.params.id;
	const username = ctx.state.user.username;

	let data = this.model.findOne({
		where: {
			id: id,
			username: username,
		}
	});

	return ERR.ERR_OK(data);
}

Groups.prototype.create = async function(ctx) {
	const params = ctx.state.params;
	
	let data = await this.model.create(params);

	//data = data.get({plain:true});

	return ERR.ERR_OK().setData(data);
}

Groups.prototype.update = function() {
	const params = ctx.state.params;
	const id = ctx.params.id;
	const username = ctx.state.user.username;

	let data = this.model.update(params, {
		where: {
			id: id,
			username: username,
		}
	})

	return ERR.ERR_OK(data);
}

Groups.prototype.delete = function() {
	const id = ctx.params.id;
	const username = ctx.state.user.username;

	let data = this.model.destroy({
		where: {
			id: id,
			username: username,
		}
	})

	return ERR.ERR_OK(data);
}

Groups.prototype.addMember = function(ctx) {
	const params = ctx.state.params;
	const id = ctx.params.id;
	const username = ctx.state.user.username;

	console.log(ctx.params);
	console.log(ctx.state.params);
}

Groups.getRoutes = function() {
	const self = this;
	self.pathPrefix = "groups";
	const routes = [
	{
		method: "GET",
		action: "find",
	},
	{
		path: ":id",
		method: "GET",
		action: "findOne",
		authentated: true,
		validate: {
			params: {
				id: joi.number().required(),
			},
		}
	},
	{
		method: "POST",
		action: "create",
		authentated: true,
	},
	{
		path: ":id",
		method: "PUT",
		action: "update",
		authentated: true,
	},
	{
		path: ":id",
		method: "DELETE",
		action: "delete",
		authentated: true,
	},
	{
		path: ":id/members",
		method: "POST",
		action: "addMember",
		authentated: true,
		validate: {
			params: {
				id: joi.number().required(),
			},
			body: {
				memberId: joi.number().required(),
				level: joi.number().valid([USER_ACCESS_LEVEL_NONE, USER_ACCESS_LEVEL_READ, USER_ACCESS_LEVEL_WRITE]),
			},
		}
	}
	];

	return routes;
}

export default Groups;
