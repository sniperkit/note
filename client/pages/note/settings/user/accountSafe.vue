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

		<el-tab-pane label="账号绑定">
			<div>
				<el-dialog :visible.sync="isShowCellphoneCaptchaDialog" title="手机验证码" width="450px">
					<el-form :model="cellphoneModel" label-width="80px" label-position="right" style="width:300px;">
						<el-form-item label="手机号">
							<el-col :span="18">
								<el-input clearable v-model="cellphoneModel.cellphone" placeholder="请输入手机号"></el-input>
							</el-col>
							<el-col :span="4" :offset="2">
								<el-button @click="clickSendCellphoneCaptchaBtn">{{timeout > 0 ? timeout + "S后可重新发送" : "发送验证码"}}</el-button>
							</el-col>
						</el-form-item>
						<el-form-item label="验证码">
							<el-col :span="18">
								<el-input clearable v-model="cellphoneModel.captcha" placeholder="请输入验证码"></el-input>
							</el-col>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="isShowCellphoneCaptchaDialog = false">取 消</el-button>
						<el-button type="primary" @click="clickSubmitBindCellphoneBtn">确 定</el-button>
					</div>
				</el-dialog>

				<span>手机号</span>
				<span>{{cellphoneModel.cellphone}}</span>
				<el-button @click="isShowCellphoneCaptchaDialog = true">{{cellphoneModel.isBind ? "解绑" : "绑定"}}</el-button>
			</div>
			<div>
				<el-dialog :visible.sync="isShowEmailCaptchaDialog" title="邮箱验证码" width="450px">
					<el-form :model="emailModel" label-width="80px" label-position="right" style="width:300px;">
						<el-form-item label="邮箱">
							<el-col :span="18">
								<el-input clearable v-model="emailModel.email" placeholder="请输入邮箱地址"></el-input>
							</el-col>
							<el-col :span="4" :offset="2">
								<el-button @click="clickSendEmailCaptchaBtn">{{timeout > 0 ? timeout + "S后可重新发送" : "发送验证码"}}</el-button>
							</el-col>
						</el-form-item>
						<el-form-item label="验证码">
							<el-col :span="18">
								<el-input clearable v-model="emailModel.captcha" placeholder="请输入验证码"></el-input>
							</el-col>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="isShowEmailCaptchaDialog = false">取 消</el-button>
						<el-button type="primary" @click="clickSubmitBindEmailBtn">确 定</el-button>
					</div>
				</el-dialog>

				<span>邮箱</span>
				<span>{{emailModel.email}}</span>
				<el-button @click="isShowEmailCaptchaDialog = true">{{emailModel.isBind ? "解绑" : "绑定"}}</el-button>
			</div>
		</el-tab-pane>
	</el-tabs>
</template>

<script>

import {
	Dialog,
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
		[Dialog.name]: Dialog,
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
			password: {},
			timeout: 0,
			isShowCellphoneCaptchaDialog: false,
			cellphoneModel: {
				cellphone: "",
				captcha: "",
				isBind: false,
			},
			isShowEmailCaptchaDialog: false,
			emailModel: {
				email: "",
				captcha: "",
				isBind: false,
			},
		}
	},

	methods: {
		startTimeout(timeout = 60) {
			const self = this;
			self.timeout = timeout;
			const start = () => {
				if (self.timeout > 0) self.timeout--;
				setTimeout(start, 1000);
			}
			setTimeout(start, 1000);
		},

		async clickSendCellphoneCaptchaBtn() {
			const reg = /^1\d{10}$/;
			const cellphone = this.cellphoneModel.cellphone || "";
			if (!reg.test(cellphone)) return Message("手机号格式错误");
			this.startTimeout();
			await this.api.users.cellphoneVerifyOne(this.cellphoneModel);
		},

		async clickSubmitBindCellphoneBtn() {
			const reg = /^1\d{10}$/;
			const cellphone = this.cellphoneModel.cellphone || "";
			if (!reg.test(cellphone)) return Message("手机号格式错误");
			const result = await this.api.users.cellphoneVerifyTwo(this.cellphoneModel);

			this.isShowCellphoneCaptchaDialog = false;

			if (result.isErr()) return Message(result.getMessage());

			Message("手机绑定成功");
			this.setUser({cellphone});
			this.cellphoneModel.isBind = true;
		},

		async clickSendEmailCaptchaBtn() {
			const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
			const email = this.emailModel.email || "";
			if (!reg.test(email)) return Message("邮箱格式错误");
			this.startTimeout();
			await this.api.users.emailVerifyOne(this.emailModel);
		},

		async clickSubmitBindEmailBtn() {
			const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
			const email = this.emailModel.email || "";
			if (!reg.test(email)) return Message("邮箱格式错误");

			const result = await this.api.users.emailVerifyTwo(this.emailModel);
			this.isShowEmailCaptchaDialog = false;

			if (result.isErr()) return Message(result.getMessage());

			Message("邮箱绑定成功");
			this.setUser({email});
			this.emailModel.isBind = true;
		},

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

	mounted() {
		this.cellphoneModel.cellphone = this.user.cellphone;
		this.cellphoneModel.isBind = this.user.cellphone ? true : false;

		this.emailModel.email = this.user.email;
		this.emailModel.isBind = this.user.email ? true : false;
	}
}
</script>
