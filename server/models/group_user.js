import Sequelize from 'sequelize';
import sequelize from "./database.js";

export const USER_ACCESS_LEVEL_NONE = 1;
export const USER_ACCESS_LEVEL_READ = 2;
export const USER_ACCESS_LEVEL_WRITE = 4;
export const USER_ACCESS_LEVEL = {
	USER_ACCESS_LEVEL_NONE,
	USER_ACCESS_LEVEL_READ,
	USER_ACCESS_LEVEL_WRITE,
}

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
	},

	membername: {
		type: Sequelize.STRING(48),
		allowNull: false,
	},

	level: {
		type: Sequelize.INT,
		defaultValue: USER_ACCESS_LEVEL_NONE,
	},
}, {
	charset: "utf8mb4",
	collate: 'utf8mb4_bin',
});

export default Group;
