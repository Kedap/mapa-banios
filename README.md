# LocalizaBaño: Mapa de Baños Públicos

![Badge de Licencia Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)

![Página web](https://mapa.rompevientos.duckdns.org/)

## Descripción

LocalizaBaño es un proyecto de aplicación web que permite a los usuarios
encontrar, añadir, reseñar y reportar baños públicos en un mapa interactivo. La
aplicación está diseñada para ser una herramienta útil para la comunidad,
facilitando la ubicación y evaluación de instalaciones sanitarias públicas.
Utiliza una base de datos geoespacial para almacenar la información de los
baños y sus ubicaciones.

## Características

- **Visualización de Mapas:** Muestra los baños públicos en un mapa
  interactivo basado en Leaflet.
- **Añadir Baños:** Permite a los usuarios añadir nuevos baños al mapa,
  especificando su nombre, dirección, costo, estado y características.
- **Detalles del Baño:** Al hacer clic en un marcador, se muestran detalles
  como dirección, costo, estado, características y reseñas.
- **Sistema de Reseñas:** Los usuarios pueden dejar reseñas sobre la limpieza
  y seguridad de los baños, así como añadir comentarios.
- **Reporte de Problemas:** Funcionalidad para reportar problemas con los
  baños (ej. ubicación incorrecta, cerrado permanentemente, mantenimiento
  urgente).
- **Gestión de Usuarios:** Soporte para usuarios y roles (implícito a través
  de la funcionalidad de reseñas y reportes).
- **API RESTful:** Backend robusto para la gestión de datos.
- **Documentación Interactiva:** Incluye un sistema de documentación generada
  a partir de Markdown.

## Tecnologías Utilizadas

### Frontend

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla JS)**
- **Leaflet.js:** Biblioteca JavaScript de código abierto para mapas interactivos.

### Backend

- **Node.js**
- **Express.js:** Framework web para Node.js.
- **Sequelize:** ORM (Object-Relational Mapper) para Node.js, compatible con
  diversas bases de datos.
- **Dotenv:** Para la gestión de variables de entorno.
- **JSON Web Tokens (jsonwebtoken):** Para autenticación (posiblemente para
  el panel de administración).

### Base de Datos

Se puede elegir entre la base de datos PostgreSQL y MariaDB

- **PostgreSQL:** Sistema de gestión de bases de datos relacional.
- **PostGIS:** Extensión de PostgreSQL que añade soporte para objetos
  geográficos, permitiendo consultas espaciales.
- **MariaDB:** Base de datos relacional de código abierto (opcional para
  pruebas).

### Herramientas de Desarrollo y Contenedorización

- **Docker:** Para la creación y gestión de contenedores.
- **Docker Compose:** Para definir y ejecutar aplicaciones Docker multi-contenedor.
- **Nodemon:** Para el reinicio automático del servidor durante el desarrollo.
- **Sequelize-CLI:** Herramienta de línea de comandos para manejar migraciones y seeders de Sequelize.
- **mdBook:** Herramienta de línea de comandos para crear libros a partir de Markdown.

## Primeros Pasos

Sigue estas instrucciones para poner en marcha el proyecto en tu máquina local.

### Prerrequisitos

Asegúrate de tener instalado:

- **Docker**
- **Docker Compose**

### Variables de Entorno

Este proyecto utiliza variables de entorno. Crea un archivo `.env` en la raíz del proyecto, basándote en `.env.example`.

Ejemplo de `.env`:

```
PORT=3000
DB_HOST=postgres_db
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=localizabaño
DB_DIALECT=postgres
SECRET_JWT=tu_secreto_jwt_aqui
```

**Nota:** Para `DB_HOST`, usa el nombre del servicio de la base de datos definido en `docker-compose.yml` (e.g., `postgres_db`).

### Ejecución con Docker Compose

La forma más sencilla de levantar el proyecto es usando Docker Compose:

