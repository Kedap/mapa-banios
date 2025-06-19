document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  const reportsBody = document.getElementById("reports-body");
  const loadingMessage = document.getElementById("loading-message");
  const logoutBtn = document.getElementById("logout-btn");

  // -- Guardia de Seguridad --
  // Si no hay token, no se puede estar en esta página. Redirigir al login.
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // -- Lógica de Cerrar Sesión --
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("authToken");
    window.location.href = "login.html";
  });

  // -- Cargar los Reportes --
  async function fetchAndRenderReports() {
    try {
      const response = await fetch("/api/admin/reportes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ¡Enviar el token!
        },
      });

      if (response.status === 401 || response.status === 403) {
        // Token inválido o expirado
        logoutBtn.click(); // Forzar cierre de sesión
        return;
      }

      if (!response.ok) {
        throw new Error("No se pudieron cargar los reportes.");
      }

      const reports = await response.json();
      loadingMessage.style.display = "none";
      reportsBody.innerHTML = ""; // Limpiar la tabla

      if (reports.length === 0) {
        reportsBody.innerHTML =
          '<tr><td colspan="5" style="text-align:center;">No hay reportes pendientes.</td></tr>';
      } else {
        reports.forEach((report) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                        <td>${report.id_reporte}</td>
                        <td>${report.tipo_reporte}</td>
                        <td>${report.id_baño}</td>
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
