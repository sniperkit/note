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

	static getRoutes() {
		this.pathPrefix = "sites";
		const baseRoutes = super.getRoutes();
		const routes = [
		];

		//return routes;
		return routes.concat(baseRoutes);
	}
}

export default Sites;

