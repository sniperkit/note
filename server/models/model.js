
import _Sequelize from 'sequelize';
import _sequelize from "./database.js";

export const Sequelize = _Sequelize;
export const sequelize = _sequelize;

export const models = {};

export class Model {
	static register(name, model, inst, rawModel) {
		models[name] = {model, inst, rawModel}
	}

	static getModel(name) { return (models[name] || {}).model; }
	static getModelInst(name) { return (models[name] || {}).inst; }
	static getRawModel(name) { return (models[name] || {}).rawModel; }

	static filterWhere(where = {}) {
		for (let key in where) {
			if (where[key] == undefined) {
				delete where[key];
			}
		}
	}

	async create(...args) {
		return await this.model.create(...args);
	}

	async delete(...args) {
		return await this.model.destroy(...args);
	}

	async update(...args) {
		return await this.model.upsert(...args);
	}

	async find(options) {
		Model.filterWhere(options.where);
		return await this.model.findAll(options);	
	}

	async findOne(...args) {
		return await this.model.findOne(...args);	
	}

	async upsert(...args) {
		return await this.model.upsert(...args);	
	}
}

export default Model;
