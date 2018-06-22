import _ from "lodash";
import joi from "joi";
import cache from 'memory-cache';
import md5 from "blueimp-md5";

import models from "@/models";
import Controller from "@/controllers/controller.js";

import util from "@@/common/util.js";
import ERR from "@@/common/error.js";
import config from "@/config.js";

const userModel = models["users"];

export const Users = class extends Controller {
	constructor() {
		super();
	}

	async update(ctx) {
		const id = ctx.params.id;
		const userId = ctx.state.user.userId;
		const params = ctx.state.params;

		delete params.password;

		if (id != userId) return ERR.ERR_NO_PERMISSION();

		return await this.model.update(params, {where:{id:userId}});
	}

	async findById(ctx) {
		const id = ctx.params.id;
		
		const result =  await this.model.findOne({where:{id}});

		return ERR.ERR_OK(result);
	}

	async register(ctx) {
		const params = ctx.state.params;
		const usernameReg = /^[\w\d]+$/;
		if (!usernameReg.test(params.username)) {
			return ERR_PARAMS();
		}
		let user = await this.model.findOne({
			where: {
				username: params.username,
			},
		});
		
		if (user) 	return ERR.ERR().setMessage("用户已存在");

		user = await this.model.create({
			username: params.username,
			password: params.password,
		});

		if (!user) return ERR.ERR();
		user = user.get({plain:true});

		const token = util.jwt_encode({
			userId: user.id, 
			username: user.username
		}, config.secret);

		user.token = token;

		return ERR.ERR_OK().setData(user);
	}

	async login(ctx) {
		const params = ctx.state.params;
		let user = await this.model.findOne({
			where: {
				username: params.username,
				password: md5(params.password),
			},
		});
		
		if (!user) {
			return ERR.ERR().setMessage("用户名或密码错误");
		}

		user = user.get({plain:true});

		const token = util.jwt_encode({
			userId: user.id, 
			username: user.username
		}, config.secret);

		user.token = token;

		return ERR.ERR_OK().setData(user);
	}

	async changepwd(ctx) {
		const params = ctx.state.params;
		const userId = ctx.state.user.userId;

		const result = await this.model.update({
			password: params.newpassword,
		}, {
			where: {
				userId: userId,
				password: md5(params.oldpassword),
			}
		});

		if (!result) return ERR.ERR();
		if (result[0] == 0) return ERR.ERR().setMessage("密码错误");

		return ERR.ERR_OK();
	}

	async search(ctx) {
		const params = ctx.state.params;
		const where = {};

		const limit = params.limit && parseInt(params.limit);
		const offset = params.offset && parseInt(params.offset);

		if (params.username) where.username = params.username;

		const result = await this.model.findAll({
			attributes:{
				exclude:["password"],	
			},
			limit,
			offset,
			where,
		});
	
		return ERR.ERR_OK(result);
	}

	static getRoutes() {
		this.pathPrefix = "users";

		const routes = [
		{
			path: "search",
			method: "GET",
			action: "search",
		},
		{
			path: ":id",
			method: "GET",
			action: "findById",
			validate: {
				params: {
					id: joi.number().required(),
				},
			}
		},
		{
			path: ":id",
			method: "PUT",
			action: "update",
			authenticated: true,
			validate: {
				params: {
					id: joi.number().required(),
				},
			}
		},
		{
			path: ":id/changepwd",
			method: ["POST", "PUT"],
			action: "changepwd",
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
		];

		return routes;
	}
}

export default Users;
