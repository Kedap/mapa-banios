# 5. Flujo del Frontend

El frontend de "LocalizaBaño" está construido como una **Aplicación de Página Única (SPA)** utilizando HTML5, CSS3 y JavaScript "vanilla". Toda la interactividad y la actualización de contenido se gestionan dinámicamente sin necesidad de recargar la página. La librería **Leaflet.js** es el componente central para la visualización de mapas.

La interfaz se divide en dos componentes principales:

1.  **El Mapa Interactivo:** Ocupa la mayor parte de la pantalla y es el principal medio de exploración.
2.  **El Panel Lateral (Sidebar):** Muestra información contextual, detalles y formularios.

### Flujo 1: Carga Inicial y Visualización de Datos

Este es el flujo que experimenta un usuario al entrar por primera vez a la aplicación.

1.  **Carga de la Página (`index.html`):** El navegador carga la estructura base, el CSS y los scripts.
2.  **Inicialización de JavaScript (`script.js`):** Una vez que el DOM está listo, se ejecuta el script principal, que realiza las siguientes acciones:
    - **Inicia el Mapa:** La función `initMap()` crea una instancia de Leaflet en el `<div id="map">`, la centra en una ubicación predeterminada (Ciudad de México) y le añade la capa de mapa de OpenStreetMap.
    - **Petición a la API:** Simultáneamente, la función `loadAllBathrooms()` realiza una petición `GET` asíncrona a `/api/banios`.
3.  **Renderizado de Marcadores:**
    - Cuando el frontend recibe la respuesta JSON con la lista de baños, itera sobre cada elemento.
    - Para cada baño, extrae las coordenadas de su campo `ubicacion`.
    - Crea un marcador de Leaflet (`L.marker`) en esa ubicación y lo añade al mapa.
    - A cada marcador se le asigna un **evento `click`**.

### Flujo 2: Interacción con un Baño (Consulta de Detalles)

1.  **Acción del Usuario:** El usuario hace clic sobre un marcador de baño en el mapa.
2.  **Disparo del Evento:** El evento `click` asignado previamente se activa, llamando a la función `loadBathroomDetails(bañoId)`.
3.  **Petición de Detalles:** Esta función realiza una nueva petición `fetch` al backend, esta vez a la ruta `/api/banios/:id`, donde `:id` es el ID del baño seleccionado.
4.  **Actualización del Panel Lateral:**
    - El frontend recibe un único objeto JSON que contiene todos los detalles del baño, incluyendo arrays anidados con sus `Reseñas` y `Caracteristicas` (gracias a los `include` de Sequelize en el backend).
    - JavaScript construye dinámicamente un bloque de HTML con esta información.
    - El contenido del `<div id="sidebar-content">` se reemplaza por completo con este nuevo HTML, mostrando al usuario toda la información relevante.
    - Los formularios para añadir reseñas y reportes también se renderizan en este paso.

### Flujo 3: Creación de Contenido (Ejemplo: Añadir un Baño)

Este flujo describe el proceso de contribución del usuario.

1.  **Acción del Usuario:** El usuario hace clic en el botón "Añadir Nuevo Baño".
2.  **Renderizado del Formulario:** La función `renderAddBathroomForm()` es llamada.
    - Realiza una petición `GET /api/caracteristicas` para obtener la lista de características disponibles.
    - Usa esta lista para generar dinámicamente los checkboxes en el HTML del formulario.
    - Inyecta el formulario en el panel lateral.
    - Activa un **modo de selección en el mapa**, esperando un clic del usuario.
3.  **Selección de Ubicación:** El usuario hace clic en el mapa. El evento `handleMapClick...` captura las coordenadas (`latlng`), coloca un marcador temporal y desactiva el modo de selección.
4.  **Envío de Datos:** El usuario rellena los campos del formulario y hace clic en "Guardar Baño".
    - El evento `submit` del formulario es capturado por la función `handleFormSubmit`.
    - JavaScript recopila todos los datos del formulario, incluyendo las características seleccionadas y las coordenadas del marcador temporal.
    - Se construye un objeto JSON y se envía mediante una petición `POST` a `/api/banios`.
5.  **Feedback y Actualización Dinámica:**
    - Si la API responde con éxito (código 201), el frontend muestra un mensaje de "Éxito".
    - El marcador temporal se elimina.
    - Se crea un nuevo marcador permanente en la misma ubicación, utilizando los datos de la respuesta.
    - El panel lateral se limpia o muestra un mensaje de agradecimiento. **Todo esto sin recargar la página.**
