document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length === 0) return;

  let currentSlideIndex = 0;
  const slideInterval = 5000; // 5 segundos

  function nextSlide() {
    slides[currentSlideIndex].classList.remove('active');
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    slides[currentSlideIndex].classList.add('active');
  }

  setInterval(nextSlide, slideInterval);
});
