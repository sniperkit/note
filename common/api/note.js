import axios from "axios";

import {Err} from "../error.js";

export function httpRequest(method, url, data, config) {
	method = (method || "get").toLowerCase();
	config = {...(config || {}), method:method, url:url};
	if (method == "get" || method == "delete" || method == "head" || method == "options") {
		config.params = data;
	} else {
		config.data = data;
	}

	return axios.request(config).then(res => new Err(res.data.code, res.data.message, res.data.data)).catch(e => new Err(-1, "请求异常", e));
}

export const httpGet = (url, data, config) => httpRequest("get", url, data, config);
export const httpPost = (url, data, config) => httpRequest("post", url, data, config);
export const httpPut = (url, data, config) => httpRequest("put", url, data, config);
export const httpDelete = (url, data, config) => httpRequest("delete", url, data, config);


function initHttpOptions(self, options) {
	options = options || {};
	options.headers = options.headers || {};
	
	self.options = options;
	self.httpGet = httpGet;
	self.httpPost = httpPost;
	self.httpPut = httpPut;
	self.httpDelete = httpDelete;
}

export function User(options) {
	const self = this;

	initHttpOptions(self, options);

	const apiRequest = (method, url) => (data, config) => httpRequest(method || "get", url, data, Object.assign(self.options, config));


	self.login = apiRequest("post", "user/login");
	self.register = apiRequest("post", "user/register");
	self.setBaseInfo = apiRequest("put", "user/setBaseInfo");
	self.modifyPassword = apiRequest("put", "user/modifyPassword");
	self.isLogin = apiRequest("get", "user/isLogin");
}

export function DataSource(options) {
	const self = this;

	initHttpOptions(self, options);

	const apiRequest = (method, url) => (data, config) => httpRequest(method || "get", url, data, Object.assign(self.options, config));
	
	self.getDefaultDataSource = apiRequest("get", "dataSource/getDefaultDataSource");
	self.getByUsername =  apiRequest("get", "dataSource/getByUsername");
	self.upsert = apiRequest("post", "dataSource/upsert");
	self.delete = apiRequest("delete", "dataSource/delete");
}

// 七牛api
export function Qiniu(options) {
	const self = this;

	initHttpOptions(self, options);

	const apiRequest = (method, url) => (data, config) => httpRequest(method || "get", url, data, Object.assign(self.options, config));
	
	self.getUploadToken = apiRequest("get", "qiniu/getUploadToken");
	self.getUploadTokenByKey = apiRequest("get", "qiniu/getUploadTokenByKey");
	self.upload = apiRequest("post", "qiniu/upload");
	self.getDownloadUrl = apiRequest("get", "qiniu/getDownloadUrl");
	self.get = apiRequest("get", "qiniu/get");
}

export function Files(options) {
	const self = this;

	initHttpOptions(self, options);

	const apiRequest = (method, url) => (data, config) => httpRequest(method || "get", url, data, Object.assign(self.options, config));
	
	self.list = apiRequest("get", "files/list");
	self.getByUsername = apiRequest("get", "files/getByUsername");
	self.getContent = apiRequest("get", "files/getContent");
	self.getFile = apiRequest("get", "files/getFile");
	self.uploadFile = apiRequest("post", "files/uploadFile");
	self.deleteFile = apiRequest("delete", "files/deleteFile");
}

export const mod = {

}

export function Site(options) {
	const self = this;

	initHttpOptions(self, options);

	const apiRequest = (method, url) => (data, config) => httpRequest(method || "get", url, data, Object.assign(self.options, config));

	self.create = apiRequest("post", "site/create");
	self.update = apiRequest("put", "site/update");
	self.delete = apiRequest("delete", "site/delete");
	self.getByUsername = apiRequest("get", "site/getByUsername");
}

export function Note(options){
	const self = this;
	initHttpOptions(self, options);

	self.user = new User(self.options);
	self.dataSource = new DataSource(self.options);
	self.qiniu = new Qiniu(self.options);
	self.files = new Files(self.options);
	self.site = new Site(self.options);
}

export default new Note();
