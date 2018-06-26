import _ from "lodash";

import commonConfig from "../common/config.js";
import secretConfig from "./.config.js";

const defaultConfig = {
	secret: "keepwork",

	host: "0.0.0.0",
	port: 3000,
	protocol: "http",
	origin: "http://0.0.0.0:3000",
	baseURL: "/api/v0/",

	database: {
		//port:3306,
		host: '39.106.11.114',
		type: "mysql",
		database: "note", // 数据库名
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

	email: {
		host: "smtp.exmail.qq.com",
		port: 587,
		user: "noreply@mail.keepwork.com",
		pass: "xxx",
		from: "noreply@mail.keepwork.com",
	},

	sms: {
		serverIP: "app.cloopen.com",
		serverPort: "8883",
		softVersion: "2013-12-26",
		appId: "8a216da85d158d1b015d5a30365c1bfe",
		accountSid: "8a216da85cce7c54015ce86f168408f1",
		accountToken: "",
	}
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

//console.log(process.env.NODE_ENV);

export default configs[secretConfig.NODE_ENV || process.env.NODE_ENV];
