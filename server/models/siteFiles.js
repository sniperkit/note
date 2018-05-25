import Sequelize from "sequelize";
import sequelize from "./database.js";

const SiteFiles = sequelize.define("siteFiles", {
	id: {
		type: Sequelize.BIGINT,
		autoIncrement: true,
		primaryKey: true,
	},
	
	fileId: {  // 文件ID
		type: Sequelize.BIGINT,
		allowNull: false,
	},

	username: {  // 文件使用位置的的用户名
		type: Sequelize.STRING(48),
		allowNull: false,
	},

	sitename: { // 文件使用位置的站点名
		type: Sequelize.STRING(64),
		allowNull: false,
	},

	filename: {
		type: Sequelize.STRING(64),
		allowNull: false,
	},

	filepath: {
		type: Sequelize.STRING(128),
	},

	pagepath: {  // 所应用的页面路径  文本解析 引用文件记录删除
		type: Sequelize.STRING(128),
		allowNull: false,
	},
}, {
	charset: "utf8mb4",
	collate: 'utf8mb4_bin',
});

//SiteFiles.sync({force:true}).then(() => {
	//console.log("create files table successfully");
//});

export default SiteFiles;
