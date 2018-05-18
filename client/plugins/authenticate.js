import vue from "vue";
import vueAxios from "vue-axios";
import vueAuthenticate from "vue-authenticate";
import axios from "axios";

import config from "../config.js";
vue.use(vueAxios, axios);
vue.use(vueAuthenticate, {
	providers: {
		github: {
			clientId: config.oauth.github.clientId,
			redirectUri: config.oauth.github.redirectUri,
		},

		facebook: {
			clientId: config.oauth.facebook.clientId,
			clientSecret: config.oauth.facebook.clientSecret,
			redirectUri: config.oauth.facebook.redirectUri,
			authorizationEndpoint: config.oauth.facebook.authorizationEndpoint,
		},
	}
});
