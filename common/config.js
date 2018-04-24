
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

	outerNetIP: "47.52.20.34",
}

config.baseURL = "http://" + config.host + ":" + config.port + config.apiUrlPrefix;
config.outerBaseURL = "http://" + config.outerNetIP + ":" + config.port + config.apiUrlPrefix;

export default config;
