import _ from "lodash";
import joi from "joi";
import axios from "axios";

import config from "@/config.js";
import models from "@/models";
import Controller from "@/controllers/controller.js";
import {
	USER_ACCESS_LEVEL_NONE,
	USER_ACCESS_LEVEL_READ,
	USER_ACCESS_LEVEL_WRITE,
} from "@@/common/consts.js";

const keepworkApiUrlPrefix = config.keepworkApiUrlPrefix;

export const Convert = class extends Controller {
	constructor() {
		super();
	}

	async convert() {
		await this.users();
		await this.sites();
		await this.groups();
		await this.groupMembers();
		await this.siteGroups();


	}

	async users() {
		const usersModel = models["users"];
		const datas = await axios.get(keepworkApiUrlPrefix + "user/export").then(res => res.data);

		for (let i = 0; i < datas.length; i++) {
			let data = datas[i];
			let user = {
				id: data._id,
				username: data.username,
				password: data.password,
				nickname: data.displayName,
				sex: data.sex,
				description: data.introduce,
				portrait: data.portrait,
				cellphone: data.cellphone || (data.realNameInfo && data.realNameInfo.cellphone),
			};

			await usersModel.upsert(user);
		}

		return datas;
	}

	async sites() {
		const usersModel = models["users"];
		const sitesModel = models["sites"];
		const datas = await axios.get(keepworkApiUrlPrefix + "website/export").then(res => res.data);
		for (let i = 0; i < datas.length; i++) {
			let data = datas[i];
			let user = await usersModel.findOne({where:{username:data.username}});
			if (!user) continue;
			let site = {
				userId: user.id,
				id: data._id,
				sitename: data.name,
				description: data.desc,
				visibility: data.visibility == "public" ? 0 : 1,
				displayName: data.displayName,
				logoUrl: data.logoUrl,
			};

			await sitesModel.upsert(site);
		}

		return datas;
	}

	async groups() {
		const usersModel = models["users"];
		const groupsModel = models["groups"];
		const datas = await axios.get(keepworkApiUrlPrefix + "group/export").then(res => res.data);
		for (let i = 0; i < datas.length; i++) {
			let data = datas[i];
			let user = await usersModel.findOne({where:{username:data.username}});
			if (!user) continue;
			let group = {
				userId: user.id,
				id: data._id,
				groupname: data.groupname,
			};

			await groupsModel.upsert(group);
		}

		return datas;

	}

	async groupMembers() {
		const usersModel = models["users"];
		const groupsModel = models["groups"];
		const groupMembersModel = models["groupMembers"];
		const datas = await axios.get(keepworkApiUrlPrefix + "group_user/export").then(res => res.data);
		for (let i = 0; i < datas.length; i++) {
			let data = datas[i];
			let user = await usersModel.findOne({where:{username:data.username}});
			let member = await usersModel.findOne({where:{username: data.memberName}});
			if (!user || !member) continue;
			let group = await groupsModel.findOne({where: {
				userId: user.id,
				groupname: data.groupname,
			}});
			if (!group) continue;
			let groupMember = {
				id: data._id,
				userId: user.id,
				memberId: member.id,
				groupId: group.id,
			};

			await groupMembersModel.upsert(groupMember);
		}

		return datas;
	}

	async siteGroups() {
		const usersModel = models["users"];
		const sitesModel = models["sites"];
		const groupsModel = models["groups"];
		const siteGroupsModel = models["siteGroups"];
		const datas = await axios.get(keepworkApiUrlPrefix + "site_group/export").then(res => res.data);
		for (let i = 0; i < datas.length; i++) {
			let data = datas[i];
			let user = await usersModel.findOne({where:{username:data.username}});
			let groupUser = await usersModel.findOne({where:{username: data.groupUsername}});
			if (!user || !groupUser) continue;
			let site = await sitesModel.findOne({where:{userId:user.id, sitename:data.sitename}});
			let group = await groupsModel.findOne({where: {
				userId: groupUser.id,
				groupname: data.groupname,
			}});
			if (!group || !site) continue;
			let siteGroup = {
				id: data._id,
				userId: user.id,
				siteId: site.id,
				groupId: group.id,
				level: data.level > 20 ? USER_ACCESS_LEVEL_WRITE : (data.level > 10 ? USER_ACCESS_LEVEL_READ : USER_ACCESS_LEVEL_NONE),
			};

			await siteGroupsModel.upsert(siteGroup);
		}

		return datas;

	}

	static getRoutes() {
		this.pathPrefix = "convert";

		const routes = [
		{
			path: "",
			method:"GET",
			action: "convert",
		},
		{
			path: "users",
			method:"GET",
			action: "users",
		},
		{
			path: "sites",
			method:"GET",
			action: "sites",
		},
		{
			path: "groups",
			method:"GET",
			action: "groups",
		},
		{
			path: "groupMembers",
			method:"GET",
			action: "groupMembers",
		},
		{
			path: "siteGroups",
			method:"GET",
			action: "siteGroups",
		},
		];
		
		return routes;
	}
}

export default Convert;
