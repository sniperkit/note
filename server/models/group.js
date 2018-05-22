import Sequelize from 'sequelize';
import sequelize from "./database.js";

const Group = sequelize.define("group", {
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
	}
}, {
	charset: "utf8mb4",
	collate: 'utf8mb4_bin',
});

//Group.sync({force:true}).then(() => {
  //console.log("create files table successfully");
//});

export default Group;
