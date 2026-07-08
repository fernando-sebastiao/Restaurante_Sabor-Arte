document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactos-form");
  const nomeInput = document.getElementById("contacto-nome");
  const emailInput = document.getElementById("contacto-email");
  const mensagemInput = document.getElementById("contacto-mensagem");
  const mapContainer = document.getElementById("company-map");

  if (mapContainer) {
    if (window.L) {
      const companyLocation = [-23.5505, -46.6333];
      const map = L.map(mapContainer).setView(companyLocation, 16);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      L.marker(companyLocation)
        .addTo(map)
        .bindPopup("<strong>Sabor & Arte</strong><br>Rua dos Sabores, 123 - São Paulo")
        .openPopup();
    } else {
      mapContainer.innerHTML = '<a class="map-link" href="https://www.openstreetmap.org/?mlat=-23.5505&mlon=-46.6333#map=16/-23.5505/-46.6333" target="_blank" rel="noopener">Abrir localização no mapa</a>';
    }
  }

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Impede a submissao padrao da pagina
    
    // Limpar erros anteriores
    document.querySelectorAll(".error-msg").forEach(el => el.remove());
    nomeInput.style.borderColor = "";
    emailInput.style.borderColor = "";
    mensagemInput.style.borderColor = "";

    let hasErrors = false;

    // 1. Validar Nome
    if (nomeInput.value.trim().length < 3) {
      showError(nomeInput, "O nome deve ter no mínimo 3 caracteres.");
      hasErrors = true;
    }

    // 2. Validar Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, "Introduza um endereço de e-mail válido.");
      hasErrors = true;
    }

    // 3. Validar Mensagem
    if (mensagemInput.value.trim().length < 10) {
      showError(mensagemInput, "A mensagem deve conter no mínimo 10 caracteres.");
      hasErrors = true;
    }

    if (!hasErrors) {
      // Feedback visual de sucesso
      const popup = document.createElement("div");
      popup.style.position = "fixed";
      popup.style.top = "20px";
      popup.style.right = "20px";
      popup.style.background = "#ddf8e9";
      popup.style.color = "#16864a";
      popup.style.padding = "16px 24px";
      popup.style.borderRadius = "8px";
      popup.style.border = "1px solid #16864a";
      popup.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      popup.style.zIndex = "1001";
      popup.style.fontWeight = "bold";
      popup.style.fontFamily = "inherit";
      popup.innerText = "✓ Mensagem enviada com sucesso! Entraremos em contacto brevemente.";

      document.body.appendChild(popup);
      form.reset();

      // Desaparecer apos 4 segundos
      setTimeout(() => {
        popup.style.opacity = "0";
        popup.style.transition = "opacity 0.5s ease";
        setTimeout(() => popup.remove(), 500);
      }, 4000);
    }
  });

  function showError(inputElement, message) {
    inputElement.style.borderColor = "#b35050";
    const errorSpan = document.createElement("span");
    errorSpan.className = "error-msg";
    errorSpan.style.color = "#b35050";
    errorSpan.style.fontSize = "12px";
    errorSpan.style.marginTop = "4px";
    errorSpan.style.display = "block";
    errorSpan.innerText = message;
    inputElement.parentElement.appendChild(errorSpan);
  }
});
