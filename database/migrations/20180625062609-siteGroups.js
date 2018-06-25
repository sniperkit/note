'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('siteGroups', { 
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
				defaultValue: 0,
			},

			createdAt: {
				type: Sequelize.DATE
			},

			updatedAt: {
				type: Sequelize.DATE
			},
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('siteGroups');
	}
};