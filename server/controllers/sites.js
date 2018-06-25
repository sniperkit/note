import joi from "joi";
import _ from "lodash";

import Controller from "@/controllers/controller.js";
import ERR from "@@/common/error.js";
import {
	ENITY_VISIBILITY_PUBLIC,
	ENITY_VISIBILITY_PRIVATE,

	USER_ACCESS_LEVEL_NONE,
	USER_ACCESS_LEVEL_READ,
	USER_ACCESS_LEVEL_WRITE,
} from "@@/common/consts.js";

export const Sites = class extends Controller {
	constructor() {
		super();
	}

	async create(ctx) {
		const params = ctx.state.params;
		const userId = ctx.state.user.userId;
		params.userId = userId;
		params.visibility = ENITY_VISIBILITY_PUBLIC;

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

	async update(ctx) {
		const id = ctx.params.id;
		const userId = ctx.state.user.userId;
		const params = ctx.state.params;

		delete params.sitename;

		const result = await this.model.update(params, {where:{id, userId}});
		
		return ERR.ERR_OK(result);
	}

	// 获取站点成员的访问权
	async getSiteMemberLevel(ctx) {
		const id = ctx.params.id;
		const params = ctx.state.params;
		const memberId = params.memberId;
		
		let data = await this.model.findOne({where:{id}});
		if (!data) return ERR.ERR_PARAMS();
		data = data.get({plain: true});

		let level = USER_ACCESS_LEVEL_READ;
		if (data.visibility == ENITY_VISIBILITY_PRIVATE) level = USER_ACCESS_LEVEL_NONE;

		const sql = `select siteGroups.level 
			from sites, siteGroups, groupMembers 
			where sites.id = siteGroups.siteId and siteGroups.groupId = groupMembers.groupId 
			and sites.id = :siteId and groupMembers.memberId = :memberId`;

		const result = await this.model.query(sql, {
			replacements: {
				siteId: id,
				memberId: memberId,
			}
		});

		_.each(result, val => level = level < val.level ? val.level : level);

		return ERR.ERR_OK(level);
	}

	async getJoinSites(ctx) {
		const userId = ctx.state.user.userId;
		const params = ctx.state.params;
		const level = params.level || USER_ACCESS_LEVEL_NONE;

		const sql = `select sites.*, users.username
			from sites, siteGroups, groupMembers, users 
			where sites.id = siteGroups.siteId and siteGroups.groupId = groupMembers.groupId and sites.userId = users.id
			and groupMembers.memberId = :memberId and siteGroups.level >= :level`;

		const result = await this.model.query(sql, {
			replacements: {
				memberId: userId,
				level: level,
			}
		});

		return ERR.ERR_OK(result);
	}

	static getRoutes() {
		this.pathPrefix = "sites";
		const baseRoutes = super.getRoutes();
		const routes = [
		{
			path:"getJoinSites",
			method:"GET",
			action:"getJoinSites",
			authenticated: true,
			validate: {
				query: {
					level:joi.number(),
				},
			},
		}, 
		{
			path:"",
			method:"POST",
			action:"create",
			authenticated: true,
			validate: {
				body: {
					sitename:joi.string().required(),
				},
			},
		}, 
		{
			path:":id/getSiteMemberLevel",
			method:"GET",
			action:"getSiteMemberLevel",
			validate: {
				params: {
					id:joi.number().required(),
				},
				query: {
					memberId:joi.number().required(),
				},
			},
		}
		];

		//return routes;
		return routes.concat(baseRoutes);
	}
}

export default Sites;

