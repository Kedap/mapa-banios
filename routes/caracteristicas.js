"use strict";
const express = require("express");
const router = express.Router();
const { Caracteristica } = require("../models");

// GET /api/caracteristicas
router.get("/", async (req, res) => {
  try {
    const caracteristicas = await Caracteristica.findAll({
      order: [["nombre_caracteristica", "ASC"]],
    });
    res.status(200).json(caracteristicas);
  } catch (error) {
    console.error("Error al obtener las características:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
