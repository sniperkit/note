<template>
	<div>
		<button @click="click('github')">github</button>
		<button @click="click('facebook')">facebook</button>
	</div>
</template>

<script>
import vue from "vue";
import * as qiniu from "qiniu-js";
import api from "@@/common/api/note.js";
import tag from "@/components/common/tag.js";
import {tags} from "@/lib/tags";

export default {
	components: {
	},

	data: function() {
		return {
		}
	},

	methods: {
		click(name) {
			this.$auth.authenticate(name).then(function(data) {
				console.log(data);
			})
		}
	},

	async mounted() {
	}
}
</script>

