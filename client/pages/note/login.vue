<template>
	<div class="container" style="margin-top:40px">
		<el-row>
			<el-col :span="8" :offset="8">
				<el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="80px">
					<el-form-item label="用户名:" prop="username">
						<el-input v-model="loginForm.username"></el-input>
					</el-form-item>
					<el-form-item label="密码:" prop="password">
						<el-input type="password" v-model="loginForm.password" @keyup.native.enter="submitLoginForm"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click.prevent="submitLoginForm">登陆</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import {
	Row,
	Col,
	Form,
	FormItem,
	Input,
	Button,
	Message,
} from "element-ui";
import Cookies from 'js-cookie';
import {mapActions, mapGetters} from "vuex";
import api from "@@/common/api/note.js";

export default {
	components: {
		[Button.name]: Button,
		[Row.name]: Row,
		[Col.name]: Col,
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Input.name]: Input,
	},

	data:function(){
		return {
			loginForm:{
				username:"",
				password:"",
			},
			loginRules: {
				username: [
				{required:true, message:"用户名不能为空", trigger:"blur"}
				],
				password: [
				{required:true, message:"密码不能为空", trigger:"blur"}
				]
			}
		}
	},
	props:{
	},
	methods: {
		...mapActions({
			setUser: "user/setUser",
		}),
		async submitLoginForm() {
			const self = this;
			const ret = await new Promise((resolve, reject) => {
				self.$refs.loginForm.validate(valid => resolve(valid));
			});
			if (!ret) return;

			const result = await api.user.login({
				username:self.loginForm.username,
				password:self.loginForm.password,
			});
			
			if (result.isErr()) {
				Message(result.getMessage());
				return;;
			}

			const user = result.getData();
			const token = user.token;
			api.options.headers['Authorization'] = token;
			Cookies.set("token", token);
			self.setUser(user);
			self.$router.push({name:g_app.getRouteName("home")});
		}
	},
}
</script>
