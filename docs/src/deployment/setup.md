# 6. Guía de Instalación y Despliegue

Este manual proporciona las instrucciones detalladas para configurar y ejecutar el proyecto "LocalizaBaño" en un entorno de desarrollo local. La aplicación está completamente "dockerizada" para garantizar un entorno de ejecución consistente y simplificar la gestión de dependencias, especialmente la de la base de datos.

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado el siguiente software en tu sistema:

1.  **Node.js:** Se recomienda la versión 18.x o superior. Puedes descargarlo desde [nodejs.org](https://nodejs.org/).
2.  **Docker y Docker Compose:** Es fundamental para orquestar los contenedores de la aplicación y la base de datos. Descárgalo desde [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop).
3.  **Git:** Para clonar el repositorio del proyecto.

### Pasos de Instalación

Sigue estos pasos en orden desde tu terminal de línea de comandos.

#### 1. Clonar el Repositorio

Primero, clona el repositorio del proyecto desde su ubicación en Git y navega hasta el directorio recién creado.

```bash
git clone https://github.com/Kedap/mapa-banios.git
cd mapa-banios
```

#### 2. Instalar Dependencias de Node.js

El proyecto utiliza varias librerías de Node.js (Express, Sequelize, etc.). Instálalas usando `npm`.

```bash
npm install
```

#### 3. Configurar las Variables de Entorno

La aplicación gestiona las credenciales de la base de datos y otras configuraciones a través de variables de entorno para mayor seguridad y flexibilidad.

1.  Crea una copia del archivo de ejemplo `.env.example` y renómbrala a `.env`.

    ```bash
    # En Linux/macOS
    cp .env.example .env

    # En Windows
    copy .env.example .env
    ```

2.  Abre el archivo `.env` con un editor de texto y revisa las variables. **Para un inicio rápido, los valores por defecto están diseñados para funcionar directamente con la configuración de Docker Compose.**

    **Ejemplo de `.env` para desarrollo con PostgreSQL:**

    ```dotenv
    # Dialecto a usar: 'postgres' o 'mariadb'
    DB_DIALECT=postgres

    # Datos de conexión
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=postgres
    DB_PASSWORD=password
    DB_NAME=localizabaño

    # Secreto para firmar tokens JWT (si se implementa autenticación)
    JWT_SECRET=un_secreto_muy_seguro
    ```

#### 4. Levantar los Servicios con Docker

Este es el paso central. El siguiente comando leerá el archivo `docker-compose.yml` e iniciará los contenedores necesarios (tu aplicación y la base de datos).

```bash
docker-compose up -d
```

- `up`: Crea e inicia los contenedores.
- `-d`: _Detached mode_. Ejecuta los contenedores en segundo plano.

Puedes verificar que los contenedores están corriendo con `docker ps`.

#### 5. Ejecutar las Migraciones de la Base de Datos

Una vez que el contenedor de la base de datos esté en funcionamiento, necesitas crear la estructura de las tablas. Las migraciones de Sequelize hacen esto por ti.

```bash
npx sequelize-cli db:migrate
```

Al finalizar, deberías ver un mensaje indicando que todas las migraciones se han ejecutado con éxito.

#### 6. Poblar la Base de Datos con Datos Iniciales (Opcional)

Para tener datos con los que probar la aplicación inmediatamente, puedes ejecutar el seeder.

```bash
npx sequelize-cli db:seed:all
```

Esto insertará usuarios, baños, reseñas y otros datos de ejemplo.

#### 7. Iniciar la Aplicación

Finalmente, inicia el servidor de Node.js.

```bash
npm start
```

Deberías ver en tu terminal un mensaje similar a este:

```
🚀 Servidor corriendo en el puerto 3000
✅ Conexión a la base de datos establecida exitosamente.
```

#### 8. ¡Listo!

Abre tu navegador web y navega a **`http://localhost:3000`**. Deberías ver la aplicación "LocalizaBaño" completamente funcional.

### Cambiar de Base de Datos (PostgreSQL ↔ MariaDB)

Gracias al diseño portable, cambiar de motor de base de datos es muy sencillo:

1.  **Detén los contenedores:** `docker-compose down`.
2.  **Edita `docker-compose.yml`:** Comenta el servicio de la base de datos actual y descomenta el del nuevo motor.
3.  **Actualiza `.env`:** Cambia `DB_DIALECT` y las otras variables (`DB_PORT`, etc.) para que coincidan con la nueva base de datos.
4.  **Repite los pasos del 4 al 7** de la guía de instalación. Sequelize se encargará de crear las tablas y poblar los datos en el nuevo SGBD.

### **Puntos Clave de este Contenido**

- **Claridad y Orden:** Los pasos están numerados y en un orden lógico que cualquier persona puede seguir.
- **Comandos Listos para Copiar:** Todos los comandos necesarios están en bloques de código para que el usuario pueda copiarlos y pegarlos fácilmente.
- **Explicación de Pasos:** Cada paso importante tiene una breve explicación de _por qué_ se está haciendo (ej. para qué sirven las migraciones).
- **Foco en Docker:** La guía se centra en el flujo de trabajo con Docker, ya que es el método más robusto que definiste.
- **Instrucciones de Portabilidad:** Incluye la sección sobre cómo cambiar de base de datos, lo cual es una característica clave y muy profesional de tu proyecto.
