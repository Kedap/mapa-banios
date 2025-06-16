"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // --- 1. POBLAR TABLAS SIN DEPENDENCIAS ---
    try {
      const hashedPassword = await bcrypt.hash("password123", 10);
      await queryInterface.bulkInsert(
        "USUARIOS",
        [
          {
            nombre_usuario: "AnaG",
            email: "ana@example.com",
            password_hash: hashedPassword,
            fecha_registro: new Date(),
          },
          {
            nombre_usuario: "CarlosS",
            email: "carlos@example.com",
            password_hash: hashedPassword,
            fecha_registro: new Date(),
          },
          {
            nombre_usuario: "SofiaL",
            email: "sofia@example.com",
            password_hash: hashedPassword,
            fecha_registro: new Date(),
          },
          {
            nombre_usuario: "DavidM",
            email: "david@example.com",
            password_hash: hashedPassword,
            fecha_registro: new Date(),
          },
          {
            nombre_usuario: "LauraR",
            email: "laura@example.com",
            password_hash: hashedPassword,
            fecha_registro: new Date(),
          },
          {
            nombre_usuario: "JuanP",
            email: "juan@example.com",
            password_hash: hashedPassword,
            fecha_registro: new Date(),
          },
          {
            nombre_usuario: "MariaF",
            email: "maria@example.com",
            password_hash: hashedPassword,
            fecha_registro: new Date(),
          },
          {
            nombre_usuario: "PedroV",
            email: "pedro@example.com",
            password_hash: hashedPassword,
            fecha_registro: new Date(),
          },
          {
            nombre_usuario: "ElenaC",
            email: "elena@example.com",
            password_hash: hashedPassword,
            fecha_registro: new Date(),
          },
          {
            nombre_usuario: "MiguelA",
            email: "miguel@example.com",
            password_hash: hashedPassword,
            fecha_registro: new Date(),
          },
        ],
        {},
      );
      console.log("\n✅ Datos de USUARIOS insertados correctamente.");
    } catch (error) {
      console.error("\n❌ Error al insertar datos en la tabla USUARIOS:");
      console.error(error);
      throw error; // Detiene la migración si hay un error
    }

    try {
      await queryInterface.bulkInsert(
        "CARACTERISTICAS",
        [
          {
            nombre_caracteristica: "Acceso para silla de ruedas",
            descripcion:
              "Cuenta con rampas y espacio suficiente para movilidad.",
          },
          {
            nombre_caracteristica: "Gratuito",
            descripcion: "No se requiere pago para el uso.",
          },
          {
            nombre_caracteristica: "Cambiador de bebés",
            descripcion: "Dispone de una mesa para cambiar pañales.",
          },
          {
            nombre_caracteristica: "Abierto 24h",
            descripcion: "El servicio está disponible las 24 horas del día.",
          },
          {
            nombre_caracteristica: "Requiere consumo",
            descripcion:
              "Es necesario comprar algo en el establecimiento para su uso.",
          },
        ],
        {},
      );
      console.log("✅ Datos de CARACTERISTICAS insertados correctamente.");
    } catch (error) {
      console.error(
        "\n❌ Error al insertar datos en la tabla CARACTERISTICAS:",
      );
      console.error(error);
      throw error;
    }

    // --- 2. PREPARAR Y POBLAR BAÑOS (CON LÓGICA MULTI-DIALECTO) ---
    try {
      const bañosData = [
        {
          nombre: "Baños del Parque Hundido",
          direccion: "Av. Insurgentes Sur s/n, Benito Juárez",
          ubicacion: { type: "Point", coordinates: [-99.1789, 19.3625] },
          costo: 5.0,
          estado: "Activo",
        },
        {
          nombre: "Sanborns de los Azulejos",
          direccion: "Av. Madero 4, Centro Histórico",
          ubicacion: { type: "Point", coordinates: [-99.1405, 19.4344] },
          costo: 10.0,
          estado: "Activo",
        },
        {
          nombre: "Estación de Metro Zócalo",
          direccion: "Línea 2, Debajo de la Plaza de la Constitución",
          ubicacion: { type: "Point", coordinates: [-99.1332, 19.4326] },
          costo: 5.0,
          estado: "Activo",
        },
        {
          nombre: "Mercado de Coyoacán",
          direccion: "Ignacio Allende s/n, Coyoacán",
          ubicacion: { type: "Point", coordinates: [-99.1629, 19.3496] },
          costo: 6.0,
          estado: "Activo",
        },
        {
          nombre: "Centro Comercial Reforma 222",
          direccion: "Av. Paseo de la Reforma 222",
          ubicacion: { type: "Point", coordinates: [-99.1621, 19.4295] },
          costo: 10.0,
          estado: "Fuera_de_Servicio",
        },
        {
          nombre: "Parque México",
          direccion: "Av. México s/n, Condesa",
          ubicacion: { type: "Point", coordinates: [-99.1718, 19.4095] },
          costo: 0.0,
          estado: "Activo",
        },
        {
          nombre: "Librería Gandhi Mauricio Achar",
          direccion: "Miguel Ángel de Quevedo 121, Coyoacán",
          ubicacion: { type: "Point", coordinates: [-99.1708, 19.3453] },
          costo: 0.0,
          estado: "Activo",
        },
        {
          nombre: "Terminal de Autobuses de Pasajeros de Oriente (TAPO)",
          direccion: "Calz. Ignacio Zaragoza 200",
          ubicacion: { type: "Point", coordinates: [-99.1121, 19.4262] },
          costo: 8.0,
          estado: "Activo",
        },
        {
          nombre: "Vips Cuitláhuac",
          direccion: "Av. Cuitláhuac 3368",
          ubicacion: { type: "Point", coordinates: [-99.1678, 19.4761] },
          costo: 0.0,
          estado: "Bajo_Revisión",
        },
        {
          nombre: "Baños Públicos Alameda Central",
          direccion: "Av. Hidalgo s/n, Centro",
          ubicacion: { type: "Point", coordinates: [-99.1437, 19.436] },
          costo: 5.0,
          estado: "Activo",
        },
        {
          nombre: "Cineteca Nacional",
          direccion: "Av. México Coyoacán 389",
          ubicacion: { type: "Point", coordinates: [-99.1633, 19.3582] },
          costo: 7.0,
          estado: "Activo",
        },
        {
          nombre: "Plaza Garibaldi",
          direccion: "Eje Central Lázaro Cárdenas 43",
          ubicacion: { type: "Point", coordinates: [-99.1394, 19.4414] },
          costo: 6.0,
          estado: "Activo",
        },
        {
          nombre: "Palacio de Hierro Polanco",
          direccion: "Av. Moliere 222, Polanco",
          ubicacion: { type: "Point", coordinates: [-99.2045, 19.4343] },
          costo: 15.0,
          estado: "Activo",
        },
        {
          nombre: "Walmart Universidad",
          direccion: "Av. Universidad 936-A",
          ubicacion: { type: "Point", coordinates: [-99.1724, 19.3664] },
          costo: 5.0,
          estado: "Activo",
        },
        {
          nombre: "Hospital General de México",
          direccion: "Dr. Balmis 148",
          ubicacion: { type: "Point", coordinates: [-99.1534, 19.4144] },
          costo: 5.0,
          estado: "Activo",
        },
      ];

      const dialect = queryInterface.sequelize.getDialect();
      console.log(
        `\nℹ️  Preparando datos para BAÑOS usando el dialecto: ${dialect}`,
      );

      const bañosParaInsertar = bañosData.map((baño) => {
        let ubicacionSql;
        if (dialect === "postgres") {
          ubicacionSql = Sequelize.fn(
            "ST_GeomFromGeoJSON",
            JSON.stringify(baño.ubicacion),
          );
        } else {
          const [longitude, latitude] = baño.ubicacion.coordinates;
          const wktPoint = `POINT(${longitude} ${latitude})`;
          ubicacionSql = Sequelize.fn("ST_GeomFromText", wktPoint);
        }
        return {
          ...baño,
          ubicacion: ubicacionSql,
        };
      });

      console.log(
        "ℹ️  [DEBUG] Muestra de un objeto BAÑO procesado para inserción:",
      );
      console.log(JSON.stringify(bañosParaInsertar[0], null, 2));

      await queryInterface.bulkInsert("BAÑOS", bañosParaInsertar, {});
      console.log("✅ Datos de BAÑOS insertados correctamente.");
    } catch (error) {
      console.error("\n❌ Error al insertar datos en la tabla BAÑOS:");
      console.error(error);
      throw error;
    }

    // --- 3, 4 y 5. POBLAR TABLAS CON DEPENDENCIAS ---
    try {
      await queryInterface.bulkInsert(
        "RESEÑAS",
        [
          {
            id_usuario: 1,
            id_baño: 1,
            calificacion_limpieza: 4,
            calificacion_seguridad: 5,
            comentario: "Muy limpio y seguro, lo recomiendo.",
            fecha_reseña: new Date(),
          },
          {
            id_usuario: 2,
            id_baño: 1,
            calificacion_limpieza: 5,
            calificacion_seguridad: 5,
            comentario: "Impecable.",
            fecha_reseña: new Date(),
          },
          {
            id_usuario: 3,
            id_baño: 2,
            calificacion_limpieza: 5,
            calificacion_seguridad: 5,
            comentario: "Caro pero vale la pena, siempre limpio.",
            fecha_reseña: new Date(),
          },
          {
            id_usuario: 4,
            id_baño: 2,
            calificacion_limpieza: 4,
            calificacion_seguridad: 4,
            comentario: "Buen servicio.",
            fecha_reseña: new Date(),
          },
          {
            id_usuario: 5,
            id_baño: 2,
            calificacion_limpieza: 5,
            calificacion_seguridad: 5,
            comentario: "El mejor del centro.",
            fecha_reseña: new Date(),
          },
          {
            id_usuario: 6,
            id_baño: 3,
            calificacion_limpieza: 2,
            calificacion_seguridad: 3,
            comentario: "Sucio y con mucha gente, pero te saca del apuro.",
            fecha_reseña: new Date(),
          },
          {
            id_usuario: 7,
            id_baño: 3,
            calificacion_limpieza: 1,
            calificacion_seguridad: 2,
            comentario: "No había papel.",
            fecha_reseña: new Date(),
          },
          {
            id_usuario: 8,
            id_baño: 6,
            calificacion_limpieza: 3,
            calificacion_seguridad: 4,
            comentario: "Gratis y funcional, nada especial.",
            fecha_reseña: new Date(),
          },
          {
            id_usuario: 9,
            id_baño: 6,
            calificacion_limpieza: 4,
            calificacion_seguridad: 4,
            comentario: "Para ser público y gratis está muy bien.",
            fecha_reseña: new Date(),
          },
          ...Array.from({ length: 31 }, (_, i) => ({
            id_usuario: (i % 10) + 1,
            id_baño: (i % 15) + 1,
            calificacion_limpieza: Math.floor(Math.random() * 5) + 1,
            calificacion_seguridad: Math.floor(Math.random() * 5) + 1,
            comentario:
              "Esta es una reseña de prueba generada automáticamente.",
            fecha_reseña: new Date(),
          })),
        ],
        {},
      );
      console.log("✅ Datos de RESEÑAS insertados correctamente.");
    } catch (error) {
      console.error("\n❌ Error al insertar datos en la tabla RESEÑAS:");
      console.error(error);
      throw error;
    }

    try {
      await queryInterface.bulkInsert(
        "BAÑO_CARACTERISTICAS",
        [
          { id_baño: 1, id_caracteristica: 1 },
          { id_baño: 1, id_caracteristica: 2 },
          { id_baño: 2, id_caracteristica: 1 },
          { id_baño: 2, id_caracteristica: 3 },
          { id_baño: 3, id_caracteristica: 1 },
          { id_baño: 5, id_caracteristica: 1 },
          { id_baño: 5, id_caracteristica: 2 },
          { id_baño: 5, id_caracteristica: 3 },
          { id_baño: 6, id_caracteristica: 2 },
          { id_baño: 7, id_caracteristica: 2 },
          { id_baño: 7, id_caracteristica: 5 },
          { id_baño: 8, id_caracteristica: 1 },
          { id_baño: 8, id_caracteristica: 4 },
          { id_baño: 13, id_caracteristica: 1 },
          { id_baño: 13, id_caracteristica: 3 },
        ],
        {},
      );
      console.log("✅ Datos de BAÑO_CARACTERISTICAS insertados correctamente.");
    } catch (error) {
      console.error(
        "\n❌ Error al insertar datos en la tabla BAÑO_CARACTERISTICAS:",
      );
      console.error(error);
      throw error;
    }

    try {
      await queryInterface.bulkInsert(
        "REPORTES",
        [
          {
            id_baño: 5,
            id_usuario: 1,
            tipo_reporte: "Permanentemente Cerrado",
            descripcion: "Intenté ir y el local está clausurado.",
            estado_reporte: "Pendiente",
            fecha_reporte: new Date(),
          },
          {
            id_baño: 9,
            id_usuario: 2,
            tipo_reporte: "Ubicación Incorrecta",
            descripcion:
              "El marcador está a dos calles de donde realmente está el Vips.",
            estado_reporte: "Pendiente",
            fecha_reporte: new Date(),
          },
          {
            id_baño: 3,
            id_usuario: 3,
            tipo_reporte: "Mantenimiento Urgente",
            descripcion: "Una de las puertas no cierra y no hay agua.",
            estado_reporte: "En_Revision",
            fecha_reporte: new Date(),
          },
          {
            id_baño: 2,
            id_usuario: 4,
            tipo_reporte: "Reseña Inapropiada",
            descripcion: "La reseña de JuanP contiene lenguaje ofensivo.",
            estado_reporte: "Pendiente",
            fecha_reporte: new Date(),
          },
          {
            id_baño: 1,
            id_usuario: 5,
            tipo_reporte: "Horario Incorrecto",
            descripcion:
              "Dice que cierran a las 8pm pero a las 7pm ya estaba cerrado.",
            estado_reporte: "Resuelto",
            fecha_reporte: new Date(),
          },
          {
            id_baño: 10,
            id_usuario: 6,
            tipo_reporte: "Dato Incorrecto",
            descripcion: "El costo es de 6 pesos, no de 5.",
            estado_reporte: "Pendiente",
            fecha_reporte: new Date(),
          },
          {
            id_baño: 12,
            id_usuario: 7,
            tipo_reporte: "Otro",
            descripcion:
              "Hay personas pidiendo dinero de forma agresiva en la entrada.",
            estado_reporte: "Pendiente",
            fecha_reporte: new Date(),
          },
        ],
        {},
      );
      console.log("✅ Datos de REPORTES insertados correctamente.");
    } catch (error) {
      console.error("\n❌ Error al insertar datos en la tabla REPORTES:");
      console.error(error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    // La función 'down' no necesita cambios, pero agregamos logs para consistencia
    console.log("\n reverting seed data...");
    await queryInterface.bulkDelete("REPORTES", null, {});
    await queryInterface.bulkDelete("BAÑO_CARACTERISTICAS", null, {});
    await queryInterface.bulkDelete("RESEÑAS", null, {});
    await queryInterface.bulkDelete("BAÑOS", null, {});
    await queryInterface.bulkDelete("CARACTERISTICAS", null, {});
    await queryInterface.bulkDelete("USUARIOS", null, {});
    console.log("✅ Seed data revertida correctamente.");
  },
};
