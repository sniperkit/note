import Model from "./model.js";

export const Users = class extends Model {
	constructor() {
		super();
		this.exclude = ["password"];
	}
}

export default new Users();
