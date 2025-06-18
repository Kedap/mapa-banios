"use strict";
require("dotenv").config(); // Carga las variables de .env al inicio

const express = require("express");
const cors = require("cors");
const path = require("path"); // <-- ¡LA SOLUCIÓN! Importar el módulo 'path'
const { sequelize } = require("./models"); // Importamos la instancia de Sequelize

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Sirve el frontend principal

// Sirve el manual técnico desde la carpeta docs/book en la ruta /docs
app.use("/docs", express.static(path.join(__dirname, "docs/book")));

// --- Rutas de la API ---
const bañosRoutes = require("./routes/baños");
const reseñasRoutes = require("./routes/reseñas");
// ... y tus otras rutas

app.use("/api/banios", bañosRoutes);
app.use("/api/resenias", reseñasRoutes);
// ... y tus otros app.use para las rutas

// --- Conexión a la BD y Arranque del Servidor ---
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida exitosamente.");
  } catch (error) {
    console.error("❌ No se pudo conectar a la base de datos:", error);
  }
});
