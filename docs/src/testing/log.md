# 7.2. Bitácora de Ejecución de Pruebas

Este documento registra los resultados de la ejecución de los casos de prueba definidos en la sección anterior. El objetivo es proporcionar una evidencia formal del proceso de validación de calidad realizado sobre la versión final de la aplicación "LocalizaBaño".

- **Proyecto:** LocalizaBaño
- **Versión del Software:** 1.0
- **Fecha del Ciclo de Pruebas:** 16 de junio de 2025
- **Entorno de Pruebas:** Desarrollo (Docker, Node.js v18+, MariaDB 10.6, Google Chrome)

### Tabla de Resultados de Ejecución

| ID del Caso | Encargado de la Prueba | Resultado Obtenido | Estado | Observaciones | Fecha |
| **TP-01** | Arellano Palacios, D. | El mapa se inicializó correctamente y los 15 marcadores del seeder aparecieron en las ubicaciones esperadas. | **PASA** | | 16/06/2025 |
| **TP-02** | Jurado Delgadillo, M.A. | Al hacer clic en un marcador, el panel lateral se actualizó correctamente con los detalles completos del baño, incluyendo listas de reseñas y características. | **PASA** | | 16/06/2025 |
| **TP-03** | Reyes Arguello, J.F. | Se envió una reseña con el nombre "AnaG". La reseña apareció en la interfaz. La consulta `SELECT COUNT(*)` a la tabla `USUARIOS` antes y después confirmó que no se crearon nuevos usuarios. | **PASA** | | 16/06/2025 |
| **TP-04** | Villegas Raymundo, B.U. | Se envió una reseña con el nombre "NuevoTester". La reseña apareció. La consulta a la tabla `USUARIOS` confirmó la creación de un nuevo registro con ese nombre y un email autogenerado. | **PASA** | Valida exitosamente la lógica "Just-in-Time". | 16/06/2025 |
| **TP-05** | Anzures Campos, J.E. | Al intentar enviar el formulario de reseña con el campo de nombre vacío, se mostró una alerta de JavaScript y la petición `fetch` no se realizó. | **PASA** | Validación del lado del cliente funciona. | 16/06/2025 |
| **TP-06** | Arellano Palacios, D. | Se creó un nuevo baño exitosamente. El marcador permanente apareció en la ubicación correcta y el panel lateral se limpió mostrando un mensaje de éxito. | **PASA** | | 16/06/2025 |
| **TP-07** | Jurado Delgadillo, M.A. | Al intentar guardar el formulario de nuevo baño sin haber hecho clic en el mapa, se mostró una alerta de "Por favor, selecciona una ubicación...". | **PASA** | | 16/06/2025 |
| **TP-08** | Reyes Arguello, J.F. | Petición `GET` a `/api/banios/9999` en Postman devolvió un código de estado 404 y el cuerpo JSON `{"error": "Baño no encontrado"}`. | **PASA** | El manejo de errores de la API es correcto. | 16/06/2025 |
| **TP-09** | Villegas Raymundo, B.U. | Petición `POST` a `/api/banios` sin el campo `nombre` devolvió un código de estado 400 y el cuerpo JSON `{"error": "El nombre y la ubicación son obligatorios."}`. | **PASA** | La validación de la API es correcta. | 16/06/2025 |
| **TP-10** | Anzures Campos, J.E. | Tras ejecutar el TP-06, se consultó la BD. Se confirmaron los 3 nuevos registros en la tabla `BAÑO_CARACTERISTICAS` con los IDs correctos. | **PASA** | La relación N:M se establece correctamente. | 16/06/2025 |

### Resumen de la Ejecución

- **Total de Casos de Prueba Ejecutados:** 10
- **Resultados:**
  - **Pasa:** 10 (100%)
  - **Falla:** 0 (0%)
- **Defectos Críticos/Bloqueadores Encontrados:** 0

### Conclusión General de las Pruebas

El ciclo de pruebas se ha completado satisfactoriamente. Todos los casos de prueba definidos han sido ejecutados y han arrojado los resultados esperados. Se ha validado que las funcionalidades principales del sistema "LocalizaBaño", incluyendo la visualización de datos, la contribución de contenido y la lógica de usuario "Just-in-Time", operan de manera correcta y estable. No se han identificado defectos críticos que impidan el despliegue o la entrega del proyecto.
