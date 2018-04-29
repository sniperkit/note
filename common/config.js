
const defaultConfig = {
	urlPrefix: "note",
	apiUrlPrefix: "/api/v0/",
	pageSuffix:".md",
	tagModsPath: "keepwork_data/tag_mods.json",

	host: "127.0.0.1",
	port: 7654,

	baseURL: "http://wxaxiaoyao.cn/api/v0/",
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
}

export default defaultConfig;
