"use strict";
const axios = require("axios");

// --- Configuración ---
const API_BASE_URL = "http://localhost:3000/api";
const NUM_BAÑOS_A_CREAR = 15; // Añadirá 15 baños además de los que ya tienes
const NUM_RESEÑAS_POR_BAÑO = 2; // Añadirá 2 reseñas a CADA baño (nuevos y existentes)
const NUM_REPORTES_TOTALES = 10; // Añadirá 10 reportes aleatorios

// --- Datos de Ejemplo ---
const nombresBaños = [
  "El Descanso Feliz",
  "Sanitario La Esquina",
  "Baños El Oasis",
  "Servicios El Trébol",
  "El Rincón Limpio",
  "Estación Sanitaria",
  "Punto de Alivio",
  "La Parada Esencial",
  "El Refugio del Viajero",
  "Baños La Central",
];
const nombresUsuarios = [
  "Laura G.",
  "Carlos M.",
  "Sofia P.",
  "David R.",
  "Ana V.",
  "Miguel S.",
  "Elena C.",
  "Juan D.",
  "Maria L.",
  "Pedro F.",
];
const comentariosReseñas = [
  "Justo lo que necesitaba.",
  "Podría estar más limpio.",
  "Excelente servicio, muy rápido.",
  "No había papel, pero por lo demás bien.",
  "Un poco caro para lo que es.",
  "Muy seguro y bien iluminado.",
  "Lo recomiendo totalmente.",
  "Me sacó de un apuro.",
  "El personal es muy amable.",
  "Volvería a usarlo.",
];
const tiposReportes = [
  "Ubicación Incorrecta",
  "Permanentemente Cerrado",
  "Horario Incorrecto",
  "Mantenimiento Urgente",
  "Dato Incorrecto",
];

// --- Funciones Helper ---

/**
 * Obtiene un elemento aleatorio de un array.
 * @param {Array<any>} arr
 */
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Genera coordenadas aleatorias cerca de un punto central.
 */
const getRandomCoordinates = () => ({
  type: "Point",
  coordinates: [
    -99.1332 + (Math.random() - 0.5) * 0.2, // Longitud (CDMX Centro)
    19.4326 + (Math.random() - 0.5) * 0.2, // Latitud (CDMX Centro)
  ],
});

/**
 * Obtiene un número específico de características únicas de forma aleatoria.
 * @param {Array<number>} ids - El array de todos los IDs de características.
 * @param {number} count - El número de IDs únicos que se quieren obtener.
 * @returns {Array<number>} Un array con IDs únicos.
 */
function getRandomUniqueCaracteristicas(ids, count) {
  const uniqueIds = new Set();
  // Bucle para asegurar que obtenemos el número deseado de IDs únicos
  while (uniqueIds.size < count && uniqueIds.size < ids.length) {
    uniqueIds.add(getRandom(ids));
  }
  return Array.from(uniqueIds); // Convertimos el Set de nuevo a un Array
}

/**
 * Crea un retraso para no saturar la API.
 * @param {number} ms - Milisegundos a esperar.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Lógica Principal del Script ---

async function poblarBaseDeDatos() {
  try {
    console.log(
      "🚀 Iniciando script de poblado de la base de datos vía API...",
    );

    // 1. OBTENER DATOS EXISTENTES PARA LAS RELACIONES
    console.log("Obteniendo características existentes...");
    const { data: caracteristicas } = await axios.get(
      `${API_BASE_URL}/caracteristicas`,
    );
    if (!caracteristicas || caracteristicas.length === 0) {
      throw new Error(
        "No se encontraron características. Ejecuta primero los seeders básicos.",
      );
    }
    const caracteristicasIds = caracteristicas.map((c) => c.id_caracteristica);

    // 2. CREAR NUEVOS BAÑOS
    console.log(`\nCreando ${NUM_BAÑOS_A_CREAR} nuevos baños...`);
    for (let i = 0; i < NUM_BAÑOS_A_CREAR; i++) {
      // Usamos la función helper para garantizar características únicas
      const randomCaracteristicas = getRandomUniqueCaracteristicas(
        caracteristicasIds,
        2,
      );

      const bañoData = {
        nombre: `${getRandom(nombresBaños)} #${i + 1}`,
        direccion: `Calle Ficticia ${Math.floor(Math.random() * 1000)}`,
        ubicacion: getRandomCoordinates(),
        costo: (Math.random() * 15).toFixed(2),
        estado: "Activo",
        caracteristicas: randomCaracteristicas,
      };

      const { data: nuevoBaño } = await axios.post(
        `${API_BASE_URL}/banios`,
        bañoData,
      );
      console.log(
        `✔️  Baño creado: ${nuevoBaño.nombre} (ID: ${nuevoBaño.id_baño})`,
      );
      await sleep(50); // Pequeña pausa para no sobrecargar el servidor
    }

    // 3. OBTENER LISTA COMPLETA DE BAÑOS (INCLUYENDO LOS DEL SEEDER ORIGINAL Y LOS NUEVOS)
    console.log(
      "\nObteniendo la lista completa de baños para crear reseñas y reportes...",
    );
    const { data: todosLosBaños } = await axios.get(`${API_BASE_URL}/banios`);
    const todosLosBañosIds = todosLosBaños.map((b) => b.id_baño);

    // 4. CREAR NUEVAS RESEÑAS
    console.log(
      `\nCreando ${NUM_RESEÑAS_POR_BAÑO} reseñas para cada uno de los ${todosLosBañosIds.length} baños...`,
    );
    for (const bañoId of todosLosBañosIds) {
      for (let i = 0; i < NUM_RESEÑAS_POR_BAÑO; i++) {
        const reseñaData = {
          id_baño: bañoId,
          nombre_usuario: getRandom(nombresUsuarios),
          calificacion_limpieza: Math.floor(Math.random() * 5) + 1,
          calificacion_seguridad: Math.floor(Math.random() * 5) + 1,
          comentario: getRandom(comentariosReseñas),
        };
        await axios.post(`${API_BASE_URL}/resenias`, reseñaData);
        console.log(`✔️  Reseña creada para el baño ID: ${bañoId}`);
        await sleep(50);
      }
    }

    // 5. CREAR NUEVOS REPORTES
    console.log(`\nCreando ${NUM_REPORTES_TOTALES} reportes aleatorios...`);
    for (let i = 0; i < NUM_REPORTES_TOTALES; i++) {
      const reporteData = {
        id_baño: getRandom(todosLosBañosIds),
        nombre_usuario: getRandom(nombresUsuarios),
        tipo_reporte: getRandom(tiposReportes),
        descripcion: "Este es un reporte de prueba generado por el script.",
      };
      await axios.post(`${API_BASE_URL}/reportes`, reporteData);
      console.log(`✔️  Reporte creado para el baño ID: ${reporteData.id_baño}`);
      await sleep(50);
    }

    console.log("\n\n✅ ¡Proceso de poblado completado exitosamente!");
  } catch (error) {
    console.error("\n\n❌ ERROR DURANTE EL SCRIPT DE POBLADO:");
    if (error.response) {
      // El error vino de una respuesta de la API (ej. 400, 500)
      console.error(`Status: ${error.response.status}`);
      console.error("Data:", error.response.data);
    } else {
      // El error ocurrió antes de la petición (ej. problema de red)
      console.error(error.message);
    }
  }
}

// Ejecutar la función principal del script
poblarBaseDeDatos();
