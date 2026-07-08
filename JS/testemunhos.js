document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("testimonial-form");
  const testimonialsGrid = document.querySelector(".testimonials-grid");
  const ratingTextSpan = document.querySelector(".rating span");

  if (!form || !testimonialsGrid) return;

  // Manter controle de avaliacoes locais para recalcular a media
  let numAvaliacoes = 12;
  let totalEstrelas = 58; // 10 avaliações de 5 estrelas + 2 de 4 estrelas = 58 estrelas

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameVal = document.getElementById("review-name").value.trim();
    const starsVal = parseInt(document.getElementById("review-stars").value, 10);
    const textVal = document.getElementById("review-text").value.trim();

    if (nameVal === "" || textVal === "") {
      alert("Por favor, preencha todos os campos do formulário.");
      return;
    }

    // 1. Extrair iniciais do nome para o circulo (ex: "Fernando Sebastiao" -> "FS")
    const nomePartes = nameVal.split(" ");
    let iniciais = "";
    if (nomePartes.length > 0 && nomePartes[0] !== "") {
      iniciais += nomePartes[0].charAt(0).toUpperCase();
      if (nomePartes.length > 1 && nomePartes[nomePartes.length - 1] !== "") {
        iniciais += nomePartes[nomePartes.length - 1].charAt(0).toUpperCase();
      }
    } else {
      iniciais = "C";
    }

    // 2. Obter data atual formatada (Mes Ano, ex: "Julho 2026")
    const meses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const dataAtual = new Date();
    const dataFormatada = `${meses[dataAtual.getMonth()]} ${dataAtual.getFullYear()}`;

    // 3. Montar string de estrelas (ex: 4 -> "★★★★☆")
    let estrelasString = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= starsVal) {
        estrelasString += "★";
      } else {
        estrelasString += "☆";
      }
    }

    // 4. Criar o novo card de testemunho
    const newArticle = document.createElement("article");
    newArticle.style.opacity = "0";
    newArticle.style.transform = "scale(0.9)";
    newArticle.style.transition = "all 0.4s ease";

    newArticle.innerHTML = `
      <div class="person">
        <span>${iniciais}</span>
        <div>
          <h3>${nameVal}</h3>
          <p>${dataFormatada}</p>
        </div>
      </div>
      <strong style="color: #ffad00; display: block; margin-bottom: 12px;">${estrelasString}</strong>
      <p style="margin: 0; color: #3f3b37; line-height: 1.6;">${textVal}</p>
    `;

    // Inserir no inicio da grelha de testemunhos
    testimonialsGrid.insertBefore(newArticle, testimonialsGrid.firstChild);

    // Animacao suave de entrada
    setTimeout(() => {
      newArticle.style.opacity = "1";
      newArticle.style.transform = "scale(1)";
    }, 50);

    // 5. Recalcular a media e o texto do rating no topo
    numAvaliacoes++;
    totalEstrelas += starsVal;
    const novaMedia = (totalEstrelas / numAvaliacoes).toFixed(1);

    if (ratingTextSpan) {
      // Atualizar a linha de estrelas do topo e o texto explicativo
      let estrelasTopo = "";
      const mediaArredondada = Math.round(novaMedia);
      for (let i = 1; i <= 5; i++) {
        estrelasTopo += (i <= mediaArredondada) ? "★" : "☆";
      }
      
      const parentRating = ratingTextSpan.parentElement;
      if (parentRating) {
        parentRating.innerHTML = `${estrelasTopo} <span>${novaMedia} de 5.0 (${numAvaliacoes} avaliações)</span>`;
      }
    }

    // Limpar o formulario
    form.reset();

    // Popup de sucesso temporario
    const feedback = document.createElement("div");
    feedback.innerText = "Obrigado! Sua avaliação foi submetida com sucesso.";
    feedback.style.position = "fixed";
    feedback.style.bottom = "20px";
    feedback.style.right = "20px";
    feedback.style.background = "#ddf8e9";
    feedback.style.color = "#16864a";
    feedback.style.border = "1px solid #16864a";
    feedback.style.padding = "12px 20px";
    feedback.style.borderRadius = "6px";
    feedback.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
    feedback.style.zIndex = "1000";
    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.style.opacity = "0";
      feedback.style.transition = "opacity 0.5s ease";
      setTimeout(() => feedback.remove(), 500);
    }, 3000);
  });
});
