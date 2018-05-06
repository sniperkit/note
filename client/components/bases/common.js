import _ from "lodash";

export default {
	data: function() {
		return {
		}
	},
	props: {
		tag: {
			type:Object,
		},
	},
	watch: {
		"tag.vars": function(val) {
			this.vars = val;
		}
	},
	created(){
	}
}
