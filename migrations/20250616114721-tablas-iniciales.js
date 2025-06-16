"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // --- 1. CREAR TABLAS SIN DEPENDENCIAS ---

    await queryInterface.createTable("USUARIOS", {
      id_usuario: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre_usuario: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fecha_registro: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.createTable("BAÑOS", {
      id_baño: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      direccion: {
        type: Sequelize.TEXT,
      },
      ubicacion: {
        type: Sequelize.GEOMETRY("POINT"),
        allowNull: false,
      },
      horario: {
        type: Sequelize.STRING(100),
      },
      costo: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0.0,
      },
      estado: {
        type: Sequelize.STRING(50),
        defaultValue: "Activo",
      },
    });

    await queryInterface.createTable("CARACTERISTICAS", {
      id_caracteristica: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre_caracteristica: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      descripcion: {
        type: Sequelize.TEXT,
      },
    });

    // --- 2. CREAR TABLAS CON DEPENDENCIAS (LLAVES FORÁNEAS) ---

    await queryInterface.createTable("RESEÑAS", {
      id_reseña: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        references: { model: "USUARIOS", key: "id_usuario" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL", // Si se borra un usuario, la reseña se vuelve anónima
      },
      id_baño: {
        type: Sequelize.INTEGER,
        references: { model: "BAÑOS", key: "id_baño" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // Si se borra un baño, se borran sus reseñas
      },
      calificacion_limpieza: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      calificacion_seguridad: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      comentario: {
        type: Sequelize.TEXT,
      },
      fecha_reseña: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Tabla de REPORTES (inferida de las relaciones en los modelos)
    await queryInterface.createTable("REPORTES", {
      id_reporte: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_baño: {
        type: Sequelize.INTEGER,
        references: { model: "BAÑOS", key: "id_baño" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        references: { model: "USUARIOS", key: "id_usuario" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      tipo_reporte: { type: Sequelize.STRING(100), allowNull: false },
      descripcion: { type: Sequelize.TEXT },
      estado_reporte: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "Pendiente",
      },
      fecha_reporte: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // --- 3. CREAR TABLA DE UNIÓN PARA LA RELACIÓN N:M ---

    await queryInterface.createTable("BAÑO_CARACTERISTICAS", {
      id_baño: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: "BAÑOS", key: "id_baño" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_caracteristica: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: "CARACTERISTICAS", key: "id_caracteristica" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Se borran las tablas en el orden INVERSO a la creación
    await queryInterface.dropTable("BAÑO_CARACTERISTICAS");
    await queryInterface.dropTable("REPORTES");
    await queryInterface.dropTable("RESEÑAS");
    await queryInterface.dropTable("CARACTERISTICAS");
    await queryInterface.dropTable("BAÑOS");
    await queryInterface.dropTable("USUARIOS");
  },
};
