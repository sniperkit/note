<template>
	<div class="container">
		<div>
			<el-button @click="clickNewSiteBtn">新增</el-button>
		</div>
		<div v-for="(site, index) in sites.list" :key="index">
			<h3>{{site.name}}</h3>
			<p>{{site.description}}</p>
			<img :src="site.logoUrl" style="width:100px; height:100px;">
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
import {Key} from "@@/common/api/common.js";
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
			key: new Key({
				type: "tablename",    // 表名      必选
				version: "v0",        // 版本 可选
				prefix: "kw",         // 前缀限定 可选
			}),
			sites: {
				list: [],
			},
		}
	},

	computed: {
		...mapGetters({
			token: "user/token",
		}),
	},

	methods: {
		clickNewSiteBtn() {
			this.$router.push({name: g_app.getRouteName("demo-new")});
		},

	},

	async mounted() {
		await this.loadData();

		const key = this.key;
		const sites = await elasticsearch.search(key);
		this.sites = sites;

		console.log(sites);
	},
}

</script>
