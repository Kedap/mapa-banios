"use strict";
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");
const router = express.Router();

/**
 * RUTA: POST /api/auth/login
 * Propósito: Autenticar a un usuario y, si es administrador, devolver un token JWT.
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar al usuario por su email
    const usuario = await Usuario.findOne({ where: { email: email } });
    if (!usuario) {
      // Usar un mensaje genérico por seguridad
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    // 2. Comparar la contraseña enviada con el hash guardado
    const esPasswordValido = await bcrypt.compare(
      password,
      usuario.password_hash,
    );
    if (!esPasswordValido) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    // 3. ¡Verificación Crítica! Asegurarse de que el usuario tiene el rol de administrador.
    if (usuario.rol !== "admin") {
      return res
        .status(403)
        .json({ error: "Acceso denegado. No eres administrador." });
    }

    // 4. Si todo es correcto, crear y firmar el token JWT
    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        nombre: usuario.nombre_usuario,
        rol: usuario.rol, // Incluir el rol es fundamental
      },
      process.env.JWT_SECRET || "un_secreto_por_defecto_muy_seguro", // ¡Usa la variable de entorno!
      { expiresIn: "8h" }, // El token expira en 8 horas
    );

    res.status(200).json({ message: "Login exitoso", token: token });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

module.exports = router;
