import Sequelize from 'sequelize';
import sequelize from "./database.js";

const DataSource = sequelize.define("dataSource", {
	id: {
		type: Sequelize.BIGINT,
		autoIncrement: true,
		primaryKey: true,
	},

	username: {
		type: Sequelize.STRING(48),
		allowNull: false,
	},

	name: {
		type: Sequelize.STRING(48),
		unique: true,
	},

	type: {
		type: Sequelize.STRING(12),
	},

	token: {
		type: Sequelize.STRING(128),
		allowNull: false,
	},

	baseUrl: {
		type: Sequelize.STRING(64),
	},

	externalUserId: {
		type: Sequelize.BIGINT,
	},

	externalUsername: {
		type: Sequelize.STRING(48),
	},

	externalPassword: {
		type: Sequelize.STRING(128),
	},
	
	isDefault: {
		type: Sequelize.BOOLEAN,
	},
}, {
	charset: "utf8mb4",
	collate: 'utf8mb4_bin',
});

//DataSource.sync({force:true}).then(() => {
	//console.log("create dataSource table successfully");
//});

export default DataSource;
