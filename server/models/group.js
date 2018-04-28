import Sequelize from 'sequelize';
import sequelize from "./database.js";

const Group = sequelize.define("group", {
	id: {
		type: Sequelize.BIGINT,
		autoIncrement: true,
		primaryKey: true,
	},

	username: {
		type: Sequelize.STRING(48),
		allowNull: false,
	},

	groupname: {
		type: Sequelize.STRING(48),
		allowNull: false,
	}
});

export default Group;
