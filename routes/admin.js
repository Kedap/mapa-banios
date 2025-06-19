"use strict";
const express = require("express");
const router = express.Router();
const { Reporte } = require("../models"); // Importamos el modelo Reporte
const { checkAuth, isAdmin } = require("../middleware/authMiddleware");

// --- RUTA GET para obtener los reportes pendientes ---
router.get("/reportes", [checkAuth, isAdmin], async (req, res) => {
  try {
    const reportes = await Reporte.findAll({
      where: { estado_reporte: "Pendiente" },
      order: [["fecha_reporte", "ASC"]], // Mostrar los más antiguos primero
    });
    res.json(reportes);
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --- RUTA PUT para actualizar un reporte (marcar como "Resuelto") ---
// PUT /api/admin/reportes/:id
router.put("/reportes/:id", [checkAuth, isAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // El frontend enviará el nuevo estado

    const reporte = await Reporte.findByPk(id);
    if (!reporte) {
      return res.status(404).json({ error: "Reporte no encontrado." });
    }

    reporte.estado_reporte = estado || "Resuelto"; // Usamos el estado enviado o 'Resuelto' por defecto
    await reporte.save();

    res
      .status(200)
      .json({ message: "Reporte actualizado exitosamente", reporte });
  } catch (error) {
    console.error(`Error al actualizar el reporte ${req.params.id}:`, error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --- RUTA DELETE para eliminar un reporte (marcar como "Ignorado") ---
// DELETE /api/admin/reportes/:id
router.delete("/reportes/:id", [checkAuth, isAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const reporte = await Reporte.findByPk(id);

    if (!reporte) {
      return res.status(404).json({ error: "Reporte no encontrado." });
    }

    await reporte.destroy();

    // 204 No Content es la respuesta estándar para una eliminación exitosa
    res.status(204).send();
  } catch (error) {
    console.error(`Error al eliminar el reporte ${req.params.id}:`, error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
