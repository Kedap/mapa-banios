document.addEventListener("DOMContentLoaded", () => {
  const mapDiv = document.getElementById("map");
  const sidebarContent = document.getElementById("sidebar-content");
  const addBathroomBtn = document.getElementById("add-bathroom-btn");

  let map;
  let newBathroomLocation = null;
  let tempMarker = null;
  let allUsers = [];
  const API_BASE_URL = "http://localhost:3000/api"; // La URL base de tu API

  /**
   * Función Principal que se ejecuta al inicio
   */
  function init() {
    console.log("🚀 Aplicación iniciada.");
    initMap();
    loadAllBathrooms();
    loadAllUsers();

    addBathroomBtn.addEventListener("click", renderAddBathroomForm);

    console.log("Respuesta de la API para 'ubicacion':", bañoCreado.ubicacion);
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
      sidebarContent.innerHTML = "<p>Cargando detalles...</p>";
      const response = await fetch(`${API_BASE_URL}/banios/${bañoId}`);
      if (!response.ok) throw new Error(`Baño con ID ${bañoId} no encontrado.`);
      const baño = await response.json();

      const html = `
            <h3>${baño.nombre}</h3>
            <p><strong>Dirección:</strong> ${baño.direccion || "No especificada"}</p>
            <p><strong>Costo:</strong> $${parseFloat(baño.costo).toFixed(2)}</p>
            <p><strong>Estado:</strong> ${baño.estado}</p>
            
            <h4>Características:</h4>
            <ul class="caracteristicas-list">
                ${baño.Caracteristicas.length > 0 ? baño.Caracteristicas.map((c) => `<li>✔️ ${c.nombre_caracteristica}</li>`).join("") : "<li>No hay características especificadas.</li>"}
            </ul>

            <h4>Reseñas (${baño.Reseñas.length}):</h4>
            <ul class="reseñas-list">
                ${
                  baño.Reseñas.length > 0
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
                    : "<li>Aún no hay reseñas para este lugar.</li>"
                }
            </ul>
            
            <hr>
            <h4>Deja tu Reseña</h4>
            <form id="add-review-form">
                 <!-- ... (Tu formulario de reseña existente va aquí) ... -->
                <label for="review-user">Soy el usuario:</label>
                <select id="review-user" name="id_usuario" required>
                    ${allUsers.map((user) => `<option value="${user.id_usuario}">${user.nombre_usuario}</option>`).join("")}
                </select>
                <label>Limpieza:</label>
                <div>${[1, 2, 3, 4, 5].map((n) => `<span>${n}⭐</span> <input type="radio" name="calificacion_limpieza" value="${n}" required>`).join(" ")}</div>
                <label>Seguridad:</label>
                <div>${[1, 2, 3, 4, 5].map((n) => `<span>${n}⭐</span> <input type="radio" name="calificacion_seguridad" value="${n}" required>`).join(" ")}</div>
                <label for="review-comment">Comentario:</label>
                <textarea id="review-comment" name="comentario" rows="3"></textarea>
                <button type="submit">Enviar Reseña</button>
            </form>

            <hr>
            <!-- ¡NUEVO FORMULARIO PARA REPORTAR UN PROBLEMA! -->
            <h4>Reportar un Problema</h4>
            <form id="add-report-form">
                <label for="report-user">Soy el usuario:</label>
                <select id="report-user" name="id_usuario" required>
                    ${allUsers.map((user) => `<option value="${user.id_usuario}">${user.nombre_usuario}</option>`).join("")}
                </select>

                <label for="report-type">Tipo de Problema:</label>
                <select id="report-type" name="tipo_reporte" required>
                    <option value="Ubicación Incorrecta">Ubicación Incorrecta</option>
                    <option value="Permanentemente Cerrado">Permanentemente Cerrado</option>
                    <option value="Horario Incorrecto">Horario Incorrecto</option>
                    <option value="Mantenimiento Urgente">Mantenimiento Urgente</option>
                    <option value="Otro">Otro</option>
                </select>

                <label for="report-description">Descripción (opcional):</label>
                <textarea id="report-description" name="descripcion" rows="3"></textarea>
                
                <button type="submit">Enviar Reporte</button>
            </form>
        `;

      sidebarContent.innerHTML = html;

      // Añadimos los listeners a AMBOS formularios
      document
        .getElementById("add-review-form")
        .addEventListener("submit", (e) => handleAddReviewSubmit(e, bañoId));
      document
        .getElementById("add-report-form")
        .addEventListener("submit", (e) => handleAddReportSubmit(e, bañoId));
    } catch (error) {
      console.error(
        `❌ Error al cargar los detalles del baño ${bañoId}:`,
        error,
      );
      sidebarContent.innerHTML = `<p style="color: red;">No se pudieron cargar los detalles de este baño.</p>`;
    }
  }

  /**
   * Renderiza el formulario para añadir un nuevo baño en el panel lateral.
   */
  async function renderAddBathroomForm() {
    try {
      console.log("📝 Renderizando formulario para añadir baño...");
      // 1. Obtener la lista de características para los checkboxes
      const response = await fetch(`${API_BASE_URL}/caracteristicas`);
      if (!response.ok)
        throw new Error("No se pudieron cargar las características.");
      const caracteristicas = await response.json();

      // 2. Construir el HTML del formulario
      const formHtml = `
                <h3>Añadir un Nuevo Baño</h3>
                <form id="add-bathroom-form">
                    <p><strong>Paso 1:</strong> Haz clic en el mapa para establecer la ubicación.</p>
                    
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" required>
                    
                    <label for="direccion">Dirección:</label>
                    <textarea id="direccion" name="direccion"></textarea>
                    
                    <label for="costo">Costo:</label>
                    <input type="number" id="costo" name="costo" min="0" step="0.50" value="0.00" required>
                    
                    <label for="estado">Estado:</label>
                    <select id="estado" name="estado">
                        <option value="Activo">Activo</option>
                        <option value="Fuera_de_Servicio">Fuera de Servicio</option>
                        <option value="Bajo_Revisión">Bajo Revisión</option>
                    </select>

                    <h4>Características:</h4>
                    <div id="caracteristicas-checkboxes">
                        ${caracteristicas
                          .map(
                            (c) => `
                            <div>
                                <input type="checkbox" id="carac-${c.id_caracteristica}" name="caracteristicas" value="${c.id_caracteristica}">
                                <label for="carac-${c.id_caracteristica}">${c.nombre_caracteristica}</label>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                    
                    <button type="submit">Guardar Baño</button>
                    <button type="button" id="cancel-btn">Cancelar</button>
                </form>
            `;

      // 3. Inyectar el formulario en el panel lateral
      sidebarContent.innerHTML = formHtml;

      // 4. Añadir listeners a los nuevos elementos del formulario
      document
        .getElementById("add-bathroom-form")
        .addEventListener("submit", handleFormSubmit);
      document.getElementById("cancel-btn").addEventListener("click", () => {
        // Simplemente recargamos la info del sidebar para limpiarlo
        sidebarContent.innerHTML =
          "<h2>Bienvenido a LocalizaBaño</h2><p>Haz clic en un marcador para ver los detalles.</p>";
        if (tempMarker) map.removeLayer(tempMarker); // Quita el marcador temporal
      });

      // 5. Activar el modo de "selección en mapa"
      map.on("click", handleMapClickForNewBathroom);
      sidebarContent.querySelector("p").style.fontWeight = "bold"; // Resalta la instrucción
    } catch (error) {
      console.error("❌ Error al renderizar el formulario:", error);
      sidebarContent.innerHTML = `<p style="color: red;">No se pudo cargar el formulario.</p>`;
    }
  }

  /**
   * Maneja el clic en el mapa para establecer la ubicación de un nuevo baño.
   * @param {L.LeafletMouseEvent} e - El objeto del evento de clic.
   */
  function handleMapClickForNewBathroom(e) {
    // Si ya hay un marcador temporal, lo quitamos
    if (tempMarker) {
      map.removeLayer(tempMarker);
    }

    // Guardamos las coordenadas
    newBathroomLocation = e.latlng;

    // Creamos un nuevo marcador temporal y lo añadimos al mapa
    tempMarker = L.marker(newBathroomLocation, {
      draggable: true, // Permite arrastrarlo para ajustar
      title: "Ubicación del nuevo baño",
    }).addTo(map);

    console.log(`📍 Nueva ubicación seleccionada: ${newBathroomLocation}`);

    // Una vez que se ha hecho clic, desactivamos el evento para no seguir poniendo marcadores
    map.off("click", handleMapClickForNewBathroom);
    sidebarContent.querySelector("p").innerHTML =
      "<strong>Paso 2:</strong> Rellena los datos y guarda.";
  }

  /**
   * Maneja el envío del formulario para crear un nuevo baño.
   * @param {Event} e - El objeto del evento de envío.
   */
  async function handleFormSubmit(e) {
    e.preventDefault(); // Evita que la página se recargue

    if (!newBathroomLocation) {
      alert("Por favor, selecciona una ubicación en el mapa haciendo clic.");
      return;
    }

    const form = e.target;
    const formData = new FormData(form);
    const caracteristicasSeleccionadas = [];
    document
      .querySelectorAll('input[name="caracteristicas"]:checked')
      .forEach((checkbox) => {
        caracteristicasSeleccionadas.push(checkbox.value);
      });

    // Construimos el objeto que la API espera
    const nuevoBañoData = {
      nombre: formData.get("nombre"),
      direccion: formData.get("direccion"),
      costo: parseFloat(formData.get("costo")),
      estado: formData.get("estado"),
      // Convertimos al formato GeoJSON que la API espera
      ubicacion: {
        type: "Point",
        coordinates: [newBathroomLocation.lng, newBathroomLocation.lat],
      },
      caracteristicas: caracteristicasSeleccionadas,
    };

    console.log("📤 Enviando nuevo baño a la API:", nuevoBañoData);

    try {
      const response = await fetch(`${API_BASE_URL}/banios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoBañoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al guardar el baño.");
      }

      const bañoCreado = await response.json();
      console.log("✔️ Baño creado exitosamente:", bañoCreado);

      alert("¡Baño añadido con éxito!");

      // Limpieza
      if (tempMarker) map.removeLayer(tempMarker);
      sidebarContent.innerHTML = "<h2>¡Gracias por contribuir!</h2>";

      // Añadimos el nuevo marcador al mapa dinámicamente
      // (Reutilizamos la lógica del `loadAllBathrooms`)
      const marker = L.marker(newBathroomLocation).addTo(map); // Usamos newBathroomLocation directamente

      marker.bindPopup(`<b>${bañoCreado.nombre}</b>`);
      marker.on("click", () => loadBathroomDetails(bañoCreado.id_baño));

      // Limpiamos la variable para el próximo uso
      newBathroomLocation = null;
      tempMarker = null;
    } catch (error) {
      console.error("❌ Error al enviar el formulario:", error);
      alert(`Error: ${error.message}`);
    }
  }

  async function loadAllUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`);
      if (!response.ok) throw new Error("No se pudieron cargar los usuarios.");
      allUsers = await response.json();
      console.log(
        `✔️  ${allUsers.length} usuarios cargados para los selectores.`,
      );
    } catch (error) {
      console.error("❌ Error al cargar usuarios:", error);
    }
  }

  /**
   * Maneja el envío del formulario para crear una nueva reseña.
   * @param {Event} e - El objeto del evento de envío.
   * @param {number} bañoId - El ID del baño al que pertenece la reseña.
   */
  async function handleAddReviewSubmit(e, bañoId) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const reviewData = {
      id_baño: bañoId,
      id_usuario: formData.get("id_usuario"),
      calificacion_limpieza: formData.get("calificacion_limpieza"),
      calificacion_seguridad: formData.get("calificacion_seguridad"),
      comentario: formData.get("comentario"),
    };

    console.log("📤 Enviando nueva reseña:", reviewData);

    try {
      const response = await fetch(`${API_BASE_URL}/resenias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al guardar la reseña.");
      }

      console.log("✔️ Reseña creada exitosamente.");
      alert("¡Gracias por tu reseña!");

      // Refrescamos los detalles del baño para mostrar la nueva reseña
      loadBathroomDetails(bañoId);
    } catch (error) {
      console.error("❌ Error al enviar la reseña:", error);
      alert(`Error: ${error.message}`);
    }
  }

  /**
   * Maneja el envío del formulario para crear un nuevo reporte.
   * @param {Event} e - El objeto del evento de envío.
   * @param {number} bañoId - El ID del baño que está siendo reportado.
   */
  async function handleAddReportSubmit(e, bañoId) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const reportData = {
      id_baño: bañoId,
      id_usuario: formData.get("id_usuario"),
      tipo_reporte: formData.get("tipo_reporte"),
      descripcion: formData.get("descripcion"),
    };

    console.log("📤 Enviando nuevo reporte:", reportData);

    try {
      const response = await fetch(`${API_BASE_URL}/reportes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al enviar el reporte.");
      }

      console.log("✔️ Reporte enviado exitosamente.");
      alert("¡Gracias por tu reporte! Un administrador lo revisará pronto.");

      // Ocultamos el formulario después de enviarlo para dar feedback visual.
      form.innerHTML =
        "<p><strong>Reporte enviado. ¡Gracias por ayudar a mantener la comunidad actualizada!</strong></p>";
    } catch (error) {
      console.error("❌ Error al enviar el reporte:", error);
      alert(`Error: ${error.message}`);
    }
  }

  init();
});
