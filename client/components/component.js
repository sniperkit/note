
export default {
	props: {
		__components__: {
			type: Object,
			default: function() {
				return {
				}
			}
		},
		__key__: {
			type: String,
		}
	},

	
	computed: {
		__uid__() {
			return this._uid;
		}
	},

	mounted() {
		let self = this;
		let parent = self.$parent;

		if (!self.__key__) return;
		while (parent) {
			if (parent.__components__) {
				parent.__components__[self.__key__] = self;
				break;
			}
			parent = parent.$parent;
		}
	},

	destroyed() {

	}
}
