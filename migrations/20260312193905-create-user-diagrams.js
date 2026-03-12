'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.createTable('user_diagrams', {
    template_id: {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userid'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true
    },
    template_data: {
      type: Sequelize.DataTypes.JSONB,
      allowNull: true
    },
    is_favorite: {
      type: Sequelize.DataTypes.CHAR(1),
      defaultValue: 'N'
    },
    preview_image: {
      type: Sequelize.DataTypes.TEXT
    },
    status: {
      type: Sequelize.DataTypes.CHAR(1),
      defaultValue: 'A'
    },
    created_at: {
      type: Sequelize.DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: Sequelize.DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
  */
  await queryInterface.dropTable('user_diagrams');
}
