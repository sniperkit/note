import _ from "lodash";
import joi from "joi";

import util from "../../common/util.js";
import config from "../config.js";
import {ERR, ERR_OK, ERR_PARAMS} from "../../common/error.js";
import userModel from "../models/user.js";

export const User = function() {
	this.model = userModel;
}

User.prototype.create = function() {

} 

User.prototype.update = function() {

}

User.prototype.delete = function() {

}

User.prototype.find = function() {

}

User.prototype.setBaseInfo = async function(ctx) {
	const params = ctx.state.params;

	const data = this.model.update(params, {
		where: {
			username: params.username,
		},
		fields: ["nickname", "sex", "description", "portrait"],
	});

	if (!data) {
		return ERR().setMessage("更新失败");
	}

	return ERR_OK();
}

User.prototype.register = async function(ctx) {
	const params = ctx.request.body;
	const usernameReg = /^[\w\d]+$/;
	if (!usernameReg.test(params.username)) {
		return ERR_PARAMS();
	}
	let user = await this.model.findOne({
		where: {
			username: params.username,
		},
	});
	
	if (user) 	return ERR().setMessage("用户已存在");

	user = await this.model.create({
		username: params.username,
		password: params.password,
	});

	if (!user) return ERR();
	user = user.get({plain:true});

	const token = util.jwt_encode({
		userId: user.id, 
		username: user.username
	}, config.secret);

	user.token = token;

	return ERR_OK().setData(user);
}

User.prototype.login = async function(ctx) {
	const params = ctx.state.params;
	let user = await this.model.findOne({
		where: {
			username: params.username,
			password: params.password,
		},
	});
	
	if (!user) {
		return ERR.setMessage("用户名或密码错误");
	}

	user = user.get({plain:true});

	const token = util.jwt_encode({
		userId: user.id, 
		username: user.username
	}, config.secret);

	user.token = token;

	return ERR_OK().setData(user);
}

User.prototype.modifyPassword = async function(ctx) {
	const params = ctx.state.params;
	const username = ctx.state.user.username;

	const result = await this.model.update({
		password: params.newpassword,
	}, {
		where: {
			username: username,
			password: params.oldpassword,
		}
	});

	if (!result) return ERR();
	if (result[0] == 0) return ERR().setMessage("密码错误");

	return ERR_OK();
}

User.prototype.isLogin = async function(ctx) {
	this.model.findById(1);
	return "hello world";
}

User.prototype.getRoutes = function() {
	const self = this;
	const prefix = "user";
	const routes = [
	{
		path: prefix + "/modifyPassword",
		method: "put",
		action: "modifyPassword",
		authenticated: true,
	},
	{
		path: prefix + "/setBaseInfo",
		method: "put",
		action: "setBaseInfo",
		authenticated: true,
	},
	{
		path: prefix + "/register",
		method: "post",
		action: "register",
		validate: {
			body: {
				username: joi.string().min(4).max(48).required(),
				password: joi.string().min(4).max(48).required(),
			},
		}
	},

	{
		path: prefix + "/login",
		method: "post",
		action: "login",
		validate: {
			body: {
				username: joi.string().min(4).max(48).required(),
				password: joi.string().min(4).max(48).required(),
			},
		}
	},

	{
		path: prefix + "/isLogin",
		method: "get",
		action: "isLogin",
	},
	];

	return routes;
}

export default new User();
