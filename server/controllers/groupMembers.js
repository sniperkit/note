import joi from "joi";

import groupMembersModel from "../models/groupMembers.js";

import ERR from "../../common/error.js";

export GroupMembers = function() {
	this.model = groupMembersModel;
}

GroupMembers.prototype.find = function() {

}

GroupMembers.prototype.findOne = function() {

}

GroupMembers.prototype.create = function() {

}

GroupMembers.prototype.update = function() {

}

GroupMembers.getRoutes = function() {
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
				id: joi.string().required(),
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
	];

	return routes;
}

export default GroupMembers;
