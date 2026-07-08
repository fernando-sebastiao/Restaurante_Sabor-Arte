document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('#menu-search');
  const filterButtons = document.querySelectorAll('[data-menu-filter]');
  const sections = document.querySelectorAll('.menu-section[data-category]');
  const emptyState = document.querySelector('#menu-empty');

  if (!searchInput || filterButtons.length === 0 || sections.length === 0) return;

  let activeCategory = 'all';

  function normalize(value) {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function applyFilters() {
    const query = normalize(searchInput.value.trim());
    let visibleCount = 0;

    sections.forEach((section) => {
      const category = section.dataset.category;
      const categoryMatches = activeCategory === 'all' || activeCategory === category;
      let sectionVisibleCount = 0;

      section.querySelectorAll('.dish-card').forEach((card) => {
        const textMatches = normalize(card.textContent).includes(query);
        const isVisible = categoryMatches && textMatches;
        card.hidden = !isVisible;

        if (isVisible) {
          card.classList.add('is-visible');
          sectionVisibleCount += 1;
          visibleCount += 1;
        }
      });

      section.hidden = sectionVisibleCount === 0;

      if (sectionVisibleCount > 0) {
        section.classList.add('is-visible');
      }
    });

    emptyState.hidden = visibleCount !== 0;
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.menuFilter;

      filterButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      applyFilters();
    });
  });

  searchInput.addEventListener('input', applyFilters);
  applyFilters();
});
