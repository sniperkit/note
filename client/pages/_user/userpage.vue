<template>
	<div>
		<markdownEx :text="content"></markdownEx>
	</div>
</template>

<script>
import {
	Message,
} from "element-ui";

import config from "@/config.js";
import api from "@@/common/api/note.js";
import util from "@@/common/util.js";

import markdownEx from "../../components/bases/markdownEx.vue";

export default {
	components: {
		markdownEx,
	},

	data: function() {
		return {
			content: "",
		}
	},

	//async asyncData({req}) {
	//	const path = req.ctx.request.path;
	//	const key = path.substring(1) + config.pageSuffix;
	//	const result = await api.files.getContent({key:key});
	//	if (!result || result.isErr()) {
	//		//Message(result.getMessage());
	//		return;
	//	}

	//	const content = result.getData();
	//	return {
	//		content: content
	//	};
	//},

	created() {
		console.log(this.content);
	},

	async mounted() {
		const url = this.$route.path;
		const path = url.substring(1) + config.pageSuffix;
		const key = util.getKeyByPath(path);
		const result = await api.files.get({key:key});
		if (!result || result.isErr()) {
			//Message(result.getMessage());
			return;
		}

		this.content = result.getData().content;
	}
}
</script>
