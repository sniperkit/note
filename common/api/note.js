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
	//return axios.request(config).then(res => new Err(res.data.code, res.data.message, res.data.data));
}

export const httpGet = (url, data, config) => httpRequest("get", url, data, config);
export const httpPost = (url, data, config) => httpRequest("post", url, data, config);
export const httpPut = (url, data, config) => httpRequest("put", url, data, config);
export const httpDelete = (url, data, config) => httpRequest("delete", url, data, config);

const getUrl = function(prefix, url, isRest, data, key = "id") {
	prefix = prefix || "";
	url = url ? ("/" + url) : "";

	if (isRest && data && data[key]) url = "/" + encodeURIComponent(data[key]) + url;

	return prefix + url;
}

function initHttpOptions(self, options = {}, prefix, key = "id") {
	options.headers = options.headers || {};
	
	self.options = options;
	self.httpGet = httpGet;
	self.httpPost = httpPost;
	self.httpPut = httpPut;
	self.httpDelete = httpDelete;
	self.apiRequest = (method = "get", url) => (data, config) => httpRequest(method, getUrl(prefix, url, false), data, Object.assign(self.options, config));
	self.restRequest = (method = "get", url) => (data, config) => httpRequest(method, getUrl(prefix, url, true, data, key), data, Object.assign(self.options, config));

	// rest api
	self.upsert = self.apiRequest("post", "upsert");
	self.create = self.apiRequest("post");
	self.update = self.restRequest("put");
	self.delete = self.restRequest("delete");
	self.get = self.restRequest("get");
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

export function Users(options) {
	const self = this;

	initHttpOptions(self, options);

	const apiRequest = (method, url) => (data, config) => httpRequest(method || "get", url, data, Object.assign(self.options, config));


	self.login = apiRequest("post", "users/login");
	self.register = apiRequest("post", "users/register");
	self.setBaseInfo = apiRequest("put", "users/setBaseInfo");
	self.modifyPassword = apiRequest("put", "users/modifyPassword");
	self.isLogin = apiRequest("get", "users/isLogin");
}


export function Files(options) {
	const self = this;
	const prefix = "files";

	initHttpOptions(self, options, "files", "key");

	self.raw = self.restRequest("get", "raw");
	self.get = self.restRequest("get");
	self.upsert = self.restRequest("post");
	self.delete = self.restRequest("delete") 
	self.token = self.restRequest("get", "token");
	self.qiniu = self.apiRequest("post", "qiniu");
}

export const mod = {

}

export function Sites(options) {
	const self = this;

	initHttpOptions(self, options, "sites", "id");

	self.create = self.restRequest("post");
	self.update = self.restRequest("put");
	self.delete = self.restRequest("delete");
	self.get = self.restRequest("get");
}

export function Pages(options) {
	const self = this;

	initHttpOptions(self, options, "pages", "id");
}

export function Groups(options) {
	const self = this;

	initHttpOptions(self, options, "groups", "id");

	self.create = self.apiRequest("post");
	self.update = self.restRequest("put");
	self.delete = self.restRequest("delete");
	self.get = self.apiRequest("get");
	self.getOne = self.restRequest("get");
	self.createMember = self.restRequest("post", "members");
	self.deleteMember = async (data, config) => await (self.restRequest("delete", "members/" + data.memberId))(data, config);
	self.getMembers = self.restRequest("get", "members");
	
}

export function GroupMembers(options) {
	const self = this;

	initHttpOptions(self, options, "groupMembers", "id");
}

export function Notes(options = {}){
	const self = this;
	initHttpOptions(self, options);

	self.dataSource = new DataSource(self.options);
	self.qiniu = new Qiniu(self.options);
	self.users = new Users(self.options);
	self.files = new Files(self.options);
	self.sites = new Sites(self.options);
	self.pages = new Pages(self.options);
	self.groups = new Groups(self.options);
	self.groupMembers = new GroupMembers(self.options);
}
export const options = {
	headers: {

	},
}
export default new Notes(options);
