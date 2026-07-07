document.addEventListener("DOMContentLoaded", () => {
  // 1. Filtragem de Mesas
  const chips = document.querySelectorAll(".filters .chip");
  const tables = document.querySelectorAll(".tables .table-card");
  const mesaInput = document.getElementById("reserva-mesa");
  const pessoasInput = document.getElementById("reserva-pessoas");
  const form = document.getElementById("reservas-form");

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      // Mudar chip ativo
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      const filterValue = chip.getAttribute("data-filter");

      tables.forEach(table => {
        const capacity = parseInt(table.getAttribute("data-capacity"), 10);
        
        if (filterValue === "all") {
          table.style.display = "block";
        } else if (filterValue === "2") {
          table.style.display = (capacity === 2) ? "block" : "none";
        } else if (filterValue === "4") {
          table.style.display = (capacity === 4) ? "block" : "none";
        } else if (filterValue === "6") {
          table.style.display = (capacity >= 6) ? "block" : "none";
        }
      });
    });
  });

  // 2. Seleção de Mesa Interativa
  tables.forEach(table => {
    table.addEventListener("click", () => {
      // Ignorar se a mesa já estiver reservada
      if (table.classList.contains("reserved")) {
        alert("Esta mesa já se encontra reservada. Por favor, selecione outra mesa disponível.");
        return;
      }

      // Alternar classe selected
      tables.forEach(t => t.classList.remove("selected"));
      table.classList.add("selected");

      // Atualizar inputs no formulário
      const tableNum = table.getAttribute("data-table-num");
      const capacity = table.getAttribute("data-capacity");

      if (mesaInput) mesaInput.value = tableNum;
      if (pessoasInput) pessoasInput.value = capacity;
    });
  });

  // 3. Validação do Formulário e Modal de Sucesso
  const modal = document.getElementById("reserva-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalDetails = document.getElementById("modal-details-content");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      // Limpar erros anteriores
      document.querySelectorAll(".error-msg").forEach(el => el.remove());
      const inputs = form.querySelectorAll("input");
      inputs.forEach(i => i.style.borderColor = "");

      let hasErrors = false;

      const nomeVal = document.getElementById("reserva-nome").value.trim();
      const emailVal = document.getElementById("reserva-email").value.trim();
      const telVal = document.getElementById("reserva-telefone").value.trim();
      const dataVal = document.getElementById("reserva-data").value;
      const horaVal = document.getElementById("reserva-horario").value;
      const pessoasVal = parseInt(pessoasInput.value, 10);
      const mesaVal = parseInt(mesaInput.value, 10);

      // Validação de Nome
      if (nomeVal.length < 3) {
        showError(document.getElementById("reserva-nome"), "Nome muito curto.");
        hasErrors = true;
      }

      // Validação de E-mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        showError(document.getElementById("reserva-email"), "E-mail inválido.");
        hasErrors = true;
      }

      // Validação de Telefone (mínimo 9 dígitos para Angola)
      if (telVal.replace(/\D/g, "").length < 9) {
        showError(document.getElementById("reserva-telefone"), "Telefone deve conter no mínimo 9 dígitos.");
        hasErrors = true;
      }

      // Validação de Data (hoje ou no futuro)
      if (dataVal) {
        const dataSelecionada = new Date(dataVal);
        const hoje = new Date();
        hoje.setHours(0,0,0,0);
        dataSelecionada.setHours(0,0,0,0);
        if (dataSelecionada < hoje) {
          showError(document.getElementById("reserva-data"), "A data não pode ser anterior a hoje.");
          hasErrors = true;
        }
      } else {
        showError(document.getElementById("reserva-data"), "Data é obrigatória.");
        hasErrors = true;
      }

      // Verificar se a mesa escolhida no input está disponível na lista física
      let mesaDisponivel = true;
      tables.forEach(t => {
        const num = parseInt(t.getAttribute("data-table-num"), 10);
        if (num === mesaVal && t.classList.contains("reserved")) {
          mesaDisponivel = false;
        }
      });

      if (!mesaDisponivel) {
        showError(mesaInput, "A mesa inserida já está reservada.");
        hasErrors = true;
      }

      if (mesaVal < 1 || mesaVal > 9) {
        showError(mesaInput, "Mesa inválida (selecione de 1 a 9).");
        hasErrors = true;
      }

      if (!hasErrors) {
        // Preencher detalhes do modal de sucesso
        const dataFormatada = new Date(dataVal).toLocaleDateString("pt-PT");
        modalDetails.innerHTML = `
          <h4>Resumo do Pedido de Reserva</h4>
          <p><strong>Nome:</strong> ${nomeVal}</p>
          <p><strong>Telefone:</strong> ${telVal}</p>
          <p><strong>Mesa Reservada:</strong> Mesa ${mesaVal}</p>
          <p><strong>Número de Pessoas:</strong> ${pessoasVal} pessoas</p>
          <p><strong>Data & Horário:</strong> ${dataFormatada} às ${horaVal}</p>
          <p><strong>E-mail de Confirmação enviado para:</strong> ${emailVal}</p>
        `;

        // Abrir modal
        modal.classList.add("active");
      }
    });
  }

  if (modalCloseBtn && modal) {
    modalCloseBtn.addEventListener("click", () => {
      modal.classList.remove("active");
      form.reset();
      tables.forEach(t => t.classList.remove("selected"));
    });
  }

  function showError(inputElement, message) {
    inputElement.style.borderColor = "#b35050";
    const errorSpan = document.createElement("span");
    errorSpan.className = "error-msg";
    errorSpan.style.color = "#b35050";
    errorSpan.style.fontSize = "11px";
    errorSpan.style.marginTop = "2px";
    errorSpan.style.display = "block";
    errorSpan.innerText = message;
    inputElement.parentElement.appendChild(errorSpan);
  }
});
