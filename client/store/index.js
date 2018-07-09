import _ from "lodash";

export const state = () => ({
	data: {
	}
});

export const getters = {
	getData: (state) => (key) => _.get(state.data, key),
}

export const actions = {
	nuxtServerInit({commit}, {req}) {
		if (process.server && req && req.ctx) {
			commit("user/setToken", req.ctx.state.token);
		}
	},
}

export const mutations = {
	setData(state, data) {
		state.data = _.merge({}, state.data, data);
	}
}

