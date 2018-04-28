import qiniu from "qiniu";
const uuidv1 = require('uuid/v1');
import config from "../config.js";
import {ERR_OK, ERR} from "../common/error.js";

const accessKey = config.qiniu.accessKey;
const secretKey = config.qiniu.secretKey;
const bucketName = config.qiniu.bucketName;
const bucketDomian = config.qiniu.bucketDomian;

export const Qiniu = function() {
}

function getUploadToken(options) {
	options = options || {
		scope: bucketName,
		expires: 3600 * 24 * 365,
	};

	const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
	const putPolicy = new qiniu.rs.PutPolicy(options);
	const token = putPolicy.uploadToken(mac);

	return token;
}

// 上传 MD IMG 小文件
Qiniu.prototype.upload = async function(ctx) {
	const params = ctx.request.body;

	const config = new qiniu.conf.Config();
	config.zone = qiniu.zone.Zone_z2; // 华南

	const formUploader = new qiniu.form_up.FormUploader(config);
	const putExtra = new qiniu.form_up.PutExtra();
	const uploadToken = getUploadToken();

	const result = await new Promise((resolve, reject) => {
		formUploader.put(uploadToken, params.key, params.content, putExtra, function(respErr, respBody, respInfo){
			if (respErr || respInfo.statusCode != 200) {
				return reject(ERR.setMessage(respInfo.statusCode + respBody));
			} 

			console.log(respBody);
			return resolve(ERR_OK);
		});
	});

	return result;
}

Qiniu.prototype.getUid = function() {
	const uid = uuidv1();
	return ERR_OK.setData({uid:uid});
}

Qiniu.prototype.getUploadToken = function() {
	const options = {
		scope: bucketName,
		expires: 3600 * 24 * 365,
		callbackUrl: config.QiniuService.baseURL + "qiniu/callback",
		callbackBody: '{"key":"$(key)","hash":"$(etag)","size":$(fsize),"bucket":"$(bucket)","uid":"$(x:uid)"}',
		callbackBodyType: 'application/json',
	}

	const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
	const putPolicy = new qiniu.rs.PutPolicy(options);
	const token = putPolicy.uploadToken(mac);

	return ERR_OK.setData({token:token});
}

Qiniu.prototype.getDownloadUrl = function(ctx) {
	const params = ctx.state.params || ctx.request.body || {};
	const key = params.key;
	const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
	const config = new qiniu.conf.Config();
	const bucketManager = new qiniu.rs.BucketManager(mac, config);
	const privateBucketDomain = bucketDomian;
	const deadline = parseInt(Date.now() / 1000) + (parseInt(params.expires || "") || (3600 * 24 * 365)); 
	const privateDownloadUrl = bucketManager.privateDownloadUrl(privateBucketDomain, key, deadline);
	return  privateDownloadUrl;
}

Qiniu.prototype.callback = function(ctx) {
	const params = ctx.request.body;
	const {key} = params;
	console.log(params);

	ctx.state.params = params;	
	const downloadUrl = this.getDownloadUrl(ctx)

	return ERR_OK.setData({downloadUrl: downloadUrl});
}

Qiniu.prototype.getRoutes = function() {
	const prefix = "qiniu";
	const routes = [
	{
		path: prefix + "/upload",
		method: "post",
		action: "upload",
	},
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
