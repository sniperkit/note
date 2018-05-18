import Koa from "koa";
import cors from "@koa/cors";
import jwt from "koa-jwt";
import Router from "koa-router";
import KoaBody from "koa-body";
import Static from "koa-static";
import wurl from "wurl";
import _ from "lodash";
import axios from "axios";

import registerControllerRouter from "./controllers/index.js";

//import log from "./log.js";
import config from "./config.js";
import models from "./models/index.js";
import api from "../common/api/note.js";

api.options.baseURL = config.baseURL;

const apiRouter = new Router({
	prefix: config.apiUrlPrefix,
});
registerControllerRouter(apiRouter);

const  facebookCallback = async (ctx) => {
	const facebookAccessTokenUrl = 'https://graph.facebook.com/v3.0/oauth/access_token';
	const facebookUserInfoUrl = 'https://www.googleapis.com/oauth2/v3/tokeninfo';
	const params = ctx.request.query || {};
	console.log("-------------");
	if (!params.code) {
		return ;
	}
	params.grant_type = "authorization_code";
	params.client_id = params.client_id || config.oauth.facebook.clientId;
	params.client_secret = params.client_secret || config.oauth.facebook.clientSecret;
	params.redirect_uri = params.redirect_uri || config.oauth.facebook.redirectUri;
	
	console.log(params);

	const data = await axios.get(facebookAccessTokenUrl, {params}).then(res => res.data).catch(e => console.log(e));
	console.log('-------------');
	console.log(data);
}


export default (app, views) => {
	const viewRouter = new Router({});

	console.log("----------------------");
	axios.get('https://graph.facebook.com/v3.0/oauth/access_token?code=AQC2R7DokrxUzpmdg87kgt8hS6TvnfOZ85zqMkWLisnpcK1nxm95aFdDu-ucaK9TEHS5q98CflploXWObBRTHDjZ40oJJGnbvQHj4IAx5GyxWh_At7drnLBKksfdx4poXqcXBeix37KqnZRwhsvENhi7hF8jAXSdTC4awdTH_2my3wF8vrATtPJHhaXDn4JfdenOMVlC0ZdAenz8q9ZbStKjdgijm7qRRL-c9OG7WVP-yAICW6yZCwJIvTn9aOrfscR5Q9sGPMZjNN96_bGPr2hyVaHJw_Dcs4ofCgyzQmCYlqvgo_rVsPabKpy8OZwFjn70eDGmYtEW55xYzAj8XPNC&grant_type=authorization_code&client_id=1942795522419535&client_secret=1f7bc8761f32b2c8a0923ecc5ebc8b5e&redirect_uri=https:%2F%2Fwxa.keepwork.com%2Fapi%2Fwiki%2Fauth%2Ffacebook').then(res => console.log(res.data)).catch(e => console.log(e));
	viewRouter.all("/api/wiki/auth/facebook", async function(ctx) {
		console.log("==============1");
		await facebookCallback(ctx);
		console.log("==================4");
	});
	viewRouter.all("/auth/facebook", function(ctx){
		console.log("==============2");
		ctx.body = "hello world";
	});

	app
	.use(Static("../.nuxt/"))
	.use(cors())
	.use(KoaBody())
	.use(jwt({secret:config.secret, passthrough:true, cookie:"token"}))
	.use(apiRouter.routes())
	.use(apiRouter.allowedMethods())
	.use(viewRouter.routes());
}

