
import groupsModel from "../models/groups.js";

import ERR from "../../common/error.js";

export const Groups = function() {
	this.model = groupsModel;
}

Groups.prototype.find = function() {
	
}

Groups.prototype.findOne = async function(ctx) {
}

Groups.prototype.create = async function(ctx) {
	const params = ctx.state.params;
	
	let data = await this.model.create(params);

	//data = data.get({plain:true});

	return ERR.ERR_OK().setData(data);
}

Groups.prototype.update = function() {

}

Groups.prototype.delete = function() {

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
