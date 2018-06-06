import Sequelize from 'sequelize';
import sequelize from "./database.js";

const Sites = sequelize.define('sites', {
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

//Sites.sync({force:true}).then(() => {
	//console.log("create site table successfully");
//});


export default Sites;
