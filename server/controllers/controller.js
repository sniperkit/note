import joi from "joi";
import _ from "lodash";

import models from "@/models/index.js";
import ERR from "@@/common/error.js";

export const Controller = class {
	constructor() {
		this.modelName = _.camelCase(this.constructor.name);
	}

	get model() {
		return models[this.modelName];
	}

	async find(ctx) {
		const userId = ctx.state.user.userId;
		const params = ctx.state.params || {};

		_.map(params, (val, key) => {if (val === "" || val == undefined) delete params[key];});

		const where = {...params, userId};
		let result =  await this.model.find({where});

		return ERR.ERR_OK(result);
	}

	async findOne(ctx) {
		const id = ctx.params.id;
		const userId = ctx.state.user.userId;
		let result = await this.model.findOne({
			where: {
				userId,
				id,
			}
		});

		return ERR.ERR_OK(result);
	}

	async create(ctx) {
		const params = ctx.state.params;
		const userId = ctx.state.user.userId;
		
		params.userId = userId;

		let result = await this.model.create(params);

		return ERR.ERR_OK(result);
	}

	async delete(ctx) {
		const id = ctx.params.id;
		const userId = ctx.state.user.userId;

		let result = await this.model.destroy({
			where: {
				userId,
				id,
			}
		});

		return ERR.ERR_OK(result);
	}

	async update(ctx) {
		const params = ctx.state.params;
		const id = ctx.params.id;
		const userId = ctx.state.user.userId;
		
		params.userId = userId;
		let result =  await this.model.update(params, {
			where: {
				userId,
				id,
			}
		});

		return ERR.ERR_OK(result);
	}

	static getRoutes() {
		const routes = [
		{
			path: "",
			method: "GET",
			action: "find",
			authentated: true,
		},
		{
			path: ":id",
			method: "GET",
			action: "findOne",
			authentated: true,
			validate: {
				params: {
					id: joi.number().required(),
				},
			}
		},
		{
			path: "",
			method: "POST",
			action: "create",
			authentated: true,
		},
		{
			path: ":id",
			method: "PUT",
			action: "update",
			authentated: true,
			validate: {
				params: {
					id: joi.number().required(),
				},
			}
		},
		{
			path: ":id",
			method: "DELETE",
			action: "delete",
			authentated: true,
			validate: {
				params: {
					id: joi.number().required(),
				},
			}
		},
		];

		return routes;
	}
}


export default Controller;
