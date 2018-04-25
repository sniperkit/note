
import {mapActions, mapGetters} from "vuex";

import config from "@/config.js";
import {Gitlab} from "@@/common/api/gitlab.js";
import {Keepwork} from "@@/common/api/keepwork.js";

export default {
	data: function() {
		//api: 
	},

	computed: {
		...mapGetters({
			token: "user/token",
			user: "user/user",
			isAuthenticated: "user/isAuthenticated",
		}),
	},

	async mounted() {

	}

}
