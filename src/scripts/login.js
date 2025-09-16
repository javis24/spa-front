document.addEventListener("DOMContentLoaded", () => {
  const API_URL = (window.API_URL || "/api").replace(/\/$/, ""); // <- sin slash final
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("errorMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.style.display = "none";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        await response.json(); // opcional
        window.location.href = "/auth/dashboard";
      } else {
        let msg = "Correo o contraseña incorrectos";
        try { msg = (await response.json()).msg || msg; } catch {}
        errorMsg.textContent = msg;
        errorMsg.style.display = "block";
      }
    } catch (err) {
      console.error("❌ Error en login:", err);
      errorMsg.textContent = "Error al conectar con el servidor";
      errorMsg.style.display = "block";
    }
  });
});
