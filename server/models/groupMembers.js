import Sequelize from 'sequelize';
import sequelize from "./database.js";

import consts from "@@/common/consts.js";

const USER_ACCESS_LEVEL_NONE = consts.USER_ACCESS_LEVEL.USER_ACCESS_LEVEL_NONE;
const USER_ACCESS_LEVEL_READ = consts.USER_ACCESS_LEVEL.USER_ACCESS_LEVEL_READ;
const USER_ACCESS_LEVEL_WRITE = consts.USER_ACCESS_LEVEL.USER_ACCESS_LEVEL_WRITE;

const GroupMembers = sequelize.define("groupMembers", {
	id: {
		type: Sequelize.BIGINT,
		autoIncrement: true,
		primaryKey: true,
	},

	userId: {
		type: Sequelize.BIGINT,
		allowNull: false,
	},

	groupId: {
		type: Sequelize.BIGINT,
		allowNull: false,
	},

	memberId: {
		type: Sequelize.BIGINT,
		allowNull: false,
	},

	level: {
		type: Sequelize.INTEGER,
		defaultValue: USER_ACCESS_LEVEL_NONE,
	},
}, {
	charset: "utf8mb4",
	collate: 'utf8mb4_bin',

	indexes: [
	{
		unique: true,
		fields: ["groupId", "memberId"],
	},
	],
});

//GroupMembers.sync({force:true}).then(() => {
  //console.log("create files table successfully");
//});

export default GroupMembers;
