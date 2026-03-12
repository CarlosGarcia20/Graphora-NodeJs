'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.createTable('refresh_tokens', {
    token: {
      type: Sequelize.DataTypes.TEXT,
      primaryKey: true,
      allowNull: false,
    },
    userid: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userid'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    },
    expiresat: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false
    }
  })
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
  await queryInterface.dropTable('refresh_tokens')
}
