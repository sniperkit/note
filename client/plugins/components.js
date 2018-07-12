import vue from "vue";
import {mapGetters, mapActions, mapMutations} from "vuex";
import _ from "lodash";
import jwt from "jwt-simple";

import EVENTS from "@/lib/events.js";
import config from "@/config.js";
import api from "@@/common/api/note.js";

import "@/components/bases";
import "@/components/complex";
import {registerModTag} from  "@/components/mods";

// 定义事件对象
const events = new vue();

export const component = {
	data: function() {
		return {
			EVENTS:EVENTS,
			api: api,
		}
	},

	props: {
		namespace: {
			type: String,
		},
	},

	computed: {
		...mapGetters({
			user: "user/user",
			isAuthenticated: "user/isAuthenticated",
			getData: "getData",
		}),
	},

	methods: {
		setData(key, data, replace=false) {
			if (!replace) data = _.merge({}, this.getData(key), data);
			
			this.$store.commit("setData", {[key]:data});
		},

		...mapMutations({
			setUser: "user/setUser",
		}),

		on(eventName, callback) {
			events.$on(eventName, callback);
		},

		emit(eventName, ...args) {
			events.$emit(eventName, ...args);
		},
		pushName(name) {
			this.$router.push({name:config.urlPrefix + '-' + name});
		},
	},

	beforeMount() {
		const self = this;
	},
}

vue.use({
	install(vue, options) {
		vue.mixin(component);
	}
});

export default ({store}) => {
	if (process.client) {
		registerModTag(store);
	}
}
