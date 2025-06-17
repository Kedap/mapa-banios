document.addEventListener("DOMContentLoaded", () => {
  const mapDiv = document.getElementById("map");
  const sidebarContent = document.getElementById("sidebar-content");
  const addBathroomBtn = document.getElementById("add-bathroom-btn");

  let map;
  const API_BASE_URL = "http://localhost:3000/api"; // La URL base de tu API

  /**
   * Función Principal que se ejecuta al inicio
   */
  function init() {
    console.log("🚀 Aplicación iniciada.");
    initMap();
    loadAllBathrooms();

    addBathroomBtn.addEventListener("click", () => {
      alert("Funcionalidad para añadir baño no implementada todavía.");
    });
  }

  /**
   * Inicializa el mapa Leaflet en el div 'map'
   */
  function initMap() {
    // Coordenadas iniciales [latitud, longitud] y nivel de zoom
    map = L.map(mapDiv).setView([19.4326, -99.1332], 13);

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

      baños.forEach((baño) => {
        // Leaflet usa [latitud, longitud], pero GeoJSON usa [longitud, latitud]
        const [longitude, latitude] = baño.ubicacion.coordinates;

        // Crea un marcador para cada baño
        const marker = L.marker([latitude, longitude]).addTo(map);

        marker.bindPopup(`<b>${baño.nombre}</b>`);

        // --- Evento de Clic ---
        marker.on("click", () => {
          loadBathroomDetails(baño.id_baño);
        });
      });
    } catch (error) {
      console.error("❌ Error al cargar los baños:", error);
      sidebarContent.innerHTML = `<p style="color: red;">No se pudieron cargar los datos del mapa. Asegúrate de que el servidor backend esté corriendo.</p>`;
    }
  }

  /**
   * Carga los detalles de un baño específico desde la API
   * y los muestra en el panel lateral.
   * @param {number} bañoId - El ID del baño a cargar.
   */
  async function loadBathroomDetails(bañoId) {
    try {
      sidebarContent.innerHTML = "<p>Cargando detalles...</p>"; // Muestra un estado de carga

      console.log(`ℹ️  Pidiendo detalles para el baño ID: ${bañoId}`);
      const response = await fetch(`${API_BASE_URL}/banios/${bañoId}`);

      if (!response.ok) {
        throw new Error(`Baño con ID ${bañoId} no encontrado.`);
      }

      const baño = await response.json();
      console.log("✔️  Detalles recibidos:", baño);

      const html = `
                <h3>${baño.nombre}</h3>
                <p><strong>Dirección:</strong> ${baño.direccion || "No especificada"}</p>
                <p><strong>Costo:</strong> $${parseFloat(baño.costo).toFixed(2)}</p>
                <p><strong>Estado:</strong> ${baño.estado}</p>
                
                <h4>Características:</h4>
                <ul class="caracteristicas-list">
                    ${
                      baño.Caracteristicas && baño.Caracteristicas.length > 0
                        ? baño.Caracteristicas.map(
                            (c) => `<li>✔️ ${c.nombre_caracteristica}</li>`,
                          ).join("")
                        : "<li>No hay características especificadas.</li>"
                    }
                </ul>

                <h4>Reseñas (${baño.Reseñas.length}):</h4>
                <ul class="reseñas-list">
                    ${
                      baño.Reseñas && baño.Reseñas.length > 0
                        ? baño.Reseñas.map(
                            (r) => `
                            <li>
                                <strong>${r.Usuario ? r.Usuario.nombre_usuario : "Anónimo"}</strong> 
                                <small>(${new Date(r.fecha_reseña).toLocaleDateString()})</small>
                                <p>Limpieza: ${"⭐".repeat(r.calificacion_limpieza)}${"☆".repeat(5 - r.calificacion_limpieza)}</p>
                                <p>Seguridad: ${"⭐".repeat(r.calificacion_seguridad)}${"☆".repeat(5 - r.calificacion_seguridad)}</p>
                                <p>${r.comentario || ""}</p>
                            </li>
                        `,
                          ).join("")
                        : "<li>Aún no hay reseñas para este lugar. ¡Sé el primero!</li>"
                    }
                </ul>
            `;

      // Reemplazamos el contenido del panel con el nuevo HTML
      sidebarContent.innerHTML = html;
    } catch (error) {
      console.error(
        `❌ Error al cargar los detalles del baño ${bañoId}:`,
        error,
      );
      sidebarContent.innerHTML = `<p style="color: red;">No se pudieron cargar los detalles de este baño.</p>`;
    }
  }

  init();
});
