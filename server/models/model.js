import _ from "lodash";

import models from "./models.js";

class Model {
	static filterWhere(where = {}) {
		for (let key in where) {
			if (where[key] == undefined) {
				delete where[key];
			}
		}
	}

	constructor() {
		this.modelName = _.camelCase(this.constructor.name);
	}

	get model() {
		return models[this.modelName];
	}


	async create(...args) {
		return await this.model.create(...args);
	}

	async delete(...args) {
		return await this.model.destroy(...args);
	}

	async destroy(...args) {
		return await this.model.destroy(...args);
	}

	async update(...args) {
		return await this.model.upsert(...args);
	}

	async find(options) {
		Model.filterWhere(options.where);
		return await this.model.findAll(options);	
	}

	async findAll(options) {
		Model.filterWhere(options.where);
		return await this.model.findAll(options);	
	}

	async findAndCount(options) {
		Model.filterWhere(options.where);
		return await this.model.findAndCount(options);	
	}

	async findOne(...args) {
		return await this.model.findOne(...args);	
	}

	async upsert(...args) {
		return await this.model.upsert(...args);	
	}
}

export default Model;
