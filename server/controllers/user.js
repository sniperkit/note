import _ from "lodash";
import joi from "joi";
import jwt from "jwt-simple";

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

User.prototype.register = async function(ctx) {
	const params = ctx.request.body;
	const usernameReg = /^[\w\d]+$/;
	if (!usernameReg.test(params.username)) {
		return ERR_PARAMS;
	}
	let user = await this.model.findOne({
		where: {
			username: params.username,
		},
	});
	
	if (user) 	return ERR.setMessage("用户已存在");

	user = await this.model.create({
		username: params.username,
		password: params.password,
	});

	if (!user) return ERR;
	user = user.get({plain:true});

	const token = jwt.encode({
		userId: user.id, 
		username: user.username
	}, config.secret);

	user.token = token;

	return ERR_OK.setData(user);
}

User.prototype.login = async function(ctx) {
	const params = ctx.state.params;
	console.log(params);
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

	const token = jwt.encode({
		userId: user.id, 
		username: user.username
	}, config.secret);

	user.token = token;

	return ERR_OK.setData(user);
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
