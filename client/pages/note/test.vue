<template>
	<div>
	</div>
</template>

<script>
import vue from "vue";
import * as qiniu from "qiniu-js";
import api from "@@/common/api/note.js";
import pathToRegexp from "path-to-regexp";
//import adi from "@/components/bases/adi.js";
import tag from "@/components/common/tag.js";
import {tags} from "@/lib/tags";


export default {
	components: {
		tag,
	},

	data: function() {
		return {
			tag: tags.getTag(),
		}
	},

	async mounted() {
		g_app.pathToRegexp = pathToRegexp;
	}
}
</script>

