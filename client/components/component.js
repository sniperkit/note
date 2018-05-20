import {__EVENTS__, events} from "./events.js";

export const component = {
	data: function() {
		return {
			EVENTS:__EVENTS__,
		}
	},

	props: {
		namespace: {
			type: String,
		},
	},

	methods: {
		on(eventName, callback) {
			events.$on(eventName, callback);
		},
		emit(eventName, ...args) {
			events.$emit(eventName, ...args);
		},
	}
}

export default {
	events,
	component,
}
