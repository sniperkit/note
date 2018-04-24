<template>
	<div class="container">
		<div>
			<el-button @click="clickNewSiteBtn">新增</el-button>
		</div>
		<div v-for="(site, index) in sites" :key="index">
			<h3>{{site.sitename}}</h3>
			<p>{{site.description}}</p>
		</div>
	</div>
</template>

<script>
import {
	Button
} from "element-ui";

import {mapActions, mapGetters} from "vuex";

import config from "@/config.js";
import {ElasticsearchFactory} from "@@/common/api/elasticSearch.js";
import keepwork from "@/components/keepwork.js";

const elasticsearch = new ElasticsearchFactory({
	host: config.elasticsearch.baseURL,
});

export default {
	mixins: [keepwork],
	components: {
		[Button.name]: Button,
	},

	data: function() {
		return {
			tableOptions: {
				type: "sitetable",    // 表名      必选
				index_prefix: "kw",   // 前缀限定  可选
				version: "v0",        // 版本 可选
				company: "kw",        // 公司 可选
			},
			sites: [
			],
		}
	},

	computed: {
		...mapGetters({
			token: "user/token",
		}),
	},

	methods: {
		clickNewSiteBtn() {
			this.$router.push({name: g_app.getRouteName("site-new")});
		},

	},

	async mounted() {
		const key = this.git.getTableKey(tableOptions);
		if (key) {
			console.log("数据源初始化失败");
			return;
		}

		const sites = await elasticsearch.api.search({
			index: key.index,
			type: key.type,
			body: {
				// es 查询语句 
			}
		});

		this.sites = sites || [];
	},
}

</script>
