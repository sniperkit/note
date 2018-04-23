
import {mapActions, mapGetters} from "vuex";

import config from "@/config.js";
import keepwork from "@@/common/api/keepwork.js";
keepwork.endpoint.defaults.baseURL = config.keepwork.baseURL;

export default {
	data: function() {
		return {
			keepwork: keepwork,
		};
	},

	computed: {
		...mapGetters({
			token: "user/token",
			user: "user/user",
			isAuthenticated: "user/isAuthenticated",
		}),
	},

	mounted() {
		keepwork.endpoint.defaults.headers.common['Authorization'] = "Bearer " + this.token;
	},
}
