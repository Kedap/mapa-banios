"use strict";
const express = require("express");
const router = express.Router();
const { Baño, Reseña, Caracteristica, Usuario } = require("../models");
const { Op } = require("sequelize");

// GET /api/banios
router.get("/", async (req, res) => {
  try {
    const baños = await Baño.findAll({
      attributes: ["id_baño", "nombre", "ubicacion", "costo", "estado"], // Solo traer los datos necesarios para el mapa
    });
    res.status(200).json(baños);
  } catch (error) {
    console.error("Error al obtener los baños:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /api/baños/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const baño = await Baño.findByPk(id, {
      // "include" es la magia de Sequelize para hacer JOINs automáticamente
      include: [
        {
          model: Reseña,
          as: "Reseñas",
          include: [
            {
              model: Usuario,
              attributes: ["nombre_usuario"],
            },
          ],
        },
        {
          model: Caracteristica,
          as: "Caracteristicas",
          through: { attributes: [] },
        },
      ],
    });

    if (!baño) {
      return res.status(404).json({ error: "Baño no encontrado" });
    }

    res.status(200).json(baño);
  } catch (error) {
    console.error(`Error al obtener el baño con id ${req.params.id}:`, error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { nombre, direccion, ubicacion, costo, estado, caracteristicas } =
      req.body;

    if (!nombre || !ubicacion) {
      return res
        .status(400)
        .json({ error: "El nombre y la ubicación son obligatorios." });
    }

    // 1. Crear el baño
    const nuevoBaño = await Baño.create({
      nombre,
      direccion,
      ubicacion,
      costo,
      estado,
    });

    // 2. Asociar las características (si se enviaron)
    // "setCaracteristicas" es un método mágico que Sequelize añade a nuestro modelo
    // gracias a la relación `belongsToMany` que definimos.
    if (caracteristicas && caracteristicas.length > 0) {
      await nuevoBaño.setCaracteristicas(caracteristicas);
    }

    const bañoCompleto = await Baño.findByPk(nuevoBaño.id_baño, {
      include: [{ model: Caracteristica }],
    });

    res.status(201).json(bañoCompleto);
  } catch (error) {
    console.error("Error al crear el baño:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
