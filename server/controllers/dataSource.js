import _ from "lodash";
import joi from "joi";
import jwt from "jwt-simple";

import {Gitlab} from "../../common/api/gitlab.js";
import config from "../config.js";
import ERR from "../../common/error.js";
import DataSourceModel from "../models/dataSource.js";

const defaultProjectName = "notedatasource";

const defaultDataSource = {
	username:"keepwork",
	externalUsername: "keepwork",
	projectName: "keepworkdatasource",
	host:"https://gitlab.com",
	token:"9x94xLa-CZPH9Da5h5kd",
	ref:"master",
	branch: "master",
	projectId:5112836,
}

export const DataSource = function() {
	this.model = DataSourceModel;
}

DataSource.prototype.create = function() {

} 

DataSource.prototype.update = function() {

}

DataSource.prototype.delete = function() {

}

DataSource.prototype.find = function() {

}

DataSource.prototype.getSystemDataSource = function() {
	return _.cloneDeep(defaultDataSource);
}

// 获取用户默认数据源
DataSource.prototype.getDefaultDataSource = async function(ctx) {
	const params = ctx.request.query;
	const authUsername = ctx.state.user.username;
	const username = params.username || authUsername;

	if (!username) return ERR.ERR_PARAMS();
	
	let dataSource = await this.model.findOne({
		where: {
			username: username,
			isDefault: true,
		},
	});

	if (!dataSource) return ERR.ERR_NOT_FOUND;

	dataSource = dataSource.get({plain:true});

	if (username != authUsername) {
		dataSource.token = undefined;
		dataSource.externalPassword = undefined;
	}

	return ERR.ERR_OK(dataSource);
}

DataSource.prototype.delete = async function(ctx) {
	const params = ctx.request.query;

	if (!params.id) {
		return ERR.ERR_PARAMS();
	}

	const ret = await this.model.destroy({where: {id:params.id}});

	return ERR.ERR_OK();
}

DataSource.prototype.upsert = async function(ctx) {
	const params = ctx.request.body;
	const username = ctx.state.user.username;

	if (!params || !params.name || !params.type || !params.token || !params.baseUrl) {
		return ERR.ERR_PARAMS();
	}

	params.username = username;

	const git = new Gitlab({
		token: params.token,
		apiBaseUrl: params.baseUrl,
		rawBaseUrl: params.baseUrl,
	});
	
	//  获取用户信息
	
	const user = await git.api.Users.current().catch(()=>{});
	if (!user) {
		return ERR.ERR.setMessage("配置信息无效, 获取用户信息失败");
	}

	params.externalUsername = user.username;
	params.externalUserId = user.id;

	// 获取默认仓库信息
	const project = git.upsertProject(defaultProjectName);
	if (!params) {
		return ERR.ERR.setMessage("配置信息无效, 创建git项目失败");
	}
	params.projectId = project.id;
	params.projectName = project.name;
	
	//console.log(project);
	await this.model.upsert(params);

	return ERR.ERR_OK();
}

DataSource.prototype.getByUsername = async function(ctx) {
	const params = ctx.request.query;
	const authUsername = ctx.state.user.username;
	const username = params.username || authUsername;

	if (!username) return ERR.ERR_PARAMS();

	let exclude = [];
	if (username != authUsername) {
		exclude = exclude.concat(["token", "externalPassword"]);
	}

	let list = await this.model.findAll({
		username: username,
		attributes: {exclude},
	});

	if (!list) return ERR.ERR_NOT_FOUND();

	return list;
}

DataSource.prototype.getRoutes = function() {
	const prefix = "dataSource";
	const routes = [
	{
		path: prefix + "/getDefaultDataSource",
		method: "get",
		action: "getDefaultDataSource",
	},
	{
		path: prefix + "/getByUsername",
		method: "get",
		action: "getByUsername",
	},
	{
		path: prefix + "/upsert",
		method: "post",
		action: "upsert",
		requireAuth: true,
	},
	{
		path: prefix + "/delete",
		method: "delete",
		action: "delete",
		requireAuth: true,
	},
	];

	return routes;
}

export default new DataSource();
