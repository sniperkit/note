import vue from "vue";
import vueAxios from "vue-axios";
import vueAuthenticate from "vue-authenticate";
import axios from "axios";

import config from "../config.js";
vue.use(vueAxios, axios);
vue.use(vueAuthenticate, {
	providers: {
		github: {
			clientId: config.oauths.github.clientId,
			redirectUri: config.oauths.github.redirectUri,
		},

		facebook: {
			clientId: config.oauths.facebook.clientId,
			clientSecret: config.oauths.facebook.clientSecret,
			redirectUri: config.oauths.facebook.redirectUri,
			authorizationEndpoint: config.oauths.facebook.authorizationEndpoint,
		},
	}
});
