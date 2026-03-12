'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.createTable('templates', {
    template_id: {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    category_id: {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'category_id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    template_data: {
      type: Sequelize.DataTypes.JSONB,
      allowNull: false
    },
    preview_image: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false
    },
    created_at: {
      type: Sequelize.DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: Sequelize.DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
  });
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
  await queryInterface.dropTable('templates');
}
