import joi from "joi";

import Controller from "@/controllers/controller.js";
import models from "@/models";

import consts from "@@/common/consts.js";
import ERR from "@@/common/error.js";

export const Pages = class extends Controller {
	constructor() {
		super();
	}


	static getRoutes() {
		this.pathPrefix = "pages";
		const baseRoutes = super.getRoutes();

		const routes = [
		];

		return routes.concat(baseRoutes);
	}
}

export default Pages;
