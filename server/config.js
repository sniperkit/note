import _ from "lodash";

import commonConfig from "../common/config.js";
import config from "./.config.js";

const defaultConfig = {
	secret: "keepwork",

	baseURL: "/api/v0/",
	host: "0.0.0.0",
	port: 3000,
	protocol: "http",
	origin: "http://0.0.0.0:3000",

	database: {
		//port:3306,
		host: '39.106.11.114',
		type: "mysql",
		database: "keepwork", // 数据库名
		username: "wuxiangan",
		password: "", 
	},

	elasticsearch: {
		baseURL: "http://10.28.18.7:9200", 
	},


	gitlab: {
		token: "",
	},

	qiniu: {
		accessKey:"",
		secretKey:"",
	},
}

//defaultConfig.baseURL = defaultConfig.baseURL || (defaultConfig.protocol + "://" + defaultConfig.host + ":" + defaultConfig.port + defaultConfig.apiPrefix);

const productionConfig = {
}

const developmentConfig = {
}

const localConfig = {
	//host: "127.0.0.1",
}

const configs = {
	"local": _.merge({}, commonConfig, defaultConfig, localConfig, config),
	"production": _.merge({}, commonConfig, defaultConfig, productionConfig, config),
	"development": _.merge({}, commonConfig, defaultConfig, developmentConfig, config),
}

const ENV = process.env.ENV || process.env.NODE_ENV;
const _config = configs[ENV];

console.log(ENV);

export default _config;
