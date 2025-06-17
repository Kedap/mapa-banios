"use strict";
const express = require("express");
const router = express.Router();
const { Usuario } = require("../models");

// GET /api/usuarios
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ["id_usuario", "nombre_usuario"],
    });
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
