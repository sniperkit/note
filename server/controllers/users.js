import _ from "lodash";
import joi from "joi";

import util from "../../common/util.js";
import config from "../config.js";
import {ERR, ERR_OK, ERR_PARAMS} from "../../common/error.js";
import userModel from "../models/users.js";

export const Users = function() {
	this.model = userModel;
}

Users.prototype.create = function() {

} 

Users.prototype.update = function() {

}

Users.prototype.delete = function() {

}

Users.prototype.find = function() {

}

Users.prototype.setBaseInfo = async function(ctx) {
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

Users.prototype.register = async function(ctx) {
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

Users.prototype.login = async function(ctx) {
	const params = ctx.state.params;
	let user = await this.model.findOne({
		where: {
			username: params.username,
			password: params.password,
		},
	});
	
	if (!user) {
		return ERR().setMessage("用户名或密码错误");
	}

	user = user.get({plain:true});

	const token = util.jwt_encode({
		userId: user.id, 
		username: user.username
	}, config.secret);

	user.token = token;

	return ERR_OK().setData(user);
}

Users.prototype.modifyPassword = async function(ctx) {
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

Users.prototype.isLogin = async function(ctx) {
	this.model.findById(1);
	return "hello world";
}

Users.getRoutes = function() {
	const self = this;
	self.pathPrefix = "users";
	const routes = [
	{
		path: "modifyPassword",
		method: "put",
		action: "modifyPassword",
		authenticated: true,
	},
	{
		path: "setBaseInfo",
		method: "put",
		action: "setBaseInfo",
		authenticated: true,
	},
	{
		path: "register",
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
		path: "login",
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
		path: "isLogin",
		method: "get",
		action: "isLogin",
	},
	];

	return routes;
}

export default Users;
