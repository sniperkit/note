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
import wurl from "wurl";

import markdownEx from "@/components/bases/markdownEx.vue";

const getKey = async function(url) {
	console.log(url);
	const getPath = async function(url) {
		const hostname = wurl("hostname", url);
		const officialHostname = wurl("hostname", config.origin);
		let path = wurl("path", url);
		path = path.substring(1);

		if (hostname == officialHostname) {
			return path;
		}

		let data = await api.doamins.getByDomain({domain:hostname});
		data = data.getData();

		if (data && data.user && data.site) {
			path = data.user.username + "/" + data.site.sitename + "/" + path;
		}
		return path;
	}

	let path = await getPath(url);
	if (path[path.length-1] == "/") path = path + "index";

	path = path + config.pageSuffix;

	return util.getKeyByPath(path);
}

export default {
	components: {
		markdownEx,
	},

	data: function() {
		return {
			key: null,
			content: "",
		}
	},

	async asyncData({req}) {
		const url = req.ctx.href;
		const key = await getKey(url);
		const result = await api.pages.getByKey({key:key});
		if (!result || result.isErr()) {
			console.log(result);
			return;
		}

		const page = result.getData();
		const content = page.content || "";
		return {
			content: content,
			key: key,
		};
	},

	methods: {
		async visitPage() {
			await this.api.pages.visitByKey({key: this.key});
		}

	},

	created() {
		//console.log(this.content);
	},

	async mounted() {
		//const url = window.location.href;
		//const key = await getKey(key);
		//const result = await api.pages.get({key:key});
		//if (!result || result.isErr()) {
			//console.log(result);
			//return;
		//}
		//const page = result.getData();

		//this.key = key;
		//this.content = page.content || "";

		this.visitPage();
	}
}
</script>
