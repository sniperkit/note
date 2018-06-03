<template>
	<div>
		<fileManager></fileManager>
	</div>
</template>

<script>

import {
	Upload,
} from "element-ui";
import fileManager from "../components/views/fileManager.vue";
import api from "@@/common/api/note.js";
import qiniuUpload from "@@/common/api/qiniu.js";

export default {
	layout: "index",

	components: {
		[Upload.name]: Upload,
		fileManager,
	},

	computed: {
	},

	methods: {
	},

	mounted() {
		//console.log(this.user);
	}
}
</script>
