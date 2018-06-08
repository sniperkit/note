import joi from "joi";

import Controller from "./controller.js";
import { models , sequelize} from "@/models";

const userModel = models["users"];
const groupMembersModel = models["groupMembers"];

import ERR from "@@/common/error.js";

export const GroupMembers = class extends Controller {
	constructor() {
		super();

		this.model = groupMembersModel;
	}

	async create(ctx) {
		const params = ctx.state.params;
		params.userId = ctx.state.user.userId;

		const user = userModel.findOne({
			where: {
				id: params.memberId,
			}
		});

		if (!user) {
			return ERR.ERR().setMessage("用户不存在");
		}

		let result = await this.model.create(params);

		return ERR.ERR_OK(result);
	}

	async update(ctx) {

	}

	static getRoutes() {
		this.pathPrefix = "groupMembers";
		const baseRoutes = super.getRoutes();

		const routes = [
		{
			method: "POST",
			action: "create",
			authentated: true,
			validate: {
				body: {
					memberId: joi.number().required(),
					level: joi.number().required(),
					groupId: joi.number().required(),
				},
			}
		},
		];

		return routes.concat(baseRoutes);
	}
}



export default GroupMembers;
