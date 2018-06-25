import joi from "joi";
import _ from "lodash";

import Controller from "@/controllers/controller.js";
import models from "@/models";

import consts from "@@/common/consts.js";
import ERR from "@@/common/error.js";
import qiniu from "@/models/qiniu.js";
import gitlab from "@@/common/api/gitlab.js";
import util from "@@/common/util.js";

const storage = qiniu;

function writeGitFile(params) {
	const path = params.key;
	const options = {
		content: params.content,
		commit_message: "note site create or update",
	}

	gitlab.upsertFile(params.key, {content:params.content});
}

function writeGitFile(params) {
	const path = params.key;
	const options = {
		content: params.content,
		commit_message: "note site create or update",
	}

	gitlab.upsertFile(params.key, {content:params.content});
}

export const Pages = class extends Controller {
	constructor() {
		super();
	}

	async getByKey(ctx) {
		const username = ctx.state.user.username;
		const params = ctx.state.params;
		const key = params.key;

		let result = await this.model.findOne({where:{key}});
		result = result ? result.get({plain:true}) : {key};
		
		if (!result.hash) {
			result.content = await storage.get(key).then(ret => ret.getData());
		}

		return ERR.ERR_OK(result);
	}

	async deleteByKey(ctx) {
		const params = ctx.state.params;

		let result = await this.model.delete({where:{key}});

		return ERR.ERR_OK(result);
	}

	async upsert(ctx) {
		const params = ctx.state.params;

		if (!params.key) {
			return ERR.ERR_PARAMS();
		}

		writeGitFile(params);
		storage.upload(params.key, params.content);

		const result = await this.model.upsert(params);

		return ERR.ERR_OK(result);
	}

	async search(ctx) {
		const params = ctx.state.params;
		const where = {};

		if (params.folder) where.folder = params.folder;

		const list = await this.model.findAll({where});

		return ERR.ERR_OK(list);	
	}
	async qiniuImport(ctx) {
		const params = ctx.state.params;
		let marker = undefined;
		let keys = {};
		do {
			let result = await storage.list(params.prefix || "", 200, marker);
			if (result.isErr()) return result;
			let data = result.getData();
			let items = data.items;
			marker = data.marker;

			for (let i = 0; i < items.length; i++) {
				let item = items[i];
				let key = item.key;
				let folder = util.getFolderByKey(key);

				if (!_.endsWith(key, ".md")) continue;
				await this.model.upsert({
					key: item.key,
					folder: folder,
				});

				do {
					key = folder;
					folder = util.getFolderByKey(key);
					
					if (keys[key]) continue;

					await this.model.upsert({
						key:key,
						folder: folder,
					});

					keys[key] = true;
				} while(folder);
			}

		} while(marker);

		return ERR.ERR_OK();
	}

	static getRoutes() {
		this.pathPrefix = "pages";
		const baseRoutes = super.getRoutes();

		const routes = [
		{
			path: "qiniuImport",
			method: "get",
			action: "qiniuImport",
		},
		{
			path:"getByKey",
			action: "getByKey",
			method: "GET",
			validate: {
				query: {
					key: joi.string().required(),
				},
			}
		},
		{
			path:"deleteByKey",
			action: "deleteByKey",
			method: "DELETE",
			validate: {
				query: {
					key: joi.string().required(),
				},
			}
		},
		{
			path:"search",
			action: "search",
			method: ["GET", "POST"],
		},
		];

		return routes.concat(baseRoutes);
	}
}

export default Pages;
