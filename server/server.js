import Koa from "koa";
import cors from "@koa/cors";
import jwt from "koa-jwt";
import Router from "koa-router";
import KoaBody from "koa-body";
import Static from "koa-static";
import wurl from "wurl";
import _ from "lodash";
import axios from "axios";

import Files from "./controllers/files.js";
import registerControllerRouter from "./controllers/index.js";


//import log from "./log.js";
import config from "./config.js";
import models from "./models/index.js";
import api from "../common/api/note.js";

const files = new Files();

api.options.baseURL = config.baseURL;

const apiRouter = new Router({
	prefix: config.apiUrlPrefix,
});
registerControllerRouter(apiRouter);

export default (app, views) => {
	const viewRouter = new Router({});

	app
	//.use(Static("../.nuxt/"))
	.use(cors())
	.use(KoaBody())
	.use(jwt({secret:config.secret, passthrough:true, cookie:"token"}))
	.use(apiRouter.routes())
	.use(apiRouter.allowedMethods())
	.use(viewRouter.routes());

	app.use(async (ctx, next) => {
		const path = ctx.request.path;
		const excludeList = [
			"/_",
			"/favicon.ico",
			"/_nuxt/",
			"/note"
		]
		if (path.split("/").length < 3 || path.substring(path.lastIndexOf("/")).indexOf(".") < 0) {
			return await next();
		}
		for (let i = 0; i < excludeList.length; i++) {
			if (path.indexOf(excludeList[i]) == 0) {
				return await next();
			}
		}

		console.log(path);
		ctx.state.params = {filename:path.substring(1)};
		files.raw(ctx);
	});
}


