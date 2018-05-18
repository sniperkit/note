import events from "@/lib/events.js";

export default {
	methods: {
		on(eventName, callback) {
			events.$on(eventName, callback);
		},
		emit(eventName, ...) {
			events.$emit(eventName, ...);
		},
	}
}
