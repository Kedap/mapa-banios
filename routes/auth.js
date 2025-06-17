"use strict";
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");
const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  const { nombre_usuario, email, password } = req.body;
  if (!password)
    return res.status(400).json({ error: "La contraseña es requerida." });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = await Usuario.create({
      nombre_usuario,
      email,
      password_hash: hashedPassword,
    });
    res
      .status(201)
      .json({
        message: "Usuario creado exitosamente",
        usuario: {
          id: nuevoUsuario.id_usuario,
          nombre: nuevoUsuario.nombre_usuario,
        },
      });
  } catch (error) {
    res
      .status(400)
      .json({
        error:
          "No se pudo registrar el usuario. El email o nombre de usuario ya pueden estar en uso.",
      });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    const esValida = await bcrypt.compare(password, usuario.password_hash);
    if (!esValida) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    // Crear y firmar el token JWT
    const token = jwt.sign(
      { id: usuario.id_usuario, nombre: usuario.nombre_usuario },
      process.env.JWT_SECRET || "tu_secreto_por_defecto",
      { expiresIn: "8h" },
    );

    res.json({ message: "Login exitoso", token });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

module.exports = router;
