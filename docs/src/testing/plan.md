# 7. Plan de Pruebas

Este documento establece la estrategia, el alcance y los procedimientos para verificar la calidad y el correcto funcionamiento de la aplicación "LocalizaBaño". El objetivo es asegurar que todos los requisitos funcionales se cumplen, identificar defectos y garantizar una experiencia de usuario intuitiva y robusta.

### 7.1. Objetivos de las Pruebas

- Validar que todas las funcionalidades descritas en los casos de uso (adaptados al modelo de contribución anónima) operan correctamente.
- Asegurar la integridad de los datos y la correcta interacción con la base de datos, especialmente la creación de usuarios "Just-in-Time".
- Verificar que la lógica de negocio de la API REST se ejecuta de manera precisa, devolviendo los códigos de estado y las respuestas JSON esperadas.
- Identificar y documentar cualquier defecto para su corrección.

### 7.2. Alcance de las Pruebas

#### Funcionalidades a Probar (En Alcance)

- **Módulo de Visualización:** Carga y visualización de baños en el mapa interactivo (Leaflet.js). Carga de detalles completos de un baño en el panel lateral.
- **Módulo de Contribución:**
  - Creación de nuevos baños, incluyendo la asociación de características.
  - Creación de nuevas reseñas para un baño, incluyendo la creación implícita de un usuario si el nombre no existe.
  - Creación de nuevos reportes sobre un baño.
- **Integridad de la API:** Pruebas directas a los endpoints de la API REST (`GET`, `POST`) para verificar las respuestas, los códigos de estado HTTP y el manejo de errores.

#### Funcionalidades Fuera de Alcance

- **Pruebas de Autenticación y Perfiles:** Dado que el sistema final no requiere registro de usuarios, estas pruebas no aplican.
- **Pruebas de Carga y Estrés:** No se simulará el acceso concurrente de un alto volumen de usuarios.
- **Pruebas de Seguridad Exhaustivas:** No se realizarán pruebas de penetración o análisis de vulnerabilidades avanzadas.
- **Compatibilidad con Navegadores Antiguos:** Las pruebas se centrarán en las últimas versiones de navegadores modernos (Google Chrome, Mozilla Firefox).

### 7.3. Tipos de Pruebas y Estrategia

Se empleará una estrategia de pruebas multinivel para cubrir diferentes aspectos del sistema:

- **Pruebas Unitarias:** Se enfocarán en funciones individuales del backend (Node.js), como la lógica de `findOrCreate` para usuarios o validadores de datos, para asegurar que operan correctamente de forma aislada.
- **Pruebas de Integración:** Se probará la comunicación entre los componentes principales: Frontend ↔ Backend (API) ↔ Base de Datos. El objetivo es asegurar que las peticiones `fetch` del frontend son manejadas correctamente por los endpoints de Express y que estos, a su vez, ejecutan las consultas adecuadas con Sequelize.
- **Pruebas de Sistema (End-to-End):** Se simularán los flujos de usuario completos, como buscar un baño, añadir una reseña con un nuevo nombre de usuario y verificar que tanto la reseña como el nuevo usuario se han creado correctamente en la base de datos.
- **Pruebas de Usabilidad (Aceptación del Usuario - UAT):** Se realizarán pruebas manuales desde la perspectiva del usuario final para evaluar si la interfaz es intuitiva y si el flujo de contribución es claro y sencillo.

### 7.4. Entorno de Pruebas

- **Backend:** Node.js (versión 18.x o superior).
- **Base de Datos:** MariaDB (versión 10.6 o superior) o PostgreSQL (versión 14 o superior) con PostGIS, ejecutándose en un contenedor de Docker.
- **Frontend:** Navegador web Google Chrome (última versión).
- **Herramientas de API:** Postman o Insomnia para pruebas directas de los endpoints de la API.
- **Base de Datos de Prueba:** Se utilizará una base de datos de desarrollo separada, poblada con el conjunto de datos del seeder para garantizar resultados consistentes.
