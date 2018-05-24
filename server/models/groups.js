import Sequelize from 'sequelize';
import sequelize from "./database.js";

const Groups = sequelize.define("groups", {
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
});

//Groups.sync({force:true}).then(() => {
  //console.log("create files table successfully");
//});

export default Groups;
