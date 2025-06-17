"use strict";
const express = require("express");
const router = express.Router();
const { Reseña, Usuario } = require("../models");

// GET /api/resenias
router.get("/", async (req, res) => {
  try {
    const reseñas = await Reseña.findAll({
      include: [
        {
          model: Usuario,
          attributes: ["nombre_usuario"],
        },
      ],
      order: [["fecha_reseña", "DESC"]],
    });
    res.status(200).json(reseñas);
  } catch (error) {
    console.error("Error al obtener las reseñas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /api/resenias
router.post("/", async (req, res) => {
  try {
    const {
      id_usuario,
      id_baño,
      calificacion_limpieza,
      calificacion_seguridad,
      comentario,
    } = req.body;

    if (
      !id_usuario ||
      !id_baño ||
      !calificacion_limpieza ||
      !calificacion_seguridad
    ) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    const nuevaReseña = await Reseña.create({
      id_usuario,
      id_baño,
      calificacion_limpieza,
      calificacion_seguridad,
      comentario,
    });

    res.status(201).json(nuevaReseña); // 201 Created
  } catch (error) {
    console.error("Error al crear la reseña:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
