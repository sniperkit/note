<template>
	<div>
		<el-input v-model="text"></el-input>
		<tagTest></tagTest>
	</div>
</template>

<script>
import component from "@/components/component.js";
import tagTest from "@/components/bases/tagTest.vue";
import {mapMutations} from "vuex";

export default {
	layout: "index",

	mixins:[component],
	components: {
		tagTest,
	},

	data: function() {
		return {
			text:"",
		}
	},

	computed: {
		componentEditor() {
			return this.getData("componentEditor");
		}
	},

	watch: {
		text(val) {
			const componentEditor = this.componentEditor || {};
			this.setData("componentEditor", {text:val});
		}
	},

	props: {
		__data__: {
			type: Object,
			default: function() {
				return {};
			},
		}
	},


	methods: {
	},

	mounted() {
	},

	destroyed() {
	}
}
</script>
