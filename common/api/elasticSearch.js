
import elasticsearch from "elasticsearch";

const defaultConfig = {
	host: "http://10.28.18.7:9200",
}

export const ElasticsearchFactory = function(config){
	this.api = new elasticsearch.Client({
		...defaultConfig,
		...(config || {}),
	});
}

ElasticsearchFactory.prototype.search = function(opt, query) {
}

export default new ElasticsearchFactory();
