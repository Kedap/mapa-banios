# 3.1. Descripción Detallada de Tablas

A continuación, se presenta un análisis detallado de cada tabla en el esquema "LocalizaBaño". Cada entrada describe el propósito de la tabla, sus columnas, los tipos de datos sugeridos para un SGBD como PostgreSQL, y las restricciones o propósitos de cada campo.

### Tabla: `USUARIOS`

**Propósito:** Almacenar un registro único para cada contribuyente. Aunque la interacción del usuario es anónima, esta tabla garantiza que todas las contribuciones de un mismo nombre se agrupen bajo un único ID, manteniendo la integridad relacional. El backend crea nuevos registros automáticamente si un nombre de usuario no existe.

| Nombre del Campo | Tipo de Dato   | Descripción / Restricciones                                                                                               |
| :--------------- | :------------- | :------------------------------------------------------------------------------------------------------------------------ |
| `id_usuario`     | `SERIAL`       | **Llave Primaria (PK)**. Identificador numérico único y autoincremental para cada usuario.                                |
| `nombre_usuario` | `VARCHAR(50)`  | **UNIQUE, No Nulo**. El nombre público que el contribuyente elige. Es el campo clave para la lógica `findOrCreate`.       |
| `email`          | `VARCHAR(255)` | **UNIQUE, No Nulo**. Generado automáticamente por el sistema para satisfacer la unicidad, no es utilizado por el usuario. |
| `password_hash`  | `VARCHAR(255)` | **No Nulo**. Generado automáticamente con un valor aleatorio y seguro, no se utiliza para autenticación.                  |
| `fecha_registro` | `TIMESTAMPTZ`  | **No Nulo, DEFAULT NOW()**. Registra la fecha y hora exactas en que el usuario fue creado por primera vez.                |

---

### Tabla: `BAÑOS`

**Propósito:** Contener toda la información descriptiva, de ubicación y de estado de cada baño público registrado en el sistema.

| Nombre del Campo | Tipo de Dato    | Descripción / Restricciones                                                                                    |
| :--------------- | :-------------- | :------------------------------------------------------------------------------------------------------------- |
| `id_baño`        | `SERIAL`        | **Llave Primaria (PK)**. Identificador numérico único y autoincremental para cada baño.                        |
| `nombre`         | `VARCHAR(100)`  | **No Nulo**. Nombre descriptivo del lugar.                                                                     |
| `direccion`      | `TEXT`          | Dirección textual completa.                                                                                    |
| `ubicacion`      | `GEOMETRY`      | **No Nulo**. Coordenada geográfica almacenada en un tipo de dato espacial (`POINT`) para consultas eficientes. |
| `horario`        | `VARCHAR(100)`  | Texto libre para describir el horario de apertura.                                                             |
| `costo`          | `DECIMAL(5, 2)` | **DEFAULT 0.00**. El costo para usar el baño.                                                                  |
| `estado`         | `VARCHAR(50)`   | **DEFAULT 'Activo'**. El estado actual del baño (ej: 'Activo', 'Fuera de Servicio').                           |

---

### Tabla: `RESEÑAS`

**Propósito:** Almacenar las calificaciones y comentarios que los usuarios dejan sobre un baño. Es la tabla central para el contenido generado por la comunidad.

| Nombre del Campo         | Tipo de Dato  | Descripción / Restricciones                                                 |
| :----------------------- | :------------ | :-------------------------------------------------------------------------- |
| `id_reseña`              | `SERIAL`      | **Llave Primaria (PK)**.                                                    |
| `id_usuario`             | `INTEGER`     | **Llave Foránea (FK)** a `USUARIOS`. Indica qué usuario escribió la reseña. |
| `id_baño`                | `INTEGER`     | **Llave Foránea (FK)** a `BAÑOS`. Indica sobre qué baño es la reseña.       |
| `calificacion_limpieza`  | `SMALLINT`    | **No Nulo**. Calificación numérica del 1 al 5.                              |
| `calificacion_seguridad` | `SMALLINT`    | **No Nulo**. Calificación numérica del 1 al 5.                              |
| `comentario`             | `TEXT`        | Comentario de texto opcional.                                               |
| `fecha_reseña`           | `TIMESTAMPTZ` | **DEFAULT NOW()**. Registra cuándo se publicó la reseña.                    |

---

### Tabla: `CARACTERISTICAS`

**Propósito:** Funcionar como una tabla de consulta (_lookup table_) para estandarizar las características que puede tener un baño.

| Nombre del Campo        | Tipo de Dato   | Descripción / Restricciones                                                              |
| :---------------------- | :------------- | :--------------------------------------------------------------------------------------- |
| `id_caracteristica`     | `SERIAL`       | **Llave Primaria (PK)**.                                                                 |
| `nombre_caracteristica` | `VARCHAR(100)` | **UNIQUE, No Nulo**. El nombre de la característica (ej: "Acceso para silla de ruedas"). |
| `descripcion`           | `TEXT`         | Descripción opcional de la característica.                                               |

---

### Tabla: `BAÑO_CARACTERISTICAS`

**Propósito:** Tabla de unión para resolver la relación muchos a muchos entre `BAÑOS` y `CARACTERISTICAS`.

| Nombre del Campo    | Tipo de Dato | Descripción / Restricciones                               |
| :------------------ | :----------- | :-------------------------------------------------------- |
| `id_baño`           | `INTEGER`    | **PK Compuesta, Llave Foránea (FK)** a `BAÑOS`.           |
| `id_caracteristica` | `INTEGER`    | **PK Compuesta, Llave Foránea (FK)** a `CARACTERISTICAS`. |

---

### Tabla: `REPORTES`

**Propósito:** Almacenar los reportes enviados por los usuarios para notificar sobre problemas o datos incorrectos.

| Nombre del Campo | Tipo de Dato   | Descripción / Restricciones                         |
| :--------------- | :------------- | :-------------------------------------------------- |
| `id_reporte`     | `SERIAL`       | **Llave Primaria (PK)**.                            |
| `id_baño`        | `INTEGER`      | **Llave Foránea (FK)** a `BAÑOS`.                   |
| `id_usuario`     | `INTEGER`      | **Llave Foránea (FK)** a `USUARIOS`.                |
| `tipo_reporte`   | `VARCHAR(100)` | **No Nulo**. Categoría del problema.                |
| `descripcion`    | `TEXT`         | Comentario detallado del usuario.                   |
| `estado_reporte` | `VARCHAR(50)`  | **DEFAULT 'Pendiente'**. Ciclo de vida del reporte. |
| `fecha_reporte`  | `TIMESTAMPTZ`  | **DEFAULT NOW()**.                                  |
