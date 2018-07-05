<template>
	<el-form ref="form" :model="site" label-width="80px">
		<el-form-item label="名称">
			<el-input v-model="site.sitename" placeholder="名称"></el-input>
		</el-form-item>

		<el-form-item label="描述">
			<el-input v-model="site.description" placeholder="描述"></el-input>
		</el-form-item>

		<el-form-item label="公开">
			<el-switch v-model="site.public">
			</el-switch>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="clickSubmitSiteBtn">提交</el-button>
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
	Switch,
	Message,
} from "element-ui";

export default {
	components: {
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Button.name]: Button,
		[Input.name]: Input,
		[Select.name]: Select,
		[Option.name]: Option,
		[Switch.name]: Switch,
	},

	data: function() {
		return {
			site: {},
		}
	},

	methods: {
		async clickSubmitSiteBtn() {
			const result = await this.api.sites.create(this.site);
			if (result.isErr()) {
				return Message(result.getMessage());
			}

			Message("站点创建成功");
		}
	}
}
</script>
