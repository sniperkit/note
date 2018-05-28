import Sequelize from "sequelize";
import sequelize from "./database.js";

const Pages = sequelize.define("pages", {
	id: {
		type: Sequelize.BIGINT,
		autoIncrement: true,
		primaryKey: true,
	},
	
	key: {  // 存储服务的文件名  推荐使用全路径  可以使用UUID 唯一即可
		type: Sequelize.STRING(256),
		unique: true,
	},

	username: {  // 文件所属者
		type: Sequelize.STRING(48),
		allowNull: false,
	},

	sitename: { // 存在 归于站点  不存在归于 用户  用于多人编辑引用站点资源
		type: Sequelize.STRING(64),
	},

	path: {     // 文件路径  方便用户归类文件
		type: Sequelize.STRING(128),
	},

	filename: { // 文件名  方便用户识别文件
		type: Sequelize.STRING(64),
	},

	public: {   // 是否公开
		type: Sequelize.BOOLEAN,
		defaultValue: false, 
	},

	content: {
		type: Sequelize.TEXT("long"),
	},

	hash: {     // 七牛哈希  文件存于谁就用谁的hash   如 git sha
		type: Sequelize.STRING(64),
	},
}, {
	charset: "utf8mb4",
	collate: 'utf8mb4_bin',
});

//Pages.sync({force:true}).then(() => {
	//console.log("create files table successfully");
//});

export default Pages;
