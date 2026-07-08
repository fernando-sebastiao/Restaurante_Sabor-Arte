document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactos-form");
  const nomeInput = document.getElementById("contacto-nome");
  const emailInput = document.getElementById("contacto-email");
  const mensagemInput = document.getElementById("contacto-mensagem");
  const mapContainer = document.getElementById("map") || document.getElementById("company-map");

  if (mapContainer) {
    const companyLocation = [-8.85761, 13.28194];
    const mapUrl = "https://www.openstreetmap.org/?mlat=-8.85761&mlon=13.28194#map=17/-8.85761/13.28194";

    if (window.L) {
      mapContainer.innerHTML = "";
      const map = L.map(mapContainer, {
        scrollWheelZoom: false
      }).setView(companyLocation, 17);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      L.marker(companyLocation)
        .addTo(map)
        .bindPopup("<strong>Restaurante Sabor & Arte</strong><br>Universidade Católica de Angola<br>Av. Pedro de Castro Van-Dúnem Loy, Luanda")
        .openPopup();

      L.circle(companyLocation, {
        radius: 85,
        color: "#c7822b",
        fillColor: "#c7822b",
        fillOpacity: 0.12,
        weight: 2
      }).addTo(map);
    } else {
      mapContainer.innerHTML = `<div class="map__placeholder"><p>Não foi possível carregar o mapa interativo.</p><a class="map-link" href="${mapUrl}" target="_blank" rel="noopener">Abrir localização no mapa</a></div>`;
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
