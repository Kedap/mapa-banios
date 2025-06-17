"use strict";
const express = require("express");
const router = express.Router();
const { Reporte } = require("../models");

// POST /api/reportes
router.post("/", async (req, res) => {
  try {
    const { id_usuario, id_baño, tipo_reporte, descripcion } = req.body;

    if (!id_usuario || !id_baño || !tipo_reporte) {
      return res
        .status(400)
        .json({ error: "Faltan campos obligatorios para el reporte." });
    }

    const nuevoReporte = await Reporte.create(req.body);
    res.status(201).json(nuevoReporte);
  } catch (error) {
    console.error("Error al crear el reporte:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
