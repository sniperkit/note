
const config = {
	urlPrefix: "note",
	apiUrlPrefix: "/api/v0/",
	pageSuffix:".md",
	tagModsPath: "keepwork_data/tag_mods.json",

	host: "0.0.0.0",
	port: 7654,

	keepwork: {
		baseURL: "http://stage.keepwork.com/api/wiki/models/",
	},

	ESService: {
		baseURL: "http://47.52.20.34:7654/api/v0/",
	},

	elasticsearch: {
		baseURL: "http://10.28.18.7:9200", 
	},

	outerNetIP: "47.52.20.34",
}

config.baseURL = "http://" + config.host + ":" + config.port + config.apiUrlPrefix;
config.outerBaseURL = "http://" + config.outerNetIP + ":" + config.port + config.apiUrlPrefix;

export default config;
