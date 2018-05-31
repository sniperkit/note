import vue from "vue";
import _ from "lodash";
import yaml from "js-yaml";
import jwt from "jwt-simple";
import config from "@/config.js";
import consts from "@/lib/consts.js";
import storage from "@/lib/storage.js";
import indexedDB from "@/lib/indexedDB.js";
import events from "@/lib/events.js";
import noteEndpoint from "@@/common/api/note.js";
import {component} from "@/components/component.js";

import 'vue-easytable/libs/themes-base/index.css'
import {VTable,VPagination} from 'vue-easytable';
vue.component(VTable.name, VTable);
vue.component(VPagination.name, VPagination);

vue.use({
	install(Vue, options) {
		Vue.mixin(component);
	}
});

config.baseURL = window.location.origin + config.apiUrlPrefix;

noteEndpoint.options.baseURL = config.baseURL;

const user = {
	user:null,
}

user.setUser = function(user) {
	this.user = user;
	storage.localStorageSetItem("userinfo", user);
}

user.getUser = function() {
	this.user = this.user || storage.localStorageGetItem("userinfo") || {};
	return this.user;
}

user.isAuthenticated = function() {
	if (!this.user || !this.user.token) return false;
	const payload = jwt.decode(this.user.token, null, true);
	//console.log(payload);

	if (payload.nbf && Date.now() < payload.nbf*1000) {
		return false;
	}
	if (payload.exp && Date.now() > payload.exp*1000) {
		return false;
	}

	return true;
}

const app = {
	object:{},
	yaml,
	events,
	user:user,
	vue: new vue(),
	config: config,
	consts: consts,
	storage: storage,
	indexedDB: indexedDB,
	pageDB: null,
}

indexedDB.open().then(function(){
	app.pageDB = indexedDB.getStore("sitepage");
});

app.getRouteName = (name) => config.urlPrefix + "-" + name;


window.addEventListener("message", function(e) {
	const FAIL = {cmd: "fail"};
	const SUCCESS = {cmd: "success"};

	function postMessage(data, origin) {
		origin = origin || "*";
		data = data || SUCCESS;
		e.source.postMessage(data, origin);
	}

	const data = e.data || {}

	if (data.cmd == "element_style") {
		const selector = data.selector;
		const style = data.style || {};
		const el = document.getElementById(selector);

		if (!el) {
			return postMessage(FAIL);
		}

		console.log(el, style);
		el.style.height = style.height;
		el.style.width = style.width;
	} else {
		//console.log("cmd not found", e);
		return;
	}

	postMessage(SUCCESS)
});

window._ = _;
window.g_app = app;
