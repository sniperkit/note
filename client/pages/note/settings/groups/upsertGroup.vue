<template>
	<el-form ref="form" :model="group" label-width="80px">
		<el-form-item label="组名">
			<el-input v-model="group.groupname" placeholder="组名"></el-input>
		</el-form-item>
		<el-form-item label="备注">
			<el-input v-model="group.description" placeholder="备注"></el-input>
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
			group: {
			}
		}
	},

	props: {
		data: {
			type: Object,
			default: function(){
				return {};
			}
		}
	},

	computed: {

	},

	methods: {
		async submitDataSource() {
			const result = await this.api.groups.create(this.group);
			if (result.code != 0) {
				return Message(result.message);
			}
			return;
		}
	},

	mounted() {
		Object.assign(this.group, this.data);
		this.group.userId = this.user.id;
	}
}
</script>
