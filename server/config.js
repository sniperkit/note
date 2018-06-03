import _ from "lodash";

import commonConfig from "../common/config.js";
import secretConfig from "./.config.js";

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

const testConfig = {

}
const configs = {
	"production": _.merge({}, commonConfig, defaultConfig, productionConfig, secretConfig),
	"development": _.merge({}, commonConfig, defaultConfig, developmentConfig, secretConfig),
	"test": _.merge({}, commonConfig, defaultConfig, testConfig, secretConfig),
}

console.log(process.env.NODE_ENV);

export default configs[process.env.NODE_ENV];
