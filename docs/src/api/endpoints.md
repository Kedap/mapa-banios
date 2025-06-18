# 4. Documentación de la API REST

La API RESTful es el corazón de la lógica de negocio de "LocalizaBaño". Sirve como la interfaz de comunicación entre el frontend y la base de datos, exponiendo una serie de endpoints para realizar operaciones de creación, lectura, actualización y eliminación (CRUD) de datos.

La API está construida con **Node.js** y el framework **Express.js**. Todas las respuestas se devuelven en formato **JSON**.

**URL Base:** `http://localhost:3000/api`

### Endpoints de Baños (`/banios`)

Estos endpoints gestionan la entidad principal de la aplicación.

#### `GET /api/banios`

- **Descripción:** Obtiene una lista simplificada de todos los baños disponibles. Diseñado para poblar el mapa inicial con marcadores.
- **Parámetros:** Ninguno.
- **Respuesta Exitosa (200 OK):** Un array de objetos, donde cada objeto contiene:
  ```json
  [
    {
      "id_baño": 1,
      "nombre": "Baños del Parque Hundido",
      "ubicacion": {
        "type": "Point",
        "coordinates": [-99.1789, 19.3625]
      },
      "costo": "5.00",
      "estado": "Activo"
    },
    ...
  ]
  ```

#### `GET /api/banios/:id`

- **Descripción:** Obtiene los detalles completos de un único baño, incluyendo sus características y todas sus reseñas asociadas.
- **Parámetros de URL:**
  - `id`: El ID numérico del baño a consultar.
- **Respuesta Exitosa (200 OK):** Un único objeto JSON con toda la información.
  ```json
  {
    "id_baño": 1,
    "nombre": "Baños del Parque Hundido",
    "ubicacion": { ... },
    // ... otros campos del baño ...
    "Caracteristicas": [
      { "nombre_caracteristica": "Acceso para silla de ruedas", ... }
    ],
    "Reseñas": [
      {
        "id_reseña": 1,
        "calificacion_limpieza": 4,
        "comentario": "Muy limpio...",
        "Usuario": { "nombre_usuario": "AnaG" }
      },
      ...
    ]
  }
  ```

#### `POST /api/banios`

- **Descripción:** Crea un nuevo baño en la base de datos y le asocia las características seleccionadas.
- **Cuerpo de la Petición (Request Body):** Un objeto JSON con los siguientes campos.
  ```json
  {
    "nombre": "Cafetería El Buen Sabor",
    "direccion": "Calle Ficticia 456",
    "ubicacion": { "type": "Point", "coordinates": [-99.1, 19.4] },
    "costo": 0,
    "estado": "Activo",
    "caracteristicas": // Array de IDs de las características
  }
  ```
- **Respuesta Exitosa (201 Created):** Devuelve el objeto completo del baño recién creado.

### Endpoints de Reseñas (`/resenias`)

#### `POST /api/resenias`

- **Descripción:** Crea una nueva reseña para un baño específico. Implementa la lógica de usuario "Just-in-Time".
- **Cuerpo de la Petición (Request Body):** Un objeto JSON.
  ```json
  {
    "id_baño": 1,
    "nombre_usuario": "CarlosS",
    "calificacion_limpieza": 5,
    "calificacion_seguridad": 5,
    "comentario": "Excelente servicio, muy recomendable."
  }
  ```
- **Lógica Interna:** El backend buscará un usuario con `nombre_usuario: "CarlosS"`. Si no lo encuentra, lo creará automáticamente antes de guardar la reseña.
- **Respuesta Exitosa (201 Created):** Devuelve el objeto de la reseña recién creada.

### Endpoints de Reportes (`/reportes`)

#### `POST /api/reportes`

- **Descripción:** Crea un nuevo reporte sobre un problema en un baño.
- **Cuerpo de la Petición (Request Body):** Un objeto JSON.
  ```json
  {
    "id_baño": 5,
    "nombre_usuario": "LauraR",
    "tipo_reporte": "Permanentemente Cerrado",
    "descripcion": "El local está abandonado."
  }
  ```
- **Respuesta Exitosa (201 Created):** Devuelve el objeto del reporte recién creado.

### Endpoints de Soporte (`/caracteristicas`, `/usuarios`)

#### `GET /api/caracteristicas`

- **Descripción:** Obtiene una lista completa de todas las características disponibles en el sistema. Esencial para que el frontend pueda construir formularios y filtros dinámicamente.
- **Respuesta Exitosa (200 OK):** Un array de objetos de características.
  ```json
  [
    { "id_caracteristica": 1, "nombre_caracteristica": "Acceso para silla de ruedas", ... },
    { "id_caracteristica": 2, "nombre_caracteristica": "Gratuito", ... },
    ...
  ]
  ```

#### `GET /api/usuarios`

- **Descripción:** **(Solo para Desarrollo)** Obtiene una lista simplificada de usuarios. Se utiliza en el frontend para poblar un selector y simular que se es un usuario diferente al crear contenido, dado que no hay un sistema de login.
- **Respuesta Exitosa (200 OK):** Un array de objetos de usuario.
  ```json
  [
    { "id_usuario": 1, "nombre_usuario": "AnaG" },
    { "id_usuario": 2, "nombre_usuario": "CarlosS" },
    ...
  ]
  ```
