import qiniu from "qiniu";
const uuidv1 = require('uuid/v1');
import config from "../config.js";
import {ERR_OK} from "../common/error.js";

const accessKey = config.qiniu.accessKey;
const secretKey = config.qiniu.secretKey;
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

export const Qiniu = function() {
}


Qiniu.prototype.getUid = function() {
	const uid = uuidv1();
	return ERR_OK.setData({uid:uid});
}

Qiniu.prototype.getUploadToken = function() {
	const options = {
		scope:"keepwork-dev",
		expires: 3600 * 24 * 365,
		callbackUrl: config.outerBaseURL + "qiniu/callback",
		callbackBody: '{"key":"$(key)","hash":"$(etag)","size":$(fsize),"bucket":"$(bucket)","uid":"$(x:uid)"}',
		callbackBodyType: 'application/json'
	}

	const putPolicy = new qiniu.rs.PutPolicy(options);
	const token = putPolicy.uploadToken(mac);

	return ERR_OK.setData({token:token});
}

Qiniu.prototype.callback = function(ctx) {
	const params = ctx.request.body;
	console.log(params);

	return ERR_OK;
}

Qiniu.prototype.getRoutes = function() {
	const prefix = "qiniu";
	const routes = [
	{
		path: prefix + "/getUid",
		method: "get",
		action: "getUid",
	},
	{
		path: prefix + "/getUploadToken",
		method: "get",
		action: "getUploadToken",
	},
	{
		path: prefix + "/callback",
		method: "post",
		action: "callback",
	},
	];

	return routes;
}


export default new Qiniu();
