<template>
	<el-form ref="form" :model="user" label-width="80px">
		<el-form-item label="昵称">
			<el-input v-model="user.nickname" placeholder="昵称"></el-input>
		</el-form-item>
		<el-form-item label="类型">
			<el-radio-group v-model="user.sex">
				<el-radio label="男">男</el-radio>
				<el-radio label="女">女</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="简介">
			<el-input v-model="user.description" placeholder="简介"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="clickSubmitBtn">提交</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
import {
	Form,
	FormItem,
	Button,
	Input,
	RadioGroup,
	Radio,
	Message,
} from "element-ui";
import {mapActions, mapGetters} from "vuex";

import api from "@@/common/api/note.js";

export default {
	components: {
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Button.name]: Button,
		[Input.name]: Input,
		[RadioGroup.name]: RadioGroup,
		[Radio.name]: Radio,
	},

	data: function() {
		return {
			user: {},
		}
	},

	computed: {
		...mapGetters({
			userinfo: "user/user",
		}),
	},

	methods: {
		...mapActions({
			setUser: "user/setUser",
		}),
		async clickSubmitBtn() {
			const result = await api.user.setBaseInfo(this.user);
			if (result.isErr()) {
				Message(result.getMessage());
			}

			this.setUser(this.user);
			Message("用户信息修改成功");
		}
	},

	mounted() {
		this.user = {...this.userinfo};
	}

}
</script>
