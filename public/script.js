// --- Evento Principal: Espera a que el HTML esté completamente cargado ---
document.addEventListener("DOMContentLoaded", () => {
  // --- Referencias a Elementos del DOM que usaremos ---
  const mapDiv = document.getElementById("map");
  const sidebarContent = document.getElementById("sidebar-content");
  const addBathroomBtn = document.getElementById("add-bathroom-btn");

  // --- Variables Globales y Configuración ---
  let map; // Guardará la instancia del mapa Leaflet
  const API_BASE_URL = "http://localhost:3000/api"; // La URL base de tu API

  /**
   * Función Principal que se ejecuta al inicio
   */
  function init() {
    console.log("🚀 Aplicación iniciada.");
    initMap();
    loadAllBathrooms();

    // Asignar eventos a los botones principales
    addBathroomBtn.addEventListener("click", () => {
      // Por ahora, solo mostramos un mensaje.
      // Más adelante, esto mostrará el formulario para añadir un baño.
      alert("Funcionalidad para añadir baño no implementada todavía.");
    });
  }

  /**
   * Inicializa el mapa Leaflet en el div 'map'
   */
  function initMap() {
    // Coordenadas iniciales [latitud, longitud] y nivel de zoom
    map = L.map(mapDiv).setView([19.4326, -99.1332], 13);

    // Carga y añade la capa de mapa base de OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    console.log("🗺️ Mapa inicializado.");
  }

  /**
   * Obtiene todos los baños de la API y los añade como marcadores al mapa.
   */
  async function loadAllBathrooms() {
    try {
      console.log("📥 Obteniendo datos de los baños desde la API...");
      const response = await fetch(`${API_BASE_URL}/banios`);

      if (!response.ok) {
        throw new Error(
          `Error HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const baños = await response.json();
      console.log(`✔️  ${baños.length} baños cargados.`);

      // Limpiamos los marcadores existentes antes de añadir nuevos (buena práctica)
      // Por ahora no es necesario, pero lo será si implementamos filtros.

      baños.forEach((baño) => {
        // Leaflet usa [latitud, longitud], pero GeoJSON usa [longitud, latitud]
        const [longitude, latitude] = baño.ubicacion.coordinates;

        // Crea un marcador para cada baño
        const marker = L.marker([latitude, longitude]).addTo(map);

        // Añade un popup simple con el nombre del baño
        marker.bindPopup(`<b>${baño.nombre}</b>`);

        // --- Evento de Clic ---
        // Al hacer clic en un marcador, se cargarán sus detalles.
        marker.on("click", () => {
          // Por ahora, solo un log en consola para verificar que funciona
          console.log(`Clic en el baño con ID: ${baño.id_baño}`);
          // En el siguiente paso, implementaremos la función que muestra los detalles.
          // loadBathroomDetails(baño.id_baño);
        });
      });
    } catch (error) {
      console.error("❌ Error al cargar los baños:", error);
      sidebarContent.innerHTML = `<p style="color: red;">No se pudieron cargar los datos del mapa. Asegúrate de que el servidor backend esté corriendo.</p>`;
    }
  }

  // --- Inicia la aplicación ---
  init();
});
