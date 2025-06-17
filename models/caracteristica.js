"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Caracteristica extends Model {
    static associate(models) {
      this.belongsToMany(models.Baño, {
        through: models.BAÑO_CARACTERISTICAS, // Usamos el modelo que acabamos de crear
        foreignKey: "id_caracteristica",
        otherKey: "id_baño",
      });
    }
  }
  Caracteristica.init(
    {
      id_caracteristica: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre_caracteristica: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      descripcion: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Caracteristica",
      tableName: "CARACTERISTICAS",
      timestamps: false,
    },
  );
  return Caracteristica;
};
