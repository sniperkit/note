
<template>
	<el-form ref="form" :model="dataSource" label-width="80px">
		<el-form-item label="名称">
			<el-input v-model="dataSource.name" placeholder="名称"></el-input>
		</el-form-item>
		<el-form-item label="类型">
			<el-select v-model="dataSource.type" placeholder="类型" style="width:100%;">
				<el-option label="gitlab" value="gitlab"></el-option>
				<el-option disabled label="github" value="github"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="TOKEN">
			<el-input v-model="dataSource.token" placeholder="TOKEN"></el-input>
		</el-form-item>
		<el-form-item label="baseURL">
			<el-input v-model="dataSource.baseURL" placeholder="baseURL"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="submitDataSource">提交</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
import {
	Form,
	FormItem,
	Button,
	Input,
	Select,
	Option,
	Message,
} from "element-ui";

import {Gitlab} from "@@/common/api/gitlab.js";

export default {
	components: {
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Button.name]: Button,
		[Input.name]: Input,
		[Select.name]: Select,
		[Option.name]: Option,
	},

	data: function() {
		return {
			dataSource: {
				type: "gitlab",
				token: "Ed9S7hSfiruewMR-jitR",
				baseURL: "https://gitlab.com",
			},
		}
	},

	methods: {
		async submitDataSource() {
			console.log(this.dataSource);
			//const git = new Gitlab({
			//	token: this.dataSource.token,
			//	apiBaseUrl: this.dataSource.baseURL,
			//	rawBaseUrl: this.dataSource.baseURL,
			//});
			
			// 获取用户信息
			//const user = await git.api.Users.current().catch(()=>{});
			//if (!user) {
			//	Message.message("配置信息无效");
			//}

			//this.dataSource.externalUsername = user.username;
			//this.dataSource.externalUserId = user.id;

			//// 获取默认仓库信息
			//const project = git.upsertProject("notedatasource");
			//this.dataSource.projectId = project.id;
			//this.dataSource.projectName = project.name;
			
			//console.log(project);
		}
	},
}
</script>
