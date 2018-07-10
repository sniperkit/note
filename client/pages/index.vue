<template>
	<div>
		{{test}}
		<el-button @click="click">keepwork login</el-button>
	</div>
</template>

<script>
import {mapMutations} from "vuex";

export default {
	layout: "index",

	data: function() {
		return {
		}
	},

	computed: {
		test() {
			return this.getData("key");
		}
	},

	watch: {
		test(val) {
			console.log(val);
		}
	},

	components: {
	},

	methods: {
		click() {
			this.$auth.authenticate("note", {state:"login"});
		}
	},

	mounted() {
		const self= this;
		setTimeout(function() {
			self.setData({key:"hello world"});
		}, 1000);
	}
}
</script>
