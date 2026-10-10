(() => {
  'use strict';
  const languageButton = document.getElementById('language-toggle');
  let language = 'en';
  try { if (localStorage.getItem('chunyi-homepage-language') === 'zh') language = 'zh'; } catch (_) {}
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
    document.getElementById('results-status').textContent = language === 'zh'
      ? `显示 ${count} 条，共 ${records.length} 条成果`
      : `Showing ${count} of ${records.length} records`;
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
    pause.textContent = language === 'zh' ? (userPaused ? '播放' : '暂停') : (userPaused ? 'Play' : 'Pause');
    pause.setAttribute('aria-label', language === 'zh' ? (userPaused ? '播放轮播图' : '暂停轮播图') : (userPaused ? 'Play slideshow' : 'Pause slideshow'));
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
  function applyLanguage() {
    const chinese = language === 'zh';
    document.documentElement.lang = chinese ? 'zh-CN' : 'en';
    languageButton.textContent = chinese ? 'EN' : '中文';
    languageButton.setAttribute('aria-label', chinese ? 'Switch to English' : '切换到中文');
    languageButton.hidden = false;
    document.querySelectorAll('[data-en-label]').forEach(element => {
      element.setAttribute('aria-label', chinese ? element.dataset.zhLabel : element.dataset.enLabel);
    });
    document.querySelectorAll('[data-en-alt]').forEach(element => {
      element.alt = chinese ? element.dataset.zhAlt : element.dataset.enAlt;
    });
    const titles = {en:'Chunyi Zhang Group · Chemical Physics of Solutions & Interfaces', zh:'张春一课题组 · 溶液与界面化学物理'};
    const descriptions = {en:'Chunyi Zhang, Eastern Institute of Technology, Ningbo. Chemical physics of water, electrolytes and solid–liquid interfaces through first-principles simulations and machine learning.', zh:'宁波东方理工大学张春一课题组：基于第一性原理模拟与机器学习，研究水、电解质及固液界面的化学物理。'};
    document.title = titles[language];
    document.querySelector('meta[name="description"]').content = descriptions[language];
    document.querySelector('meta[property="og:title"]').content = titles[language];
    document.querySelector('meta[property="og:description"]').content = descriptions[language];
    search.placeholder = chinese ? '搜索标题、作者或期刊…' : 'Search titles, authors or journals…';
    const options = chinese ? ['全部成果', '期刊论文', '预印本', '会议摘要'] : ['All records', 'Journal articles', 'Preprints', 'Conference abstracts'];
    [...type.options].forEach((option, index) => { option.textContent = options[index]; });
    year.options[0].textContent = chinese ? '全部年份' : 'All years';
    groups.forEach(group => { const y = group.querySelector('h4').textContent; group.setAttribute('aria-label', chinese ? `${y} 年成果` : `Publications in ${y}`); });
    filter();
    updateCarouselLabels();
  }
  languageButton.addEventListener('click', () => {
    language = language === 'en' ? 'zh' : 'en';
    try { localStorage.setItem('chunyi-homepage-language', language); } catch (_) {}
    applyLanguage();
  });
  applyLanguage();
  scheduleSlide();
})();
