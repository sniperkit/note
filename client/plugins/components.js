import vue from "vue";
import jwt from "jwt-simple";

import EVENTS from "@/lib/events.js";

import "@/components/bases";
import "@/components/complex";
import {registerModTag} from  "@/components/mods";

function localStorageSetUser(user = {}) {
	if (process.server) {
		return ;
	}

	window.localStorage.setItem("userinfo", JSON.stringify(user));
}

function localStorageGetUser() {
	if (process.server) {
		return {};
	}

	try {
		return JSON.parse(window.localStorage.getItem("userinfo"));
	} catch (e) {
		return {};
	}
}

// 定义事件对象
const events = new vue();
export const component = {
	data: function() {
		return {
			EVENTS:EVENTS,
			user: {},
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
		setUser(user) {
			this.user = user;
			localStorageSetUser(user);
		},
		getUser() {
			this.user = this.user.id ? this.user : localStorageGetUser();

			if (this.isAuthenticated()){
				return this.user;
			}

			return {};
		},
		isAuthenticated() {
			if (!this.user || !this.user.token) return false;
			const payload = jwt.decode(this.user.token, null, true);
			//console.log(payload);

			if (payload.nbf && Date.now() < payload.nbf*1000) {
				return false;
			}
			if (payload.exp && Date.now() > payload.exp*1000) {
				return false;
			}

			return true;
		}
	},

	mounted() {
		const self = this;

		self.user = self.getUser();

		self.on(self.EVENTS.__EVENT__USERINFO__, function(user){
			self.user = user;
		});

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
