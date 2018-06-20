import joi from "joi";

import Controller from "@/controllers/controller.js";
import ERR from "@@/common/error.js";

export const Sites = class extends Controller {
	constructor() {
		super();
	}

	async create(ctx) {
		const params = ctx.state.params;
		const userId = ctx.state.user.userId;
		params.userId = userId;

		let data = await this.model.findOne({
			where: {
				userId:userId,
				sitename: params.sitename,	
			}
		});
		
		if (data) return ERR.ERR().setMessage("站点已存在");

		data = await this.model.create(params);	
		if (!data) return ERR.ERR();

		data = data.get({plain:true});

		return ERR.ERR_OK().setData(data);
	}

	//async find(ctx) {
		//const params = ctx.state.params;
		//const userId = ctx.state.user.userId;
		//const username = ctx.state.user.username;

		//const where = {};

		//if (params.userId) where.userId = params.userId;

		//if (params.owned && userId) {
			//where.userId = userId;
			//delete where.public;
		//}

		//let data = await this.model.findAll({
			//where: where,
		//});

		//if (!data) return ERR.ERR();

		//return ERR.ERR_OK().setData(data);
	//}

	//async addGroup(ctx) {
		//const params = ctx.state.params;
		//const id = ctx.params.id;
		//const userId = ctx.state.user.userId;

		//let data = await this.model.findOne({
			//where: {
				//id: id,
				//userId: userId,
			//}
		//});

		//if (!data) return ERR.ERR_PARAMS();

		//let result = await groupMembersModel.upsert({
			//userId: userId,
			//siteId: id,
			//groupId: params.groupId,
			//level: params.level,
		//});

		//return ERR.ERR_OK(result);
		
	//}

	//async removeGroup(ctx) {
		//const id = ctx.params.id;
		//const groupId = ctx.params.groupId;
		//const userId = ctx.state.user.userId;

		//let result = await groupMembersModel.destroy({
			//userId: userId,
			//siteId: id,
			//groupId: groupId,
		//});

		//return ERR.ERR_OK(result);
	//}

	static getRoutes() {
		this.pathPrefix = "sites";
		const baseRoutes = super.getRoutes();
		const routes = [
		//{
			//path: ":id/groups",
			//method: "post",
			//action: "addGroup",
			//authenticated: true,
			//validate: {
				//params: {
					//id: joi.number().required(),
				//},
				//body: {
					//groupId: joi.number().required(),
				//},
			//}
		//},
		//{
			//path: ":id/groups/:groupId",
			//method: "delete",
			//action: "removeGroup",
			//authenticated: true,
			//validate: {
				//params: {
					//id: joi.number().required(),
					//groupId: joi.number().required(),
				//},
			//},
		//},
		];

		//return routes;
		return routes.concat(baseRoutes);
	}
}

export default Sites;

