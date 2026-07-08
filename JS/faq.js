document.addEventListener("DOMContentLoaded", () => {
  const faqCards = document.querySelectorAll(".faq-card");
  const categoryBtns = document.querySelectorAll(".category-btn");

  // 1. Controle do Accordion (Abrir/Fechar)
  faqCards.forEach((card) => {
    const questionBtn = card.querySelector(".faq-question");
    const answerContainer = card.querySelector(".faq-answer");

    if (questionBtn && answerContainer) {
      questionBtn.addEventListener("click", () => {
        const isOpen = card.classList.contains("open");

        // Fecha outros accordions para focar no selecionado (opcional - UX premium)
        faqCards.forEach((otherCard) => {
          if (otherCard !== card && otherCard.classList.contains("open")) {
            otherCard.classList.remove("open");
            const otherAnswer = otherCard.querySelector(".faq-answer");
            if (otherAnswer) {
              otherAnswer.style.maxHeight = null;
            }
          }
        });

        // Alterna o estado do cartão atual
        if (isOpen) {
          card.classList.remove("open");
          answerContainer.style.maxHeight = null;
        } else {
          card.classList.add("open");
          // Utiliza scrollHeight para transição de altura fluida e dinâmica
          answerContainer.style.maxHeight = answerContainer.scrollHeight + "px";
        }
      });
    }
  });

  // 2. Filtragem de Categorias
  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Atualizar classe ativa das categorias
      categoryBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      faqCards.forEach((card) => {
        const category = card.getAttribute("data-category");

        if (filterValue === "all" || category === filterValue) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
          // Fechar o accordion ocultado para resetar o layout
          card.classList.remove("open");
          const answer = card.querySelector(".faq-answer");
          if (answer) {
            answer.style.maxHeight = null;
          }
        }
      });
    });
  });

  // Atualizar a altura se o ecrã for redimensionado (evita cortar texto)
  window.addEventListener("resize", () => {
    faqCards.forEach((card) => {
      if (card.classList.contains("open")) {
        const answerContainer = card.querySelector(".faq-answer");
        if (answerContainer) {
          answerContainer.style.maxHeight = answerContainer.scrollHeight + "px";
        }
      }
    });
  });
});
