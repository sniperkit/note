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
export default {

	methods: {
		async fileUpload() {
			console.log(e, typeof(e));

			const key = this.user.username + "_files/" + e.file.name; 
			const token = await api.files.token({key});

			console.log(token);
			const result = await qiniuUpload(key, e.file, token.data, {"x:public":true});
			console.log(result);
		},
	}

}
</script>
