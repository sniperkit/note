import joi from "joi";

import Controller from "@/controllers/controller.js";
import models from "@/models";

import consts from "@@/common/consts.js";
import ERR from "@@/common/error.js";

const siteGroupsModel = models["siteGroups"];
const sitesModel = models["sites"];

export const SiteGroups = class extends Controller {
	// 构造函数
	constructor() {
		super();

		this.model = siteGroupsModel;
	}

	// 创建记录
	async create(ctx) {
		const params = ctx.state.params;
		const userId = ctx.state.user.userId;

		params.userId = userId;

		let result = await sitesModel.findOne({
			where: {
				userId: userId,
				id: params.siteId,
			}
		});

		if (!result) return ERR.ERR_PARAMS();


		result = await this.model.create(params);

		return ERR.ERR_OK(result);
	}

	// 注册路由
	static getRoutes() {
		this.pathPrefix = "siteGroups";
		const baseRoutes = super.getRoutes();
		const routes = [
		{
			method: "POST",
			action: "create",
			authentated: true,
			validate: {
				body: {
					siteId: joi.number().required(),
					level: joi.number().required(),
					groupId: joi.number().required(),
				},
			},
		},
		];

		return routes.concat(baseRoutes);
	}
}

export default SiteGroups;
