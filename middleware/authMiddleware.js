"use strict";
const jwt = require("jsonwebtoken");

/**
 * Middleware para verificar si la petición tiene un token JWT válido.
 */
const checkAuth = (req, res, next) => {
  try {
    // El token se envía en el formato "Bearer TOKEN_AQUI"
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "un_secreto_por_defecto_muy_seguro",
    );
    req.userData = { userId: decodedToken.id, rol: decodedToken.rol }; // Añade los datos del usuario a la petición
    next(); // Si el token es válido, continúa a la siguiente función
  } catch (error) {
    return res
      .status(401)
      .json({
        message: "Autenticación fallida. Token inválido o no proporcionado.",
      });
  }
};

/**
 * Middleware para verificar si el usuario autenticado tiene el rol de 'admin'.
 * DEBE usarse DESPUÉS de checkAuth.
 */
const isAdmin = (req, res, next) => {
  if (req.userData && req.userData.rol === "admin") {
    next(); // Si es admin, continúa
  } else {
    return res
      .status(403)
      .json({ message: "Acceso denegado. Se requiere rol de administrador." });
  }
};

module.exports = { checkAuth, isAdmin };
