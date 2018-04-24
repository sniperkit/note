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
				<input class="file-input" type="file" @change="selectFile"/>
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
			this.site.sitename = this.site.sitename || "xiaoyao";
			this.site.description = this.site.description || "this is a description";
			if (!this.git) return;

			const git = this.git;
			git.upsertTableData(git.getTableKey({
				type:'sitetable',
				filename: this.site.sitename,
				company: "kw", // 表所属公司 推荐使用简写
			}), this.site);
		},

		// 上传七牛文件
		selectFile() {
			const file = event.target.files[0];
			console.log(file);
			this.keepwork.qiniu.upload(file, "test.jpg");
		},
	},

	async mounted() {
	}

}
</script>
