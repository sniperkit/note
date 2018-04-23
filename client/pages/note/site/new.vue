<template>
	<div class="container">
		<el-form :model="site" ref="form" label-width="100px">
			<el-form-item label="站名:">
				<el-input type="text" v-model="site.sitename"></el-input>
			</el-form-item>
			<el-form-item label="描述:"> 
				<el-input type="text" v-model="site.description"></el-input> 
			</el-form-item> 
			<el-form-item label="LOGO:"> 
				<el-input type="text"></el-input> 
			</el-form-item> 
			<el-form-item>
				<el-button @click.prevent="clickNewSiteBtn">新增</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import {
	Form,
	FormItem,
	Input,
	Button,
} from "element-ui";

import keepwork from "@/components/keepwork.js";
import {Gitlab} from "@@/common/api/gitlab.js";

export default {
	mixins: [keepwork],
	components: {
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Input.name]: Input,
		[Button.name]: Button,
	},

	data: function() {
		return {
			site: {},
			sitename: "site",
		}
	},

	methods: {
		clickNewSiteBtn() {
			console.log(this.site);
			
		},
	},

	async mounted() {
		const siteParams = {
			username: this.user.username,
			sitename: this.sitename,
		};

		let data = await this.keepwork.site.getByName(siteParams);
		let siteinfo = null;

		// keepwork网站不存在 则创建网站
		if (!data || !data.data) {
			data = await this.keepwork.site.create(siteParams);
			siteinfo = data.siteinfo;
		} else {
			siteinfo = data.data;
		}

		// 获取网站数据源
		data = await this.keepwork.siteDataSource.get(siteParams);
		if (!data || !data.data) {
			console.log("-----------------server inner error-----------------");
			return
		}

		// 初始化git api 
		const gitcfg = data.data;
		this.git = new Gitlab({
			apiBaseUrl: gitcfg.rawBaseUrl,
			rawBaseUrl: gitcfg.rawBaseUrl,
			projectId: gitcfg.projectId,
			projectName: gitcfg.projectName,
			externalUsername: gitcfg.dataSourceUsername,
			token: gitcfg.dataSourceToken,
			username: gitcfg.username,
			sitename: gitcfg.sitename,
		});

		// 注册钩子
		this.git.upsertHook("http://47.52.20.34:8088/api/v0/gitlab/webhook");
	}

}
</script>
