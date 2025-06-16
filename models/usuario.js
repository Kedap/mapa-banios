"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // Define las relaciones aquí
      this.hasMany(models.Reseña, {
        foreignKey: "id_usuario",
      });
      this.hasMany(models.Reporte, {
        foreignKey: "id_usuario",
      });
    }
  }
  Usuario.init(
    {
      id_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre_usuario: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true, // Validación incorporada
        },
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Usuario",
      tableName: "USUARIOS", // Nombre explícito de la tabla
      timestamps: true, // Sequelize manejará `createdAt` y `updatedAt`
      createdAt: "fecha_registro", // Mapea `createdAt` a tu columna
      updatedAt: false, // No necesitamos `updatedAt` para esta tabla
    },
  );
  return Usuario;
};
