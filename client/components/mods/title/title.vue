<template>
	<div style="display:flex">
		<el-row></el-row>
		<div>
			<img src="/adi/logo.png" style="width:80px; height:80px">
		</div>
		<div style="display:flex; flex-direction: column;">
			<div style="font-size:24px; color:blue;">
				BUSINESS NAME
			</div>
			<div style="font-size:16px; color:green;">
				TAG LINE
			</div>
		</div>
	</div>
</template>

<script>

import title from "./title.js";

export default {
	data: function() {
		return {}
	},

	mixins: [title],
}
</script>
