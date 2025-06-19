"use strict";
const express = require("express");
const router = express.Router();
const { Reporte } = require("../models");
const { checkAuth, isAdmin } = require("../middleware/authMiddleware");

// Usamos el middleware ANTES de la lógica de la ruta.
// El usuario debe estar autenticado Y ser admin para acceder a esta ruta.
router.get("/reportes", [checkAuth, isAdmin], async (req, res) => {
  try {
    const reportes = await Reporte.findAll({
      where: { estado_reporte: "Pendiente" },
    });
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener reportes" });
  }
});

// ... aquí podrías añadir más rutas DELETE o PUT para moderar ...

module.exports = router;
