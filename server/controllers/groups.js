import joi from "joi";

import groupsModel from "../models/groups.js";

import ERR from "../../common/error.js";

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
		validate: {
			params: {
				id: joi.string().required(),
			},
		}
	},
	{
		method: "POST",
		action: "create",
	},
	{
		method: "PUT",
		action: "update",
	},
	{
		method: "DELETE",
		action: "delete",
	},
	];

	return routes;
}

export default Groups;
