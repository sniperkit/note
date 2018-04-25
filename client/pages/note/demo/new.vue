<template>
	<div class="container">
		<el-form :model="demo" ref="form" label-width="100px">
			<el-form-item label="名称:">
				<el-input type="text" v-model="demo.name"></el-input>
			</el-form-item>
			<el-form-item label="描述:"> 
				<el-input type="text" v-model="demo.description"></el-input> 
			</el-form-item> 
			<el-form-item label="LOGO:"> 
				<input class="file-input" type="file" @change="selectFile"/>
			</el-form-item> 
			<el-form-item>
				<el-button @click.prevent="clickNewDemoBtn">新增</el-button>
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

import {Key} from "@@/common/api/common.js";
import keepwork from "@/components/keepwork.js";

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
			demo: { 
				name: "xiaoyao",
				description: "this is a description",
		   	},
			key: new Key({
				type: "tablename",    // 表名      必选
				version: "v0",        // 版本 可选
				prefix: "kw",         // 前缀限定 可选
			}),
		}
	},

	methods: {
		clickNewDemoBtn() {
			if (!this.git) return;

			const demo = this.demo;
			const git = this.git;
			git.upsertTableData(this.key.setKey(demo.name), demo);
		},

		// 上传七牛文件
		selectFile() {
			const self = this;
			const file = event.target.files[0];
			self.keepwork.qiniu.upload(file, "test.jpg", {
				complete(res) {
					const data = res.data;
					if (!data || !data.downloadUrl) {
						console.log("-------upload failed-------- callback verify failed--------");
						return ;
					}
					self.demo.logoUrl = data.downloadUrl;
				}
			});
		},
	},

	async mounted() {
		await this.loadData();
	}

}
</script>
