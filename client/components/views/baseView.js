
import {mapActions, mapGetters} from "vuex";

import config from "@/config.js";
import {Gitlab} from "@@/common/api/gitlab.js";
import {Keepwork} from "@@/common/api/keepwork.js";
import noteEndpoint from "@@/common/api/note.js";

export default {
	data: function() {
		api: noteEndpoint, // api 对象
	},

	computed: {
		...mapGetters({
			token: "user/token",
			user: "user/user",
			isAuthenticated: "user/isAuthenticated",
		}),
	},

	methods: {
		// 此功能可在中间件中实现
		authenticated() {
			if (!this.isAuthenticated) {
				this.$router.push({name: g_app.getRouteName("login")});
			}
		},
		
	}

}
