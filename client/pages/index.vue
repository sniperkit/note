<template>
	<div>
		{{test}}
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
	},

	mounted() {
		const self= this;
		setTimeout(function() {
			self.setData({key:"hello world"});
		}, 1000);
	}
}
</script>
