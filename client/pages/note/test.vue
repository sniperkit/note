<template>
	<div>
		hello world
	</div>
</template>

<script>

import * as qiniu from "qiniu-js";
import api from "@@/common/api/note.js";
import pathToRegexp from "path-to-regexp";
export default {
	data: function() {
		return {
		}
	},

	async mounted() {
		g_app.pathToRegexp = pathToRegexp;
	}
}
</script>

