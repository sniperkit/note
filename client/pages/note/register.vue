<template>
	<div class="container" style="margin-top:40px">
		<el-row>
			<el-col :span="8" :offset="8" :xs="{span:22, offset:1}">
				<el-form ref="registerForm" :model="registerForm" :rules="registerRules" label-width="80px">
					<el-form-item label="用户名:" prop="username">
						<el-input v-model="registerForm.username"></el-input>
					</el-form-item>
					<el-form-item label="密码:" prop="password">
						<el-input type="password" v-model="registerForm.password" @keyup.native.enter="submitRegisterForm"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click.prevent="submitRegisterForm">注册</el-button>
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
			registerForm:{
				username:"",
				password:"",
			},
			registerRules: {
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
		async submitRegisterForm() {
			const self = this;
			const ret = await new Promise((resolve, reject) => {
				self.$refs.registerForm.validate(valid => resolve(valid));
			});
			if (!ret) return;

			const result = await self.api.users.register({
				username:self.registerForm.username,
				password:self.registerForm.password,
			});
			
			if (result.isErr()) {
				Message(result.getMessage());
				return;;
			}

			const user = result.getData();
			self.setUser(user);
			self.$router.push({name:g_app.getRouteName("home")});
		}
	},
}
</script>
