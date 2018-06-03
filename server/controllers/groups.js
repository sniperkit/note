import joi from "joi";

import Controller from "./controller.js";
import { models , sequelize} from "../models";
import consts from "@@/common/consts.js";
import ERR from "@@/common/error.js";

const groupsModel = models["groups"];
const groupMembersModel = models["groupMembers"];

const USER_ACCESS_LEVEL_NONE = consts.USER_ACCESS_LEVEL.USER_ACCESS_LEVEL_NONE;
const USER_ACCESS_LEVEL_READ = consts.USER_ACCESS_LEVEL.USER_ACCESS_LEVEL_READ;
const USER_ACCESS_LEVEL_WRITE = consts.USER_ACCESS_LEVEL.USER_ACCESS_LEVEL_WRITE;

export const Groups = class extends Controller {
	constructor() {
		super();

		this.model = groupsModel;
	}
	//
	async createMember(ctx) {
		const params = ctx.state.params;
		const id = ctx.params.id;
		const userId = ctx.state.user.userId;

		let data = await this.model.findOne({
			where: {
				id: id,
				userId: userId,
			}
		});

		if (!data) return ERR.ERR_PARAMS();

		let result = await groupMembersModel.create({
			userId: userId,
			groupId: id,
			memberId: params.memberId,
			level: params.level,
		});

		return ERR.ERR_OK(result);
	}

	async deleteMember(ctx) {
		const id = ctx.params.id;
		const memberId = ctx.params.memberId;
		const userId = ctx.state.user.userId;

		let result = await groupMembersModel.delete({
			where: {
				userId: userId,
				groupId: id,
				memberId: memberId,
			}
		});

		return ERR.ERR_OK(result);
	}

	async findMembers(ctx) {
		const id = ctx.params.id;
		const userId = ctx.state.user.userId;
		const params = ctx.state.params;
		const memberId = params.memberId && parseInt(params.memberId);

		let sql = 'select gm.id, userId, groupId, memberId, username as memberName, nickname  from keepwork.groupMembers as gm, keepwork.users as u where gm.memberId = u.id and groupId=:groupId and userId=:userId';

		if (memberId) sql += " and memberId=:memberId";
		let result = await sequelize.query(sql, {
			type: sequelize.QueryTypes.SELECT,
			raw: true,
			replacements:{
				userId: userId,
				groupId: id,
				memberId: memberId,
			},	
		});

		return ERR.ERR_OK(result);
	}

	static getRoutes() {
		this.pathPrefix = "groups";
		const baseRoutes = super.getRoutes();
		const routes = [
		{
			path: ":id/members",
			method: "GET",
			action: "findMembers",
			authentated: true,
			validate: {
				params: {
					id: joi.number().required(),
				},
			}
		},
		{
			path: ":id/members",
			method: "POST",
			action: "createMember",
			authentated: true,
			validate: {
				params: {
					id: joi.number().required(),
				},
				body: {
					memberId: joi.number().required(),
					level: joi.number().valid([USER_ACCESS_LEVEL_NONE, USER_ACCESS_LEVEL_READ, USER_ACCESS_LEVEL_WRITE]),
				},
			}
		},
		{
			path: ":id/members/:memberId",
			method: "DELETE",
			action: "deleteMember",
			authentated: true,
			validate: {
				params: {
					id: joi.number().required(),
					memberId: joi.number().required(),
				},
			}
		}
		];

		return baseRoutes.concat(routes);
	}
}

//Groups.prototype.find = async function(ctx) {
	//const userId = ctx.state.user.userId;

	//let result = await this.model.findAll({
		//where: {
			//userId: userId,
		//}
	//});

	//return ERR.ERR_OK(result);
//}

//Groups.prototype.findOne = async function(ctx) {
	//const id = ctx.params.id;
	//const userId = ctx.state.user.userId;

	//let data = this.model.findOne({
		//where: {
			//id: id,
			//userId: userId,
		//}
	//});

	//return ERR.ERR_OK(data);
//}

//Groups.prototype.create = async function(ctx) {
	//const params = ctx.state.params;
	//const userId = ctx.state.user.userId;
	//params.userId = userId;
	
	//let data = await this.model.create(params);

	////data = data.get({plain:true});

	//return ERR.ERR_OK(data);
//}

//Groups.prototype.update = async function(ctx) {
	//const params = ctx.state.params;
	//const id = ctx.params.id;
	//const userId = ctx.state.user.userId;

	//let data = await this.model.update(params, {
		//where: {
			//id: id,
			//userId: userId,
		//}
	//})

	//return ERR.ERR_OK(data);
//}

//Groups.prototype.delete = async function(ctx) {
	//const id = ctx.params.id;
	//const userId = ctx.state.user.userId;

	//let data = await this.model.destroy({
		//where: {
			//id: id,
			//userId: userId,
		//}
	//})

	//return ERR.ERR_OK(data);
//}



export default Groups;
