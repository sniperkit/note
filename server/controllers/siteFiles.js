import joi from "joi";

import ERR from "../../common/error.js";

import FilesModel from "../models/files.js";
import SiteFilesModel from "../models/siteFiles.js";

export const SiteFiles = function() {
	this.model = SiteFilesModel;
}

SiteFiles.prototype.create = async function(ctx) {
	const params = ctx.state.params;
	const username = ctx.state.user.username;

	if (params.pagepath.indexOf(params.username) != 0) {
		return ERR.ERR_PARAMS();
	}

	let file = await FilesModel.findOne({
		where: {
			id: params.fileId,
			username: username,
		}
	});

	if (!file) return ERR.ERR_PARAMS();

	file = file.get(plain: true);

	if (!file.public && username != params.username) {
		return ERR.ERR_NO_PERMISSION();
	}

	let data = await this.model.create(params);

	return ERR.ERR_OK(data);
}

SiteFiles.prototype.update = function(ctx) {

}

SiteFiles.prototype.delete = function(ctx) {

}

SiteFiles.prototype.findOne = function(ctx) {

}

SiteFiles.prototype.find = function(ctx) {
	const params = ctx.state.params;

	let data = await this.model.findAll(params);

	return ERR.ERR_OK(data);
}

SiteFiles.getRoutes = function() {
	const self = this;

	self.pathPrefix = "siteFiles";

	const routes = [
	{
		path: "",
		method: "POST",
		action: "create",
		authentated: true,
		validate: {
			body: {
				fileId: joi.number().required(),
				path: joi.string().required(),
				username: joi.string().required(),
			},
		},
	},
	{
		path: ":id",
		method: "PUT",
		action: "update",
		authentated: true,
		validate: {
			body: {
				key: joi.string().required(),
			},
			params: {
				id: joi.number().required(),
			}
		},
	},
	{
		path: ":id",
		method: "DELETE",
		action: "delete",
		authentated: true,
		validate: {
			params: {
				id: joi.number().required(),
			}
		},
	},
	{
		path: ":id",
		method: "GET",
		action: "findOne",
		authentated: true,
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
	];

	return routes;
}

export default SiteFiles;
