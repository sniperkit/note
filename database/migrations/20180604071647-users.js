'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		/*
		  Add altering commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		*/
		return queryInterface.createTable('users', { 
			id: {
				type: Sequelize.BIGINT,
				autoIncrement: true,
				primaryKey: true,
			},
			
			username: {
				type: Sequelize.STRING(48),
				unique: true,
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
	},

	down: (queryInterface, Sequelize) => {
		/*
		  Add reverting commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		  return queryInterface.dropTable('users');
		*/
	}
};
