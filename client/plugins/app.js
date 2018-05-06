import vue from "vue";
import _ from "lodash";
import yaml from "js-yaml";
import config from "@/config.js";
import consts from "@/lib/consts.js";
import storage from "@/lib/storage.js";
import indexedDB from "@/lib/indexedDB.js";
import noteEndpoint from "@@/common/api/note.js";

config.baseURL = window.location.origin + config.apiUrlPrefix;

noteEndpoint.options.baseURL = config.baseURL;

const app = {
	yaml,
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

window._ = _;
window.g_app = app;
