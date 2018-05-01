import _ from "lodash";
import api from "@@/common/api/note.js";

import commonConfig from "../common/config.js";

const defaultConfig = {
	tagModsPath: "keepwork_data/tag_mods.json",
}

const productionConfig = {
}

const developmentConfig = {
	ESService: {
		baseURL: "http://es.keepwork.com/api/v0/",
	},

	QiniuService: {
		baseURL: "http://es.keepwork.com/api/v0/",
	},
}

const localConfig = {
	baseURL: "http://localhost:3000/api/v0/",
}


const configs = {
	"local": _.merge({}, commonConfig, defaultConfig, localConfig),
	"production": _.merge({}, commonConfig, defaultConfig, productionConfig),
	"development": _.merge({}, commonConfig, defaultConfig, developmentConfig),
}

const ENV = process.env.ENV || process.env.NODE_ENV;
const config = configs[ENV];

api.options.baseURL = config.baseURL;

console.log(ENV);

export default config;

