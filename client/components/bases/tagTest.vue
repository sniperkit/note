
<template>
	<div @click="clickContainer" v-text="__data__.text">
	</div>
</template>

<script>

import component from "@/components/component.js";

export default {
	mixins: [component],

	props: {
		__data__: {
			type: Object,
			default: function() {
				return {
					text:"",
				}
			}
		},
	},

	computed: {
		componentEditor() {
			return this.getData("componentEditor");
		}
	},

	watch: {
		componentEditor(val) {
			console.log(val);
			this.__data__.text = val.text;
		}
	},

	methods: {
		clickContainer() {
			this.setData("componentEditor", {
				uid: this.__uid__,
				type: "text",
			});
		}
	}
}
</script>
