document.addEventListener("DOMContentLoaded", () => {
  const API_URL = window.API_URL;
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("errorMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.style.display = "none";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Login exitoso:", data);
        window.location.href = "/auth/dashboard";
      } else {
        const errorData = await response.json();
        errorMsg.textContent = errorData?.msg || "Correo o contraseña incorrectos";
        errorMsg.style.display = "block";
      }
    } catch (err) {
      console.error("❌ Error en login:", err);
      errorMsg.textContent = "Error al conectar con el servidor";
      errorMsg.style.display = "block";
    }
  });
});
