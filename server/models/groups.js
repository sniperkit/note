import {Sequelize, sequelize, Model} from "./model.js";

const model = sequelize.define("groups", {
	id: {
		type: Sequelize.BIGINT,
		autoIncrement: true,
		primaryKey: true,
	},

	userId: {
		type: Sequelize.BIGINT,
		allowNull: false,
	},

	groupname: {
		type: Sequelize.STRING(48),
		allowNull: false,
	},

	description: {
		type: Sequelize.STRING(128),
	},
}, {
	charset: "utf8mb4",
	collate: 'utf8mb4_bin',

	indexes: [
	{
		unique: true,
		fields: ["userId", "groupname"],
	},
	],
});

//model.sync({force:true}).then(() => {
  //console.log("create files table successfully");
//});


export const Groups = class extends Model {
	constructor() {
		super();

		this.model = model;
	}
}

export const groups = new Groups();

Model.register("groups", Groups, groups, model);

export default groups;
