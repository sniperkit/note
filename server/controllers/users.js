import _ from "lodash";
import joi from "joi";

import models from "@/models";
import Controller from "@/controllers/controller.js";

import util from "@@/common/util.js";
import {ERR, ERR_OK, ERR_PARAMS} from "@@/common/error.js";
import config from "@/config.js";

const userModel = models["users"];

export const Users = class extends Controller {
	constructor() {
		super();
	}

	async setBaseInfo(ctx) {
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

	async update(ctx) {
		return await this.setBaseInfo(ctx);
	}

	async register(ctx) {
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

	async login(ctx) {
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

	async modifyPassword(ctx) {
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
	
		return ERR_OK(result);
	}

	static getRoutes() {
		this.pathPrefix = "users";
		const baseRoutes = super.getRoutes();

		const routes = [
		{
			path: "search",
			method: "GET",
			action: "search",
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
		];

		return routes;
		//return routes.concat(baseRoutes);
	}
}

export default Users;
