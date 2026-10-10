(() => {
  'use strict';
  const search = document.getElementById('publication-search');
  const type = document.getElementById('publication-type');
  const year = document.getElementById('publication-year');
  const records = [...document.querySelectorAll('.publication')];
  const groups = [...document.querySelectorAll('.publication-year-group')];
  function filter() {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    for (const record of records) {
      const match = (type.value === 'all' || record.dataset.type === type.value)
        && (year.value === 'all' || record.dataset.year === year.value)
        && (!query || record.dataset.search.includes(query));
      record.hidden = !match;
      if (match) count++;
    }
    for (const group of groups) group.hidden = ![...group.querySelectorAll('.publication')].some(record => !record.hidden);
    document.getElementById('results-status').textContent = `Showing ${count} of ${records.length} records`;
    document.getElementById('no-results').hidden = count !== 0;
  }
  search.addEventListener('input', filter);
  type.addEventListener('change', filter);
  year.addEventListener('change', filter);
  document.getElementById('publication-controls').addEventListener('submit', event => event.preventDefault());
  const carousel = document.getElementById('research-carousel');
  const slides = [...carousel.querySelectorAll('.research-slide')];
  const dots = [...carousel.querySelectorAll('.carousel-dot')];
  const pause = document.getElementById('research-pause');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentSlide = 0;
  let userPaused = reducedMotion.matches;
  let pointerInside = false;
  let focusInside = false;
  let inView = !('IntersectionObserver' in window);
  let slideTimer;
  let leavingTimer;
  function updateCarouselLabels() {
    pause.textContent = userPaused ? 'Play' : 'Pause';
    pause.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
    pause.setAttribute('aria-pressed', String(userPaused));
  }
  function scheduleSlide() {
    clearTimeout(slideTimer);
    if (userPaused || pointerInside || focusInside || !inView || document.hidden) return;
    slideTimer = setTimeout(() => showSlide(currentSlide + 1), 6000);
  }
  function showSlide(index) {
    const previousSlide = currentSlide;
    currentSlide = (index + slides.length) % slides.length;
    if (currentSlide === previousSlide) { scheduleSlide(); return; }
    clearTimeout(leavingTimer);
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-leaving', i === previousSlide);
      slide.classList.toggle('is-active', i === currentSlide);
      slide.setAttribute('aria-hidden', String(i !== currentSlide));
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentSlide);
      dot.setAttribute('aria-current', String(i === currentSlide));
    });
    leavingTimer = setTimeout(() => slides.forEach(slide => slide.classList.remove('is-leaving')), 1100);
    scheduleSlide();
  }
  document.getElementById('research-previous').addEventListener('click', () => showSlide(currentSlide - 1));
  document.getElementById('research-next').addEventListener('click', () => showSlide(currentSlide + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
  pause.addEventListener('click', () => {
    userPaused = !userPaused;
    updateCarouselLabels();
    scheduleSlide();
  });
  carousel.addEventListener('mouseenter', () => { pointerInside = true; scheduleSlide(); });
  carousel.addEventListener('mouseleave', () => { pointerInside = false; scheduleSlide(); });
  carousel.addEventListener('focusin', () => { focusInside = true; scheduleSlide(); });
  carousel.addEventListener('focusout', event => { focusInside = carousel.contains(event.relatedTarget); scheduleSlide(); });
  carousel.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    showSlide(currentSlide + (event.key === 'ArrowRight' ? 1 : -1));
  });
  document.addEventListener('visibilitychange', scheduleSlide);
  reducedMotion.addEventListener('change', event => {
    if (event.matches) { userPaused = true; updateCarouselLabels(); scheduleSlide(); }
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { inView = entries[0].isIntersecting; scheduleSlide(); }, {threshold:0.2}).observe(carousel);
  }
  filter();
  updateCarouselLabels();
  scheduleSlide();
})();
