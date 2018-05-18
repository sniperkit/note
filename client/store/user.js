import vue from "vue";
import jwt from "jwt-simple";

const SET_USER = 'SET_USER';
const SET_USER_DATA_SOURCE = "SET_USER_DATA_SOURCE";

export const state = () => ({
	username: "xiaoyao",  // 当前认证用户名
	user: {},
})

export const getters = {
	isAuthenticated: (state) => {
		if (!state.user || !state.user.token) return false;
		const payload = jwt.decode(state.user.token, null, true);
		console.log(payload);

		if (payload.nbf && Date.now() < payload.nbf*1000) {
			return false;
		}
		if (payload.exp && Date.now() > payload.exp*1000) {
			return false;
		}

		return true;
	},
	user: (state) => (state.user || {}),
	dataSource: (state) => state.dataSource,
}

export const actions = {
	setUser({commit}, user){
		commit(SET_USER, user);
	},
	setUserDataSource({commit}, dataSource) {
		commit(SET_USER_DATA_SOURCE, dataSource);
	},
}

export const mutations = {
	[SET_USER](state, user) {
		vue.set(state, "user", user);
	},
	[SET_USER_DATA_SOURCE](state, dataSource) {
		vue.set(state, "dataSource", {
			...(state.dataSource || {}),
			...(dataSource || {})
		});
	},
}

//export default {
	//namespaced: true,
	//state, 
	//getters,
	//actions,
	//mutations,
//}
