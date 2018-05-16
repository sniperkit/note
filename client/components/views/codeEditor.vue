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

import codemirror from "@/components/bases/codemirror.vue";
import qiniuUpload from "@@/common/api/qiniu.js";
const tempContentKey = "cmeditor_temp_content";

export default {
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
			pagePath: "editor/getPagePath",
			getPageContentByPath: "editor/getPageContentByPath",
			switchPage: "editor/switchPage",
		}),
		codemirror() {
			return this.$refs.cm && this.$refs.cm.codemirror;
		},
	},

	watch: {
		switchPage(isSwitchPage) {
			if (!isSwitchPage) {
				return;
			}
			// 切换文件 立即写入
			this.savePageToDB(this.value.filename);
			
			// 切换文件
			this.value = {
				filename: this.pagePath,
				text:this.pagePath && this.getPageContentByPath(this.pagePath) ,
			};
			
			// 重置 切换状态
			this.setSwitchPage(false);
		}
	},

	methods: {
		...mapActions({
			setPage: "editor/setPage",
			setPageContent: "editor/setPageContent",
			savePage: "editor/savePage",
			setSwitchPage: "editor/setSwitchPage",
		}),

		savePageToDB(){
			var value = this.$refs.cm.getValue();
			var filename = value.filename;
			var text = value.text;
			this.change.timer && clearTimeout(this.change.timer);
			if (filename) {
				this.setPage({
					path: filename,
					content: text,
				});
			}
		},

		textChange(payload) {
			this.setPageContent(payload.text);
			var self = this;
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
				if (this.change.timer) {
					clearTimeout(this.change.timer);
				} else {
					self.savePageToDB(); // 第一次修改 也做立即保存
				}
				this.change.timer = setTimeout(function(){
					self.savePageToDB();
				}, 5000);
			}
		},

		save(payload) {
			let {filename, text} = payload;
			if (!filename) {
				return;
			}
			this.savePage({
				path: filename,
				content: text,
			});
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
			this.loading = true;
			
			const file = this.file;
			const paths = this.pagePath.split("/");
			paths[paths.length-1] = this.uploadFilename;
			const path = paths.join("/");
			const url = await qiniuUpload(path, file);
			const cmComp = this.$refs.cm;
			let content = '['+ this.uploadFilename +'](' + url+')'; 
			if (file.type.indexOf("image") == 0){
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
	},

	created() {
	},

}
</script>
