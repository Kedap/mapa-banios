document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  const reportsBody = document.getElementById("reports-body");
  const loadingMessage = document.getElementById("loading-message");
  const logoutBtn = document.getElementById("logout-btn");

  // -- Guardia de Seguridad --
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // -- Lógica de Cerrar Sesión --
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("authToken");
    window.location.href = "login.html";
  });

  // --- ¡NUEVO! Delegación de eventos para los botones de acción ---
  reportsBody.addEventListener("click", async (e) => {
    const target = e.target;
    const reportId = target.dataset.id;

    if (!reportId) return; // No se hizo clic en un botón con data-id

    // Lógica para el botón "Resolver"
    if (target.classList.contains("resolve-btn")) {
      if (
        confirm(
          `¿Estás seguro de que quieres marcar el reporte #${reportId} como resuelto?`,
        )
      ) {
        await updateReport(reportId, "Resuelto", target);
      }
    }

    // Lógica para el botón "Ignorar/Eliminar"
    if (target.classList.contains("delete-btn")) {
      if (
        confirm(
          `¿Estás seguro de que quieres ELIMINAR el reporte #${reportId}? Esta acción es permanente.`,
        )
      ) {
        await deleteReport(reportId, target);
      }
    }
  });

  /**
   * Llama a la API para actualizar el estado de un reporte
   */
  async function updateReport(id, newState, button) {
    try {
      button.disabled = true; // Deshabilita el botón para evitar dobles clics
      button.textContent = "Procesando...";

      const response = await fetch(`/api/admin/reportes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: newState }),
      });

      if (!response.ok) throw new Error("Falló la actualización del reporte.");

      // Si tiene éxito, eliminamos la fila de la tabla visualmente
      button.closest("tr").remove();
    } catch (error) {
      alert(`Error: ${error.message}`);
      button.disabled = false;
      button.textContent = "Resolver";
    }
  }

  /**
   * Llama a la API para eliminar un reporte
   */
  async function deleteReport(id, button) {
    try {
      button.disabled = true;
      button.textContent = "Eliminando...";

      const response = await fetch(`/api/admin/reportes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Falló la eliminación del reporte.");

      // Si tiene éxito, eliminamos la fila
      button.closest("tr").remove();
    } catch (error) {
      alert(`Error: ${error.message}`);
      button.disabled = false;
      button.textContent = "Ignorar";
    }
  }

  /**
   * Carga inicial de los reportes pendientes
   */
  async function fetchAndRenderReports() {
    // ... (el código de esta función no necesita cambios)
    try {
      const response = await fetch("/api/admin/reportes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        logoutBtn.click();
        return;
      }
      if (!response.ok) throw new Error("No se pudieron cargar los reportes.");

      const reports = await response.json();
      loadingMessage.style.display = "none";
      reportsBody.innerHTML = "";

      if (reports.length === 0) {
        reportsBody.innerHTML =
          '<tr><td colspan="5" style="text-align:center;">No hay reportes pendientes.</td></tr>';
      } else {
        reports.forEach((report) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                        <td>${report.id_reporte}</td>
                        <td>${report.tipo_reporte}</td>
                        <td><a href="/?bañoId=${report.id_baño}" target="_blank">${report.id_baño}</a></td>
                        <td>${report.descripcion || "N/A"}</td>
                        <td>
                            <button class="action-btn resolve-btn" data-id="${report.id_reporte}">Resolver</button>
                            <button class="action-btn delete-btn" data-id="${report.id_reporte}">Ignorar</button>
                        </td>
                    `;
          reportsBody.appendChild(row);
        });
      }
    } catch (error) {
      loadingMessage.textContent = `Error: ${error.message}`;
      loadingMessage.style.color = "red";
    }
  }

  // Iniciar la carga de datos al entrar a la página
  fetchAndRenderReports();
});
