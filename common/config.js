
const defaultConfig = {
	urlPrefix: "note",
	pageSuffix:".md",
	tagModsPath: "keepwork_data/tag_mods.json",

	host: "0.0.0.0",
	port: 3000,
	origin: "http://wxaxiaoyao.cn",

	baseUrl: "/api/v0/",

	QiniuService: {
		baseURL: "http://47.52.20.34:8088/api/v0/",
	},

	elasticsearch: {
		baseURL: "http://10.28.18.7:9200", 
	},

	oauths: {
		github: {
			clientId: "5cc0cf681e677a56771b",
		},
		qq: {
			clientId:"101403344",
		},
		weixin: {
			clientId: "wxc97e44ce7c18725e",
		},
		xinlang: {
			clientId: "2411934420",
		},
		facebook: {
			clientId: "1942795522419535",
			clientSecret: "1f7bc8761f32b2c8a0923ecc5ebc8b5e",
			//clientSecret: "669a9ce8eb9b2b872ed0a19905407593",
			redirectUri: 'https://wxa.keepwork.com/api/wiki/auth/facebook',
			//redirectUri: 'http://localhost:3000/api/v0/oauth/facebook',
			authorizationEndpoint: 'https://www.facebook.com/v3.0/dialog/oauth',
		},
	}
}

export default defaultConfig;
