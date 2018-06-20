import _ from "lodash";
import Sequelize from 'sequelize';

import consts from "@@/common/consts.js";
import sequelize from "./database.js";

// 用户表定义
const users = sequelize.define('users', {
	id: {
		type: Sequelize.BIGINT,
		autoIncrement: true,
		primaryKey: true,
	},
	
	username: {
		type: Sequelize.STRING(48),
		unique: true,
		allowNull: false,
	},

	password: {
		type: Sequelize.STRING(48),
		//set(val) {
			//this.setDataValue("password", val.toUpperCase());
		//},
	},

	email: {
		type: Sequelize.STRING(24),
		unique: true,
	},

	cellphone: {
		type: Sequelize.STRING(24),
		unique: true,
	},

	nickname: {
		type: Sequelize.STRING(48),
	},

	portrait: {
		type: Sequelize.STRING,
	},

	sex: {
		type: Sequelize.STRING(4),
	},

	description: {
		type: Sequelize.STRING(128),
	},

}, {
	charset: "utf8mb4",
	collate: 'utf8mb4_bin',
});
//user.sync({force:true}).then(() => {
	//console.log("create user table successfully");
//});


const sites = sequelize.define('sites', {
	id: {
		type: Sequelize.BIGINT,
		autoIncrement: true,
		primaryKey: true,
	},
	
	userId: {
		type: Sequelize.BIGINT,
		allowNull: false,
	},

	sitename: {
		type: Sequelize.STRING(48),
		allowNull: false,
	},

	level: {
		type: Sequelize.INTEGER,
	},

	description: {
		type: Sequelize.STRING(128),
	},
}, {
	charset: "utf8mb4",
	collate: 'utf8mb4_bin',
});
//sites.sync({force:true}).then(() => {
	//console.log("create site table successfully");
//});


// 状态表
export const states = sequelize.define("states", {
	id: {
		type: Sequelize.BIGINT,
		autoIncrement: true,
		primaryKey: true,
	},

	userId: {
		type: Sequelize.BIGINT,
		unique: true,
		allowNull: false,
	},

	state: {
		type:Sequelize.INTEGER,
	},

	type: {
		type:Sequelize.INTEGER,
	},

	description: {
		type: Sequelize.STRING(128),
	},

	startDate: {
		type:Sequelize.INTEGER,
	},

	endDate: {
		type:Sequelize.INTEGER,
	},
	
}, {
	charset: "utf8mb4",
	collate: 'utf8mb4_bin',
});
//states.sync({force:true}).then(() => {
	//console.log("create site table successfully");
//});


// 组定义
const groups = sequelize.define("groups", {
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
//groups.sync({force:true}).then(() => {
  //console.log("create files table successfully");
//});

// 组成员表定义
const groupMembers = sequelize.define("groupMembers", {
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
		defaultValue: consts.USER_ACCESS_LEVEL.USER_ACCESS_LEVEL_NONE,
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
//groupMembers.sync({force:true}).then(() => {
  //console.log("create files table successfully");
//});

// 站点组定义
export const siteGroups = sequelize.define("siteGroups", {
	id: {
		type: Sequelize.BIGINT,
		autoIncrement: true,
		primaryKey: true,
	},

	userId: {
		type: Sequelize.BIGINT,
		allowNull: false,
	},

	siteId: {
		type: Sequelize.BIGINT,
		allowNull: false,
	},

	groupId: {
		type: Sequelize.BIGINT,
		allowNull: false,
	},

	level: {
		type: Sequelize.INTEGER,
		defaultValue: consts.USER_ACCESS_LEVEL.USER_ACCESS_LEVEL_NONE,
	},
}, {
	charset: "utf8mb4",
	collate: 'utf8mb4_bin',

	indexes: [
	{
		unique: true,
		fields: ["siteId", "groupId"],
	},
	],
});
//siteGroupsModel.sync({force:true}).then(() => {
  //console.log("create files table successfully");
//});

export default {
	users,
	sites,
	groups,
	groupMembers,
	siteGroups,
};
