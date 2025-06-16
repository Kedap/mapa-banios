"use strict";
require("dotenv").config(); // Carga las variables de .env al inicio

const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models"); // Importamos la instancia de Sequelize

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors()); // Permite peticiones de otros orígenes
app.use(express.json()); // Permite al servidor entender peticiones con cuerpo en formato JSON
app.use(express.static("public")); // Sirve los archivos estáticos del frontend

// --- Rutas de la API ---
const bañosRoutes = require("./routes/baños");
app.use("/api/banios", bañosRoutes); // Todas las rutas en baños.js estarán prefijadas con /api/baños

// --- Conexión a la BD y Arranque del Servidor ---
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  try {
    // Autentica la conexión con la base de datos
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida exitosamente.");
  } catch (error) {
    console.error("❌ No se pudo conectar a la base de datos:", error);
  }
});
