
'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('groupMembers', { 
			id: {
				type: Sequelize.BIGINT,
				autoIncrement: true,
				primaryKey: true,
			},

			userId: {
				type: Sequelize.BIGINT,
				allowNull: false,
			},

			groupId: {
				type: Sequelize.BIGINT,
				allowNull: false,
			},

			memberId: {
				type: Sequelize.BIGINT,
				allowNull: false,
			},

			level: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
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

			indexes: [
			{
				unique: true,
				fields: ["groupId", "memberId"],
			},
			],
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('groupMembers');
	}
};
