'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		/*
		  Add altering commands here.
		  Return a promise to correctly handle asynchronicity.

		  Example:
		  return queryInterface.createTable('users', { id: Sequelize.INTEGER });
		*/
		return queryInterface.createTable('sites', {
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

			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},

			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
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
		*/
		return queryInterface.dropTable('sites');
	}
};

