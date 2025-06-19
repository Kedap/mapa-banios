document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMessage.textContent = ""; // Limpia errores previos

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión.");
      }

      // Guardar el token en el almacenamiento local y redirigir
      localStorage.setItem("authToken", data.token);
      window.location.href = "dashboard.html";
    } catch (error) {
      errorMessage.textContent = error.message;
    }
  });
});
