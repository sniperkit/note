import _ from "lodash";
import vue from "vue";
import jwt from "jwt-simple";

export const state = () => ({
	user: {},
	token: null,
});

export const getters = {
	isAuthenticated: (state) => {
		if (!state.token) return false;
		const payload = jwt.decode(state.token, null, true);

		if (payload.nbf && Date.now() < payload.nbf*1000) {
			return false;
		}
		if (payload.exp && Date.now() > payload.exp*1000) {
			return false;
		}

		return true;
	},
	user: (state) => (state.user || {}),
}

export const actions = {
}

export const mutations = {
	setUser(state, user) {
		state.user = user || {};
		state.token = state.user.token || state.token;
	},
	setToken(state, token) {
		state.token = token;
	},
}

//export default {
	//namespaced: true,
	//state, 
	//getters,
	//actions,
	//mutations,
//}
