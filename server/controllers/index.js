import _ from "lodash";
import {validate} from "../middlewares/index.js";

import {ERR_UNATUH, ERR_OK, ERR_PARAMS} from "../../common/error.js";

import code from "./code.js";
import oauth from "./oauth.js";
import user from "./user.js";
import dataSource from "./dataSource.js";
import gitlab from "./gitlab.js"; 
import qiniu from "./qiniu.js";
import files from "./files.js";
import site from "./site.js";

export const controllers = {
	code,
	oauth,
	user,
	dataSource,
	gitlab,
	qiniu,
	files,
	site,
}

const getParams = (ctx) => {
	const method = ctx.request.method.toLowerCase();
	let params = null;

	if (method == "get" || method == "delete" || method == "head" || method == "options") {
		params = ctx.request.query;
	} else {
		params = ctx.request.body;
	}

	return ctx.state.params || params || {};
}

export const registerControllerRouter = function(router) {
	_.each(controllers, ctrl => {
		_.each(ctrl.getRoutes(), (route) => {
			const methods = _.isArray(route.method) ? route.method : [route.method || "get"];
			_.each(methods, method => {
				method = _.lowerCase(method);
				//console.log(method, route.path);
				router[method](route.path, validate(route.validate), async (ctx, next) => {
					// 认证中间件
					if (route.authentated && !ctx.state.user) {
						ctx.body = ERR_UNATUH;
						return;
					}

					ctx.state.user = ctx.state.user || {};
					ctx.state.params = getParams(ctx);
					try {
						const body = await ctrl[route.action](ctx);	
						ctx.body = body || ctx.body;
					} catch(e) {
						console.log(e);
						ctx.status = 500;
						ctx.body = "请求无法处理";
					}
					//console.log(ctx.body);
				});
			})
			
		})
	});

	router.all("/*", (ctx, next) => {
		ctx.status = 404;
	});
}

export default registerControllerRouter;
