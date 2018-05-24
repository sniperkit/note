<template>
	<div>
		<el-upload 
			class="upload-demo" 
			drag 
		    action="#" 
			:http-request="fileUpload"
			multiple>
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
		</el-upload>
	</div>
</template>

<script>
import {
	Upload,
} from "element-ui";

import {mapActions, mapGetters} from "vuex";

import api from "@@/common/api/note.js";
import qiniuUpload from "@@/common/api/qiniu.js";

export default {
	layout: "index",

	components: {
		[Upload.name]: Upload,
	},

	computed: {
		...mapGetters({
			user: "user/user",
			isLogin: "user/isAuthenticated",
		}),
	},

	methods: {
		async fileUpload(e) {
			console.log(e, typeof(e));

			const key = this.user.username + "_files/" + e.file.name; 
			const token = await api.files.token({key});

			console.log(token);
			const result = await qiniuUpload(key, e.file, token.data, {"x:public":true});
			console.log(result);
		}
	},

	mounted() {
		//console.log(this.user);
	}
}
</script>
