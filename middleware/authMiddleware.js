"use strict";
const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // Usamos 'rol' para ser consistentes
    req.userData = { userId: decodedToken.id, rol: decodedToken.rol };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Autenticación fallida." });
  }
};

const isAdmin = (req, res, next) => {
  // Comprobamos la propiedad 'rol'
  if (req.userData && req.userData.rol === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Acceso denegado. Se requiere rol de administrador." });
  }
};

module.exports = { checkAuth, isAdmin };
