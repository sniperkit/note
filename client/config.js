import _ from "lodash";

import commonConfig from "../common/config.js";

const defaultConfig = {
	tagModsPath: "keepwork_data/tag_mods.json",
}

const productionConfig = {
}

const developmentConfig = {
	ESService: {
		baseURL: "http://10.28.18.2:10004/api/v0/",
	},

	QiniuService: {
		baseURL: "http://10.28.18.2:10004/api/v0/",
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
