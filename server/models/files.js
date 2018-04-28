import Sequelize from "sequelize";
import sequelize from "./database.js";

const Files = sequelize.define("files", {
	id: {
		type: Sequelize.BIGINT,
		autoIncrement: true,
		primaryKey: true,
	},
	
	key: {
		type: Sequelize.STRING(256),
		unique: true,
	},

	username: {
		type: Sequelize.STRING(48),
		allowNull: false,
	},

	sitename: {
		type: Sequelize.STRING(64),
	},

	type: {
		type: Sequelize.STRING(12),
	},

	filename: {
		type: Sequelize.STRING(128),
	},

	hash: {
		type: Sequelize.STRING(64),
	},

	sha: {
		type: Sequelize.STRING(64),
	},
});


export define Files;
