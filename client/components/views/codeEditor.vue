<template>
	<div style="height:100%" v-loading="loading" element-loading-text="文件上传中...">
		<el-dialog title="文件上传" :visible.sync="fileUploadDialogVisible" width="500px">
			<div style="color:red; margin-top:-20px; margin-bottom:10px"><b>本页面存在同名文件会覆盖</b></div>
			<el-input v-model="uploadFilename" placeholder="请输入文件名"></el-input>
			<span slot="footer">
				<el-button @click="fileUploadDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="fileUpload">确定</el-button>
			</span>
		</el-dialog>
		<codemirror ref="cm" :value="value" class="kp_forbit_copy" @change="textChange" @save="save" @fileUpload="fileUploadEvent" @cursorActivity="cursorActivity">
		</codemirror>
	</div>
</template>

<script>
import vue from "vue";
import {mapActions, mapGetters} from "vuex";
import {Base64} from "js-base64";
import {
	Dialog,
	Input,
	Button,
	Message,
} from "element-ui";

import {component} from "@/components/component.js";
import codemirror from "@/components/bases/codemirror.vue";
import qiniuUpload from "@@/common/api/qiniu.js";
import api from "@@/common/api/note.js";
import util from "@@/common/util.js";
const tempContentKey = "cmeditor_temp_content";

export default {
	mixins: [component],
    components:{
		[Dialog.name]: Dialog,
		[Input.name]: Input,
		[Button.name]: Button,
		codemirror,
    },
	data: function() {
		return {
			fileUploadDialogVisible: false,
			uploadFilename:"",
			loading: false,
			value:{
				text:"",
				filename:null,
			},
			pages:{},
			change: {
				timer:undefined,
				filename:undefined,
			},
		};
	},

	computed: {
		...mapGetters({
			user: "user/user",
			isLogin: "user/isAuthenticated",
		}),
		codemirror() {
			return this.$refs.cm && this.$refs.cm.codemirror;
		},
	},

	methods: {
		savePageToDB(){
			if (!this.$refs.cm) 	return;
			var value = this.$refs.cm.getValue();
			this.change.timer && clearTimeout(this.change.timer);
			if (this.page && this.page.path) {
				g_app.pageDB.setItem(this.page);
			}
		},

		textChange(payload) {
			var self = this;
			self.emit(self.EVENTS.__EVENT__CODEMIRROR__OUT__TEXT__, {
				namespace: self.namespace,
				text: payload.text,
			});
			if (!payload.filename) {
				this.storage && this.storage.sessionStorageSetItem(tempContentKey, payload.text);
				return;
			}

			if (this.change.filename != payload.filename) {
				this.change.filename = payload.filename;
				// 立即保存切换的后的内容
				self.savePageToDB();
				this.change.timer = undefined;
			} else {
				const isModify = this.page.content != payload.text;
				self.$set(self.page, "isModify", isModify);

				if (this.change.timer) {
					clearTimeout(this.change.timer);
				} else {
					self.savePageToDB(); // 第一次修改 也做立即保存
				}
				this.change.timer = setTimeout(function(){
					self.savePageToDB();
				}, 5000);
			}

			this.page.content = payload.text;
		},

		async save(payload) {
			let {filename, text} = payload;
			if (!filename) {
				return;
			}
			this.page.content = text;
			this.page.isRefresh = true;
			const type = util.getTypeByPath(filename);
			const result = await api.files.upsertContent({...this.page, type});
			this.page.isRefresh = false;
			this.page.isModify = false;
			if (result.isErr()) {
				Message(result.getMessage());
			}
		},

		fileUploadEvent(file) {
			this.fileUploadDialogVisible = true;
			this.uploadFilename = file.name;
			this.file = file;
		},

		async fileUpload() {
			this.fileUploadDialogVisible = false;
			if (!this.uploadFilename){
				Message("文件名为空, 取消文件上传");
				return;
			};
			console.log(this.path);
			const file = this.file;
			const filename = this.uploadFilename;
			const isImage = file.type.indexOf("image") == 0;
			const filetype = util.getTypeByPath(filename);
			let username = this.user.username;
			let sitename = undefined;
			let path = undefined;
			if (this.page && this.page.path) {
				const paths = this.page.path.split("/");
				username = paths[0];
				sitename = paths[1];
				path = [username, sitename, filename].join("/");	
			} else {
				path = [username, filename].join("/");	
			}
			const key = util.getKeyByPath(path);
			this.loading = true;
			const url = await qiniuUpload(key, file, null, {
				username,
				sitename,
				filename,
				type: filetype,
			});

			const cmComp = this.$refs.cm;
			let content = '['+ this.uploadFilename +'](' + url+')'; 
			if (isImage){
				content = "!" + content;	
			}
			cmComp.insertContent(content);
			this.loading = false;
		},

		cursorActivity() {

		},
	},

	mounted() {
		const self = this;
		this.storage = g_app.storage;
		this.value = {
			text:this.storage && this.storage.sessionStorageGetItem(tempContentKey) || (""),
			filename:null,
		}
		g_app.vue.$on(g_app.consts.EVENT_ADD_MOD_TO_EDITOR, function(style){
			self.value = self.$refs.cm.getValue();
			self.value.text += '\n```@' + style.modName + '/' + style.styleName + '\n' +'```\n';
		});

		self.on(self.EVENTS.__EVENT__CODEMIRROR__IN__PAGE__, function(data) {
			if (self.namespace != data.namespace) return;
			const page = data.page;

			self.page = page;
			self.value =  {
				filename: page.path,
				text: page.content || "",
			}
			self.savePageToDB();
		});
	},

	created() {
	},

}
</script>
