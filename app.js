"use strict";
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Permite peticiones de otros orígenes
app.use(express.json());
app.use(express.static("public"));

const bañosRoutes = require("./routes/baños");
const reseñasRoutes = require("./routes/reseñas");
const authRoutes = require("./routes/auth");
const caractersticasRoutes = require("./routes/caracteristicas");
const reportesRoutes = require("./routes/reportes");
const usuariosRoutes = require("./routes/usuarios");

app.use("/api/banios", bañosRoutes);
app.use("/api/resenias", reseñasRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/caracteristicas", caractersticasRoutes);
app.use("/api/reportes", reportesRoutes);
app.use("/api/usuarios", usuariosRoutes);

app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida exitosamente.");

    // --- ¡INICIO DEL CÓDIGO DE DEPURACIÓN! ---
    // Vamos a inspeccionar la asociación entre Baño y Caracteristica.
    // El nombre de la asociación suele ser el plural del modelo de destino.
    if (sequelize.models.Baño.associations.Caracteristicas) {
      console.log("\n\n--- INSPECCIÓN DE LA ASOCIACIÓN ---");
      console.log(
        "Opciones de la tabla 'through' para la asociación Baño -> Caracteristicas:",
      );
      console.log(
        sequelize.models.Baño.associations.Caracteristicas.through.options,
      );
      console.log("--- FIN DE LA INSPECCIÓN ---\n\n");
    } else {
      console.log("\n\n--- ERROR DE DEPURACIÓN ---");
      console.log(
        "No se encontró la asociación 'Caracteristicas' en el modelo Baño.",
      );
      console.log("--- FIN DEL ERROR DE DEPURACIÓN ---\n\n");
    }
    // --- FIN DEL CÓDIGO DE DEPURACIÓN ---
  } catch (error) {
    console.error("❌ No se pudo conectar a la base de datos:", error);
  }
});
