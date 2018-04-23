
const config = {
	urlPrefix: "note",
	apiUrlPrefix: "/api/v0",
	pageSuffix:".md",
	tagModsPath: "keepwork_data/tag_mods.json",

	host: "127.0.0.1",
	port: 3000,

	keepwork: {
		baseURL: "http://stage.keepwork.com/api/wiki/models/",
	},
}

config.baseURL = "http://" + config.host + ":" + config.port + config.apiUrlPrefix;

export default config;
