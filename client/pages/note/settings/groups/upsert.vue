<template>
	<el-form ref="form" :model="group" label-width="80px">
		<el-form-item label="ID" v-if="isModify">
			<el-input disabled v-model="group.id" placeholder="ID"></el-input>
		</el-form-item>
		<el-form-item label="组名">
			<el-input :disabled="isModify" clearable v-model="group.groupname" placeholder="组名"></el-input>
		</el-form-item>
		<el-form-item label="备注">
			<el-input clearable v-model="group.description" placeholder="备注"></el-input>
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

import api from "@@/common/api/note.js";

export default {
	components: {
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Button.name]: Button,
		[Input.name]: Input,
	},

	data: function() {
		return {
			isModify: false,
			group: {
			}
		}
	},

	methods: {
		async submitDataSource() {
			let action = this.isModify ? "update" : "create";
			const result = await this.api.groups[action](this.group);
			if (result.isErr()) {
				//return Message(result.message);
				return Message("提交失败");
			}

			Message("提交成功");
			return;
		}
	},

	async mounted() {
		this.group.userId = this.user.id;

		const id = this.$route.query.id;
		if (!id) return ;

		let result = await this.api.groups.getOne({id});

		if (result.isErr() || !result.getData()) {
			Message("获取记录失败");
			return;
		}

		this.group = result.getData();
		this.isModify = true;
	}
}
</script>
