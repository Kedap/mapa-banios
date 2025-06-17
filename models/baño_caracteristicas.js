"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  // Definimos el modelo explícitamente
  class BAÑO_CARACTERISTICAS extends Model {
    static associate(models) {
      // Las asociaciones principales se definen en los otros modelos (Baño y Caracteristica)
    }
  }

  // Inicializamos el modelo con sus columnas y opciones
  BAÑO_CARACTERISTICAS.init(
    {
      id_baño: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: "BAÑOS", key: "id_baño" },
      },
      id_caracteristica: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: "CARACTERISTICAS", key: "id_caracteristica" },
      },
    },
    {
      sequelize,
      modelName: "BAÑO_CARACTERISTICAS", // Nombre del modelo
      tableName: "BAÑO_CARACTERISTICAS", // Nombre de la tabla
      timestamps: false, // ¡LA INSTRUCCIÓN CLAVE DEFINIDA EN EL PROPIO MODELO!
    },
  );

  return BAÑO_CARACTERISTICAS;
};
