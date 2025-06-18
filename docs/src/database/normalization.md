# 3.4. Normalización de la Base de Datos

La normalización es un proceso sistemático de diseño de bases de datos que tiene como objetivo principal minimizar la redundancia de datos y mejorar la integridad. Al organizar las columnas y tablas para cumplir con las reglas de normalización, se previenen anomalías de inserción, actualización y borrado, resultando en un esquema más limpio, eficiente y fácil de mantener.

A continuación, se demuestra cómo el diseño de la base de datos "LocalizaBaño" cumple con las tres primeras formas normales (1NF, 2NF y 3NF), que son el estándar de oro para bases de datos relacionales.

### Primera Forma Normal (1NF)

La Primera Forma Normal establece dos reglas fundamentales:

1.  **Atomicidad de los Atributos:** Cada columna de una tabla debe contener un único valor atómico (indivisible). No se permiten grupos de valores, listas o conjuntos dentro de una sola celda.
2.  **Unicidad de los Registros:** Cada registro (fila) en la tabla debe ser único, lo cual se logra mediante una llave primaria.

**Análisis de Cumplimiento:**

- **Atomicidad:** Todas las columnas en el diseño propuesto contienen valores atómicos. Un diseño incorrecto que violaría la 1NF sería tener una columna `caracteristicas` en la tabla `BAÑOS` que almacenara un texto como `"Gratuito, Accesible, Cambiador de bebés"`. Nuestro diseño evita esto de forma explícita al crear la tabla `CARACTERISTICAS` y la tabla de unión `BAÑO_CARACTERISTICAS`, donde cada característica se representa como una fila separada y relacionada.
- **Unicidad:** Todas las tablas propuestas poseen una llave primaria que garantiza la unicidad de cada fila (`id_usuario`, `id_baño`, etc.). La tabla `BAÑO_CARACTERISTICAS` utiliza una llave primaria compuesta por `(id_baño, id_caracteristica)`, asegurando que la misma característica no se pueda asignar dos veces al mismo baño.

**Conclusión:** El esquema cumple rigurosamente con la Primera Forma Normal.

### Segunda Forma Normal (2NF)

La Segunda Forma Normal establece que:

1.  La tabla debe estar en 1NF.
2.  Todos los atributos no clave deben ser **totalmente dependientes de la llave primaria completa**. Esto previene las dependencias parciales, donde un atributo no clave depende solo de una parte de una llave primaria compuesta.

**Análisis de Cumplimiento:**

- Esta regla es principalmente relevante para tablas con **llaves primarias compuestas**. En nuestro diseño, la única tabla en esta situación es `BAÑO_CARACTERISTICAS`.
  - **Tabla `BAÑO_CARACTERISTICAS`:** Su llave primaria es `(id_baño, id_caracteristica)`. Esta tabla **no tiene ningún otro atributo no clave**, por lo que es imposible que exista una dependencia parcial. Cumple con 2NF de forma trivial y elegante.
  - Un diseño incorrecto que violaría 2NF sería añadir una columna `nombre_caracteristica` a esta tabla de unión. En ese caso, `nombre_caracteristica` dependería solo de `id_caracteristica`, que es solo una parte de la llave primaria. Nuestro diseño evita esto correctamente al mantener `nombre_caracteristica` en su propia tabla.
- **Otras tablas:** El resto de las tablas (`USUARIOS`, `BAÑOS`, etc.) tienen una llave primaria de una sola columna. Por definición, no pueden tener dependencias parciales y cumplen automáticamente con 2NF.

**Conclusión:** El esquema cumple con la Segunda Forma Normal.

### Tercera Forma Normal (3NF)

La Tercera Forma Normal establece que:

1.  La tabla debe estar en 2NF.
2.  Todos los atributos no clave deben depender **únicamente de la llave primaria** y no de otros atributos no clave. Esto elimina las **dependencias transitivas**.

**Análisis de Cumplimiento:**

Una dependencia transitiva ocurre cuando un atributo no clave `C` depende de un atributo no clave `B`, que a su vez depende de la llave primaria `A` (es decir, A → B → C).

- **Tabla `RESEÑAS`:** Consideremos los atributos no clave `calificacion_limpieza` y `comentario`. Ambos dependen directamente de `id_reseña` (la llave primaria). La columna `id_usuario` (FK) también depende directamente de `id_reseña`. No hay ningún atributo no clave que dependa de otro atributo no clave.
  - Un diseño incorrecto que violaría 3NF sería incluir la columna `email` del usuario en la tabla `RESEÑAS`. La dependencia sería: `id_reseña` → `id_usuario` → `email`. Aquí, el atributo no clave `email` depende del atributo no clave `id_usuario`. Nuestro diseño evita esto colocando el `email` únicamente en la tabla `USUARIOS` y utilizando un `JOIN` para obtenerlo cuando sea necesario, manteniendo así la 3NF.
- **Tabla `BAÑOS`:** Atributos como `nombre`, `direccion` y `estado` dependen directamente y únicamente de `id_baño`. No hay dependencias entre ellos.
- **Resto del Esquema:** Un análisis similar para el resto de las tablas confirma que no existen dependencias transitivas. Cada atributo no clave está determinado únicamente por su llave primaria.

**Conclusión:** El esquema de la base de datos cumple con la Tercera Forma Normal, lo que resulta en un diseño estructuralmente sólido, con mínima redundancia y protegido contra anomalías de datos.
