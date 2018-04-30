<template>
	<div>
		<page :text="content"></page>
	</div>
</template>

<script>
import {
	Message,
} from "element-ui";

import config from "@/config.js";
import api from "@@/common/api/note.js";
import page from "@/components/bases/page.vue";

export default {
	components: {
		page,
	},

	async asyncData({req}) {
		const path = req.ctx.request.path;
		const key = path.substring(1) + config.pageSuffix;
		const result = await api.files.getContent({key:key});
		if (!result || result.isErr()) {
			//Message(result.getMessage());
			return;
		}

		const content = result.getData();
		return {
			content: content
		};
	},

	created() {
	}
}
</script>
