'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.createTable('categories', {
    category_id: {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: Sequelize.DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: 'S'
    },
    created_at: {
      type: Sequelize.DataTypes.DATE,
      defaultValue: new Date
    },
    updated_at: {
      type: Sequelize.DataTypes.DATE,
      defaultValue: new Date
    },
  })

  // return queryInterface.bulkInsert('categories', [
  //   {
  //     name: 'John',
  //     active: 'N',
  //     created_at: new Date(),
  //     updated_at: new Date(),
  //   },
  //   {
  //     name: 'Ejemplo',
  //     active: 'N',
  //     created_at: new Date(),
  //     updated_at: new Date(),
  //   },
  // ]);
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
  // await queryInterface.bulkDelete('categories', null, {});
  await queryInterface.dropTable('categories');
}
