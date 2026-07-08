document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('[data-gallery-filter]');
  const galleryItems = document.querySelectorAll('[data-gallery-category]');
  const modal = document.querySelector('#gallery-modal');
  const modalImage = document.querySelector('#gallery-modal-image');
  const modalTitle = document.querySelector('#gallery-modal-title');
  const closeButton = document.querySelector('#gallery-close');

  function applyFilter(filter) {
    galleryItems.forEach((item) => {
      const isVisible = filter === 'all' || item.dataset.galleryCategory === filter;
      item.hidden = !isVisible;
      if (isVisible) {
        item.classList.add('is-visible');
      }
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.galleryFilter;

      filterButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');

      applyFilter(filter);
    });
  });

  // Inicializar o filtro ativo ao carregar para garantir a visibilidade
  const activeFilterBtn = document.querySelector('[data-gallery-filter].active') || filterButtons[0];
  if (activeFilterBtn) {
    applyFilter(activeFilterBtn.dataset.galleryFilter);
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const image = item.querySelector('img');
      const title = item.querySelector('h2');

      modalImage.src = image.src;
      modalImage.alt = image.alt;
      modalTitle.textContent = title.textContent;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modalImage.src = '';
  }

  closeButton.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
});
