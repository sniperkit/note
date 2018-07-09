import _ from "lodash";
import axios from "axios";
import wurl from "wurl";
import joi from "joi";
import memoryCache from "memory-cache";
import uuidv1 from "uuid/v1";

import config from "@/config.js";
import models from "@/models";
import Controller from "@/controllers/controller.js";
import ERR from "@@/common/error.js";
import util from "@@/common/util.js";

const getUuid = () => uuidv1().replace(/-/g, "");

export const OauthApps = class extends Controller {
	constructor() {
		super();
	}

	authorize(ctx) {
		const user = ctx.state.user.user;
		const params = ctx.state.params;

		const clientId = params.client_id;
		let redirectUrl = params.redirect_uri;

		if (!user.userId) return ctx.redirect("/note/login");
	
		const code = getUuid();
		memoryCache.put(code, {user, code}, 1000 * 60 * 10);

		redirect_uri += "?code=" + code;
		if (params.state) redirectUrl += "&state=" + params.state; 

		return ctx.redirect(redirectUrl);
	}

	async token(ctx) {
		const params = ctx.state.params;
		const code = params.code;

		const data = memoryCache.get(code);
		if (!data) return ERR.ERR(null, "code失效");

		const user = data.user;

		user.clientId = params.client_id;
		
		const access_token = util.jwt_encode(user, config.secret, 3600);
		ctx.cookies.set("token", access_token, {
			httpOnly: false,
			maxAge: config.tokenExpire * 1000,
			overwrite: true,
			domain: "." + config.domain,
		});

		return {
			access_token,
			expires_in: 3600,
			token_type: "Bearer",
			//refresh_token:"",
		}
	}

	static getRoutes() {
		this.pathPrefix = "oauthApps";

		const baseRoutes = super.getRoutes();

		const routes = [
		{
			path: "authorize",
			method: "GET",
			action: "authorize",
			validated: {
				response_type: joi.string().required(),
				client_id: joi.string().required(),
				redirect_uri: joi.string().required(),
			},
		},
		{
			path: "token",
			method: "POST",
			action: "token",
			validated: {
				client_secret: joi.string().required(),
				code: joi.string().required();
				client_id: joi.string().required(),
				client_secret: joi.string().required(),
				redirect_uri: joi.string().required(),
			},
		},
		];

		return routes.concat(baseRoutes);
	}
}

export default OauthApps;
