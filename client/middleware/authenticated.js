

export default function({store, req}) {
	if (process.server && !req) return;

	const isAuthenticated = process.server ? req.ctx.state.user : store.getters["user/isAuthenticated"];

	//console.log(isAuthenticated);
	
	if (!isAuthenticated) {
		return redirect("/note/login");
	}

}
