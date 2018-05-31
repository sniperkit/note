import _ from "lodash";

import commonConfig from "@@/common/config.js";

const defaultConfig = {
	tagModsPath: "note/note/mods.md",
}

const productionConfig = {
	origin: "http://wxaxiaoyao.cn",
}

const developmentConfig = {
	ESService: {
		baseURL: "http://es.keepwork.com/api/v0/",
	},

	QiniuService: {
		baseURL: "http://es.keepwork.com/api/v0/",
	},
}

const configs = {
	"production": _.merge({}, commonConfig, defaultConfig, productionConfig),
	"development": _.merge({}, commonConfig, defaultConfig, developmentConfig),
}

console.log(process.env.NODE_ENV);

export default configs[process.env.NODE_ENV];

