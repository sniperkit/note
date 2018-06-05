
const defaultConfig = {
	urlPrefix: "note",
	apiUrlPrefix: "/api/v0/",
	pageSuffix:".md",
	tagModsPath: "keepwork_data/tag_mods.json",

	host: "0.0.0.0",
	port: 3000,
	origin: "http://wxaxiaoyao.cn",

	baseURL: "/api/v0/",
	proxyBaseURL: "http://47.52.20.34:7654/api/v0/",

	keepwork: {
		baseURL: "http://stage.keepwork.com/api/wiki/models/",
		proxyBaseURL: "http://47.52.20.34:7654/api/v0/",
		//proxyBaseURL: "http://wxaxiaoyao.cn/api/v0/",
	},

	ESService: {
		baseURL: "http://47.52.20.34:8088/api/v0/",
	},

	QiniuService: {
		baseURL: "http://47.52.20.34:8088/api/v0/",
	},

	elasticsearch: {
		baseURL: "http://10.28.18.7:9200", 
	},

	oauth: {
		github: {
			clientId: "5cc0cf681e677a56771b",
			clientSecret: "7d843c4eff4a4bd64d03076e04d5eff234a64091",
			redirectUri: 'http://localhost:3000/api/v0/oauth/github',
		},
		facebook: {
			clientId: "1942795522419535",
			//clientId: "214912142619169",
			clientSecret: "1f7bc8761f32b2c8a0923ecc5ebc8b5e",
			//clientSecret: "669a9ce8eb9b2b872ed0a19905407593",
			redirectUri: 'https://wxa.keepwork.com/api/wiki/auth/facebook',
			//redirectUri: 'http://localhost:3000/api/v0/oauth/facebook',
			authorizationEndpoint: 'https://www.facebook.com/v3.0/dialog/oauth',
		},
	}
}

export default defaultConfig;