1.  **Clona el repositorio:**

    ```bash
    git clone https://github.com/Kedap/mapa-banios.git
    cd mapa-banios
    ```

2.  **Crea el archivo `.env`** (como se mencionó en la sección anterior).

3.  **Levanta los servicios de Docker:**

    ```bash
    docker compose up --build
    ```

    Este comando construirá las imágenes, iniciará el servicio de la aplicación (`app`) y el servicio de la base de datos PostgreSQL/PostGIS (`postgres_db`).
    El servicio `app` ejecutará automáticamente las migraciones (`npx sequelize-cli db:migrate`) y los seeders (`npx sequelize-cli db:seed:all`) para inicializar la base de datos con las tablas y datos de ejemplo.

4.  **Accede a la aplicación:**
    Una vez que los contenedores estén corriendo, la aplicación estará disponible en tu navegador en:
    `http://localhost:3000`

### Acceso a la Base de Datos (Opcional)

Puedes conectarte a la base de datos PostgreSQL directamente desde tu máquina local usando el puerto `5432` con las credenciales definidas en `docker-compose.yml`:

- **Host:** `localhost`
- **Puerto:** `5432`
- **Usuario:** `postgres`
- **Contraseña:** `password`
- **Base de datos:** `localizabaño`

### Servicio Opcional para Pruebas con MariaDB

El archivo `docker-compose.yml` incluye un servicio de MariaDB comentado. Si deseas usar MariaDB en lugar de PostgreSQL (o para pruebas duales), puedes descomentarlo en `docker-compose.yml`:

```docker
  # mariadb_db:
  #   image: mariadb:10.6
  #   environment:
  #     - MARIADB_ROOT_PASSWORD=password
  #     - MARIADB_DATABASE=localizabaño
  #   ports:
  #     - "3306:3306"
```

Recuerda que si cambias la base de datos, deberás ajustar las variables de entorno en tu archivo `.env` para apuntar a MariaDB (por ejemplo, `DB_DIALECT=mariadb`, `DB_HOST=mariadb_db`, `DB_PORT=3306`) y asegurarte de que tus migraciones y modelos de Sequelize sean compatibles con MariaDB.

## API Endpoints (Inferidos del `script.js`)

La aplicación frontend interactúa con los siguientes endpoints principales del backend:

- `GET /api/banios`: Obtener todos los baños.
- `GET /api/banios/:id`: Obtener detalles de un baño específico.
- `POST /api/banios`: Añadir un nuevo baño.
- `GET /api/caracteristicas`: Obtener todas las características de los baños.
- `GET /api/usuarios`: Obtener todos los usuarios (usado para selectores en formularios).
- `POST /api/resenias`: Enviar una nueva reseña para un baño.
- `POST /api/reportes`: Enviar un nuevo reporte para un baño.
- Otros endpoints para `admin`, `auth`, `usuarios`, `reportes` y `caracteristicas` están definidos en la carpeta `routes`.

## Documentación del Proyecto

La documentación detallada del proyecto se encuentra en la carpeta `docs/` y se genera usando `mdBook`.

Para visualizar la documentación localmente:

```bash
npm run docs:serve
```

Esto iniciará un servidor web que sirve la documentación, típicamente en `http://localhost:3000` (o un puerto diferente si el 3000 ya está en uso).

Para construir la documentación estática:

```bash
npm run docs:build
```

Esto generará los archivos HTML estáticos en la carpeta `docs/book/`.

## Contribución

Las contribuciones son bienvenidas. Si tienes ideas para mejorar LocalizaBaño, por favor, abre un "issue" o envía un "pull request".

## Licencia

Este proyecto está bajo la Licencia Apache-2.0. Consulta el archivo `LICENSE` para más detalles.

## Contacto

**Kedap** - kedap.dev@protonmail.com

Proyecto en GitHub: [https://github.com/Kedap/mapa-banios](https://github.com/Kedap/mapa-banios)
