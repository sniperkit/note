import joi from "joi";

import groupsModel from "@/models/groups.js";
import groupMembersModel from "@/models/groupMembers.js";

import consts from "@@/common/consts.js";
import ERR from "@@/common/error.js";

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
	const userId = ctx.state.user.userId;

	let data = this.model.findOne({
		where: {
			id: id,
			userId: userId,
		}
	});

	return ERR.ERR_OK(data);
}

Groups.prototype.create = async function(ctx) {
	const params = ctx.state.params;
	const userId = ctx.state.user.userId;
	params.userId = userId;
	
	let data = await this.model.create(params);

	//data = data.get({plain:true});

	return ERR.ERR_OK(data);
}

Groups.prototype.update = async function() {
	const params = ctx.state.params;
	const id = ctx.params.id;
	const userId = ctx.state.user.userId;

	let data = await this.model.update(params, {
		where: {
			id: id,
			userId: userId,
		}
	})

	return ERR.ERR_OK(data);
}

Groups.prototype.delete = async function() {
	const id = ctx.params.id;
	const userId = ctx.state.user.userId;

	let data = await this.model.destroy({
		where: {
			id: id,
			userId: userId,
		}
	})

	return ERR.ERR_OK(data);
}

Groups.prototype.addMember = async function(ctx) {
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
		groupId: id,
		memberId: params.memberId,
		level: params.level,
	});

	return ERR.ERR_OK(result);
}

Groups.prototype.removeMember = async function(ctx) {
	const id = ctx.params.id;
	const memberId = ctx.params.memberId;
	const userId = ctx.state.user.userId;

	let result = await groupMembersModel.destroy({
		userId: userId,
		groupId: id,
		memberId: memberId,
	});

	return ERR.ERR_OK(result);
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
	},
	{
		path: ":id/members/:memberId",
		method: "DELETE",
		action: "removeMember",
		authentated: true,
		validate: {
			params: {
				id: joi.number().required(),
				memberId: joi.number().required(),
			},
		}
	}
	];

	return routes;
}

export default Groups;
