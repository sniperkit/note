<template>
	<div>
		{{test}}
		<el-button @click="click">keepwork login</el-button>
		<Test></Test>
	</div>
</template>

<script>
import {mapMutations} from "vuex";

const Test = {
	template: "<div></div>",
	props: {
		__data__: {
			type: Object,
			default: function() {return {};},
		}
	},

	mounted(){
		this.__data__.valued = 2;
		console.log(this.__data__);
	}
}
export default {
	layout: "index",

	data: function() {
		return {
			//__data__:{},
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

	props: {
		__data__: {
			type: Object,
			default: function() {
				return {};
			},
		}
	},

	components: {
		Test,
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
			self.__data__.key = 1;
			console.log(self.__data__);
		}, 1000);
		console.log(this);
	},

	destroyed() {
		console.log(this);
	}
}
</script>
