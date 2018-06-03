import joi from "joi";
import _ from "lodash";

import ERR from "@@/common/error.js";

export const Controller = class {
	constructor() {
	}

	id(ctx) {
		return parseInt(ctx.params.id);
	}

	async find(ctx) {
		const userId = ctx.state.user.userId;
		const params = ctx.state.params;

		_.map(params, (val, key) => {if (val === "") delete params[key];});

		const where = {...params, userId};
		let result =  await this.model.find({where});

		return ERR.ERR_OK(result);
	}

	async findOne(ctx) {
		const id = this.id(ctx);
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
		const id = this.id(ctx);
		const userId = ctx.state.user.userId;

		let result = await this.model.delete({
			where: {
				userId,
				id,
			}
		});

		return ERR.ERR_OK(result);
	}

	async update(ctx) {
		const params = ctx.state.params;
		const id = this.id(ctx);
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
					id: joi.number().required(),
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
