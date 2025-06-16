"use strict";
const express = require("express");
const router = express.Router();
const { Baño, Reseña, Caracteristica, Usuario } = require("../models"); // Importamos los modelos que necesitamos
const { Op } = require("sequelize"); // Importamos operadores para consultas más complejas

// --- RUTA 1: Obtener TODOS los baños (para mostrar en el mapa) ---
// GET /api/baños
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

// --- RUTA 2: Obtener UN baño específico con TODOS sus detalles ---
// GET /api/baños/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const baño = await Baño.findByPk(id, {
      // "include" es la magia de Sequelize para hacer JOINs automáticamente
      include: [
        {
          model: Reseña,
          as: "Reseñas", // Si definiste un alias en el modelo
          include: [
            {
              model: Usuario,
              attributes: ["nombre_usuario"], // No queremos enviar el hash de la contraseña
            },
          ],
        },
        {
          model: Caracteristica,
          as: "Caracteristicas",
          through: { attributes: [] }, // No incluir la tabla de unión en el resultado
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

module.exports = router;
