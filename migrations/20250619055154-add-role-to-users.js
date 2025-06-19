"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("USUARIOS", "rol", {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: "usuario", // Todos los usuarios son 'usuario' por defecto
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("USUARIOS", "rol");
  },
};
