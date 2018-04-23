import axios from "axios";
import { Message  } from 'element-ui';

export const keepworkEndpoint = axios.create({
	//baseURL:"",
});

const resultHandle = res => {
	const error = res.data.error;
	if (error.id) {
		Message.error(error.message);
	}

	return res.data.data;
}

export const post = (...args) => keepworkEndpoint.post(...args).then(res => res.data);

export const get = (url, params, config) => keepworkEndpoint.get(url, {
   	params:params,
	...(config || {}),
}).then(res => res.data);

const initHttpHelper = (obj, config, endpoint) => {
	obj.endpoint = endpoint || axios.create(config || {});
	obj.httpPost = (...args) => obj.endpoint.post(...args).then(res => res.data);
	obj.httpGet = (url, params, config) => obj.endpoint.get(url, {params: params}).then(res => res.data);
	//obj.setConfig = (config) => obj.endpoint.defaults = {...(obj.endpoint.defaults || {}), ...(config || {})};
}

export const User = function(config, endpoint) {
	const self = this;
	initHttpHelper(self, config, endpoint);
	
	self.login = (...args) => self.httpPost("user/login", ...args);
	self.register = (...args) => self.httpPost("user/register", ...args);
	self.isLogin = (...args) => self.httpGet("user/isLogin", ...args).then(res => res.data);
}

export const SiteDataSource = function(config, endpoint) {
	const self = this;
	initHttpHelper(self, config, endpoint);

	self.get = (...args) => self.httpGet("site_data_source/getSiteDataSource", ...args);
}


export const Site = function(config, endpoint) {
	const self = this;

	initHttpHelper(self, config, endpoint);

	// 获取站定信息
	self.getByName = (...args) => self.httpGet("website/getByName", ...args);
	self.create = (...args) => self.httpPost("website/createSite", ...args);
}

export const Keepwork = function(config, endpoint) {
	const self = this;
	initHttpHelper(self, config, endpoint);

	self.user = new User(config, self.endpoint);
	self.siteDataSource = new SiteDataSource(config, self.endpoint);
	self.site = new Site(config, self.endpoint);
}

export default new Keepwork();
