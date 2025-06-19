"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
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
          isEmail: true,
        },
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rol: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "usuario", // 'usuario' o 'admin'
      },
    },
    {
      sequelize,
      modelName: "Usuario",
      tableName: "USUARIOS", // Nombre explícito de la tabla
      timestamps: true,
      createdAt: "fecha_registro",
      updatedAt: false,
    },
  );
  return Usuario;
};
