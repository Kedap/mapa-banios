"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Reporte extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Un reporte pertenece a un Usuario y a un Baño
      this.belongsTo(models.Usuario, { foreignKey: "id_usuario" });
      this.belongsTo(models.Baño, { foreignKey: "id_baño" });
    }
  }
  Reporte.init(
    {
      id_reporte: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      tipo_reporte: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.TEXT,
      },
      estado_reporte: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "Pendiente",
      },
      // Las llaves foráneas id_baño y id_usuario son añadidas automáticamente
      // por Sequelize a través de las asociaciones 'belongsTo'.
    },
    {
      sequelize,
      modelName: "Reporte",
      tableName: "REPORTES",
      createdAt: "fecha_reporte", // Mapea createdAt a tu columna
      updatedAt: false, // No necesitamos updatedAt para esta tabla
    },
  );
  return Reporte;
};
