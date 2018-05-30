import Sequelize from 'sequelize';
import sequelize from "./database.js";

const Sites = sequelize.define('sites', {
	id: {
		type: Sequelize.BIGINT,
		autoIncrement: true,
		primaryKey: true,
	},
	
	username: {
		type: Sequelize.STRING(48),
		allowNull: false,
	},

	sitename: {
		type: Sequelize.STRING(48),
		allowNull: false,
	},

	public: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
	},

	description: {
		type: Sequelize.STRING(128),
	},
}, {
	charset: "utf8mb4",
	collate: 'utf8mb4_bin',
});

//Site.sync({force:true}).then(() => {
	//console.log("create site table successfully");
//});


export default Sites;
