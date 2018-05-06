<template>
	<div>
		<Pages :text="content"></Pages>
	</div>
</template>

<script>
import {
	Message,
} from "element-ui";

import config from "@/config.js";
import api from "@@/common/api/note.js";
import Pages from "@/components/bases/page.vue";

export default {
	components: {
		Pages,
	},

	data: function() {
		return {
			content: "",
		}
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
	},

	//async mounted() {
	//	const path = this.$route.path;
	//	const key = path.substring(1) + config.pageSuffix;
	//	const result = await api.files.getContent({key:key});
	//	if (!result || result.isErr()) {
	//		//Message(result.getMessage());
	//		return;
	//	}

	//	this.content = result.getData();
	//}
}
</script>
