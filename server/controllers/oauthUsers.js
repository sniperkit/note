import axios from "axios";
import wurl from "wurl";
import joi from "joi";

import config from "@/config.js";

import Controller from "@/controllers/controller.js";
import ERR from "@@/common/error.js";
import {
	OAUTH_SERVICE_TYPE_QQ,
	OAUTH_SERVICE_TYPE_WEIXIN,
	OAUTH_SERVICE_TYPE_GITHUB,
	OAUTH_SERVICE_TYPE_XINLANG,
} from "@@/common/consts.js";

export const OauthUsers = class extends Controller {
	constructor() {
		super();
	}

	async qq(ctx) {

		return "hello worodl";
	}

	async weixin(ctx) {

	}

	async github(ctx) {
		const githubAccessTokenUrl = 'https://github.com/login/oauth/access_token';
		const githubUserInfoUrl = 'https://api.github.com/user';
		const params = ctx.state.params;
		const userId = ctx.state.user.userId;
		params.client_id = params.client_id || config.oauths.github.clientId;
		params.client_secret = params.client_secret || config.oauths.github.clientSecret;
		params.redirect_uri = params.redirect_uri || config.oauths.github.redirectUri;
		
		const queryStr = await axios.get(githubAccessTokenUrl, {params}).then(res => res.data);
		if (queryStr.indexOf("error=") == 0){
			return ERR.ERR();
		}
		const data = wurl("?", "http://localhost/index?" + queryStr);
		const access_token = data.access_token;

		const userinfo = await axios.get(githubUserInfoUrl + "?access_token=" + access_token).then(res => res.data);
		const externalId = userinfo.id;
		const externalUsername = userinfo.login;
		const type = OAUTH_SERVICE_TYPE_GITHUB;

		const result = await this.model.upsert({externalId, externalUsername, type, userId});

		return ERR.ERR_OK(result);
	}

	async xinlang(ctx) {

	}

	static getRoutes() {
		this.pathPrefix = "oauthUsers";
		const baseRoutes = super.getRoutes();
		const routes = [
		{
			path:"qq",
			method: "ALL",
			action: "qq",
		},
		{
			path:"github",
			method: "ALL",
			action: "github",
		},
		];

		return routes.concat(baseRoutes);
	}
}

export default OauthUsers;
