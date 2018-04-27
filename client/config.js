import _ from "lodash";

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

}


const configs = {
	"local": _.merge(commonConfig, defaultConfig, localConfig),
	"production": _.merge(commonConfig, defaultConfig, productionConfig),
	"development": _.merge(commonConfig, defaultConfig, developmentConfig),
}


console.log(process.env.ENV);

export default configs[process.env.ENV];
