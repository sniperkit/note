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
import keepwork from "@@/common/api/keepwork";

keepwork.endpoint.defaults.baseURL = config.keepwork.baseURL;

export default {
	components: {
		[Button.name]: Button,
	},

	data: function() {
		return {
			sites: [
			{
				sitename: "xiaoyao",
				description: "this is demo",
			},
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

	mounted() {
		keepwork.endpoint.defaults.headers.common['Authorization'] = "Bearer " + this.token;
	},
}

</script>
