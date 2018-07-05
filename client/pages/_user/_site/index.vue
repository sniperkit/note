<template>
	<div class="container">
		hello site
	</div>
</template>

<script>
import wurl from "wurl";

import api from "@@/common/api/note.js";

export default {
	async asyncData({req, redirect}) {
		const url = req.ctx.href;
		const path = wurl("path", url);
		const paths = path.split("/");
		const username = paths[1];
		const sitename = paths[2];
		let result = await api.sites.getByName({username, sitename});
		if (result.isErr()) return redirect("/note/notfound");
	},
	async mounted() {
	}
}
</script>
