<template>
	<div>
	   	hello world
	</div>
</template>

<script>

import * as qiniu from "qiniu-js";
import api from "@@/common/api/note.js";

export default {
	data: function() {
		return {
		}
	},

	async mounted() {
		const self = this;
		const blob = new Blob(["hello world"], {type:"text/plain"});
		const data = await api.qiniu.getUploadTokenByKey({key:"test.md"});
		const token = data.data;
		const key = "test.md";
		const opts =  {
			token: token,
			putExtra: {
				mimeType: null,
			},
			config: {
				useCdnDomain: true,
			},
		}
		const observable = qiniu.upload(blob, key, opts.token, opts.putExtra, opts.config);
		observable.subscribe({
			next(res) {
				console.log(res);
			},
			error(err) {
				console.log(err);
			},
			complete(res){
				console.log(res);
			}
		});
	}
}
</script>

