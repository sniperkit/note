import _ from "lodash";
import middlewares from "@/middlewares/index.js";

import ERR from "@@/common/error.js";
import util from "@@/common/util.js";
import config from "@/config.js";

import tests from "./tests.js";
import code from "./code.js";
import oauth from "./oauth.js";
import users from "./users.js";
import dataSource from "./dataSource.js";
import siteDataSources from "./siteDataSources.js";
import qiniu from "./qiniu.js";
import files from "./files.js";
import sites from "./sites.js";
import siteGroups from "./siteGroups.js";
import siteMembers from "./siteMembers.js";
import groups from "./groups.js";
import groupMembers from "./groupMembers.js";
import domains from "./domains.js";
import pages from "./pages.js";
import oauthUsers from "./oauthUsers.js";
import oauthApps from "./oauthApp.js";
import favorites from "./favorites.js";
import roles from "./roles.js";
import datas from "./datas.js";
import convert from "./convert.js";
import trades from "./trades.js";

import models from "@/models/index.js";

const {validate, validated, pagination} = middlewares;

export const controllers = {
	convert,
	tests,
	code,
	oauth,
	users,
	dataSource,
	siteDataSources,
	qiniu,
	files,
	sites,
	siteGroups,
	siteMembers,
	groups,
	groupMembers,
	domains,
	pages,
	oauthUsers,
	oauthApps,
	favorites,
	roles,
	datas,
	trades,
}

const rolesModel = models["roles"];

const getParams = (ctx) => {
	const method = ctx.request.method.toLowerCase();
	let params = null;

	if (method == "get" || method == "delete" || method == "head" || method == "options") {
		params = ctx.request.query;
	} else {
		params = ctx.request.body;
	}

	params = ctx.state.params || params || {};

	return params;
	//return _.merge(params, ctx.params);
}

const test = (ctx) => {
	//const token = ctx.cookies.get("token");
	//console.log(token);
	//console.log(util.jwt_decode(token, config.secret, false));
}


export const registerControllerRouter = function(router) {
	_.each(controllers, Ctrl => {
		_.each(Ctrl.getRoutes(), (route) => {
			const methods = _.isArray(route.method) ? route.method : [route.method || "get"];
			_.each(methods, method => {
				method = _.lowerCase(method);
				
				const path = (Ctrl.pathPrefix || "") + "/" + (route.path || "");
				
				//console.log(path, method);
				router[method](path, 
						pagination, 
						validated(route.validated), 
						validate(route.validate), 
						async (ctx, next) => {

					// 认证中间件
					if (route.authenticated && !ctx.state.user) {
						ctx.body = ERR.ERR_UNATUH();
						return;
					}

					ctx.state.user = ctx.state.user || {};
					ctx.state.user.token = ctx.state.token;
					//console.log(ctx.request.header);
					//console.log(ctx.state.user);
					ctx.state.params = getParams(ctx);

					if (rolesModel.isExceptionUser(ctx.state.user.roleId)) {
						return ERR.ERR_USER_EXCEPTION();
					}

					try {
						const ctrl = new Ctrl();
						const body = await ctrl[route.action](ctx);	
						ctx.body = body || ctx.body;
					} catch(e) {
						console.log(e);
						console.log(e.name);
						ctx.status = 500;

						if (e.name == "SequelizeUniqueConstraintError") {
							ctx.body = "记录已存在";
						} else if(e.name == "SequelizeValidationError") {
							ctx.body = "参数错误";
						}else {
							ctx.body = "请求无法处理";
						}
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
