"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reseña extends Model {
    static associate(models) {
      // Define el otro lado de la relación
      this.belongsTo(models.Usuario, { foreignKey: "id_usuario" });
      this.belongsTo(models.Baño, { foreignKey: "id_baño" });
    }
  }
  Reseña.init(
    {
      id_reseña: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      calificacion_limpieza: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }, // Validación a nivel de modelo
      },
      calificacion_seguridad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
      comentario: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Reseña",
      tableName: "RESEÑAS",
      createdAt: "fecha_reseña",
      updatedAt: false,
    },
  );
  return Reseña;
};
