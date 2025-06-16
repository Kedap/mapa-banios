"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Baño extends Model {
    static associate(models) {
      this.hasMany(models.Reseña, { foreignKey: "id_baño" });
      this.hasMany(models.Reporte, { foreignKey: "id_baño" });

      // Relación Muchos a Muchos con Características
      this.belongsToMany(models.Caracteristica, {
        through: "BAÑO_CARACTERISTICAS", // La tabla de unión
        foreignKey: "id_baño",
        otherKey: "id_caracteristica",
      });
    }
  }
  Baño.init(
    {
      id_baño: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      direccion: DataTypes.TEXT,
      // --- MANEJO DE GEOLOCALIZACIÓN CON POSTGIS ---
      ubicacion: {
        type: DataTypes.GEOMETRY("POINT"), // Tipo de dato para PostGIS/MariaDB Spatial
        allowNull: false,
      },
      horario: DataTypes.STRING(100),
      costo: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0.0,
      },
      estado: {
        type: DataTypes.STRING(50),
        defaultValue: "Activo",
      },
    },
    {
      sequelize,
      modelName: "Baño",
      tableName: "BAÑOS",
      timestamps: false, // No necesitamos timestamps para esta tabla
    },
  );
  return Baño;
};
