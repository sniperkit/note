<template>
	<el-tabs>
		<el-tab-pane label="修改密码">
			<el-form ref="form" :model="password" label-width="120px">
				<el-form-item label="旧密码">
					<el-input type="password" v-model="password.oldpassword" placeholder="旧密码"></el-input>
				</el-form-item>
				<el-form-item label="新密码">
					<el-input type="password" v-model="password.newpassword" placeholder="新密码"></el-input>
				</el-form-item>
				<el-form-item label="确认新密码">
					<el-input type="password" v-model="password.confirmpassword" placeholder="确认新密码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="clickSubmitBtn">提交</el-button>
				</el-form-item>
			</el-form>
		
		</el-tab-pane>
		<el-tab-pane label="账号绑定"></el-tab-pane>
	</el-tabs>
</template>

<script>

import {
	Form,
	FormItem,
	Tabs,
	TabPane,
	Button,
	Input,
	RadioGroup,
	Radio,
	Message,
} from "element-ui";

import api from "@@/common/api/note.js";

export default {
	components: {
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Button.name]: Button,
		[Input.name]: Input,
		[RadioGroup.name]: RadioGroup,
		[Radio.name]: Radio,
		[Tabs.name]: Tabs,
		[TabPane.name]: TabPane,
	},

	data: function() {
		return {
			password: {}
		}
	},

	methods: {
		async clickSubmitBtn() {
			const password = this.password;
			if (!password.newpassword) {
				return Message("密码格式错误");
			}
			if (password.newpassword != password.confirmpassword) {
				return Message("两次新密码不一致");
			}

			const result = await api.users.changepwd(password);			
			if (result.isErr()) {
				return Message(result.getMessage());
			}

			Message("密码修改成功");
		}
	},
}
</script>
