<template>
	<div>
	</div>
</template>

<script>

import * as qiniu from "qiniu-js";
import api from "@@/common/api/note.js";
import pathToRegexp from "path-to-regexp";

import "@/components/mods/title";


import adi from "@/components/bases/adi.js";
export default {
	components: {
	},

	data: function() {
		return {
		}
	},

	async mounted() {
		g_app.pathToRegexp = pathToRegexp;
	}
}
</script>

