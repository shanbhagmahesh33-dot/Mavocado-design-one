(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 700px)');
  const header = document.querySelector('#header');
  const hero = document.querySelector('.hero');
  const menu = document.querySelector('#menu-dialog');
  const detail = document.querySelector('#detail-dialog');
  const privacy = document.querySelector('#privacy-dialog');
  let returnFocus = null;

  function openDialog(dialog, trigger) {
    returnFocus = trigger || document.activeElement;
    dialog.showModal();
  }
  function closeDialog(dialog) {
    dialog.close();
    returnFocus?.focus({ preventScroll: true });
  }
  document.querySelector('.menu-trigger').addEventListener('click', event => openDialog(menu, event.currentTarget));
  document.querySelector('.menu-close').addEventListener('click', () => closeDialog(menu));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.close()));
  document.querySelector('.detail-close').addEventListener('click', () => closeDialog(detail));
  document.querySelector('#privacy-open').addEventListener('click', event => openDialog(privacy, event.currentTarget));
  document.querySelector('.privacy-close').addEventListener('click', () => closeDialog(privacy));
  [detail, privacy].forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(dialog);
  }));

  const slides = [...document.querySelectorAll('.hero-image')];
  const dots = [...document.querySelectorAll('.slide-buttons button')];
  const labels = ['The Quiet House · Bengaluru', 'Everyday Rituals · Residential', 'The Garden Within · Residential'];
  let current = 0;
  let paused = reduce.matches;
  let timer;
  const pauseButton = document.querySelector('.hero-pause');
  function showSlide(index) {
    current = index;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      dot.setAttribute('aria-pressed', String(i === index));
    });
    document.querySelector('#hero-place').textContent = labels[index];
  }
  function restartSlideshow() {
    clearInterval(timer);
    pauseButton.textContent = paused ? 'Play' : 'Pause';
    pauseButton.setAttribute('aria-label', (paused ? 'Play' : 'Pause') + ' image slideshow');
    if (!paused && !document.hidden) timer = setInterval(() => showSlide((current + 1) % slides.length), 6500);
  }
  dots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); restartSlideshow(); }));
  pauseButton.addEventListener('click', () => { paused = !paused; restartSlideshow(); });
  document.addEventListener('visibilitychange', restartSlideshow);
  reduce.addEventListener('change', () => { paused = reduce.matches; restartSlideshow(); requestMotion(); });
  restartSlideshow();

  const projectData = {
    'quiet-house': { title: 'The Quiet House', category: 'Residential / Bengaluru', image: 'living', type: 'Home', description: 'An apartment reimagined around slow mornings and easy evenings. Warm walnut, tactile stone and a calm layout create a generous backdrop to everyday life.', list: ['An open, connected living and dining plan', 'Natural materials and carefully layered light', 'Storage designed into the architecture'] },
    'common-ground': { title: 'Common Ground', category: 'Workplace / Pune', image: 'workspace', type: 'Workplace', description: 'A creative workplace where focused work and spontaneous conversations can coexist. Flexible gathering spaces meet a warm, grounded material palette.', list: ['A balance of focused and collaborative spaces', 'Acoustic considerations and integrated lighting', 'Furniture and finishes with a clear visual language'] },
    'slow-mornings': { title: 'Slow Mornings', category: 'Hospitality / Goa', image: 'hospitality', type: 'Hospitality', description: 'A neighbourhood café with a welcoming rhythm. A tactile palette, considered seating and warm light make room for a quick coffee or a long conversation.', list: ['A clear guest journey and service flow', 'Characterful materials and a comfortable seating mix', 'Lighting and styling that bring the atmosphere together'] }
  };
  const serviceData = {
    homes: { title: 'Homes, Personally Yours.', category: 'Residential Interior Design', image: 'dining', type: 'Home', description: 'We begin with how you live, then shape the space around it. A considered home brings together practical planning, personal expression and materials that feel good to be around.', list: ['Space planning and design concepts', 'Material, lighting and furniture selections', 'Detailed design and agreed execution reviews'] },
    workplaces: { title: 'Room For Good Work.', category: 'Workplace Interior Design', image: 'workspace', type: 'Workplace', description: 'From independent studios to growing teams, we design workplaces that support the work and reflect the people behind it.', list: ['Workplace planning and collaboration zones', 'Lighting, acoustics and material direction', 'Furniture specification and detailed coordination'] },
    hospitality: { title: 'A Reason To Stay.', category: 'Hospitality Interior Design', image: 'hospitality', type: 'Hospitality', description: 'Atmosphere matters. We connect a clear guest experience with thoughtful operations, creating places that feel distinctive and easy to spend time in.', list: ['Guest journey and operational planning', 'Interior concept and material palette', 'Lighting, furniture and finishing details'] },
    styling: { title: 'The Final, Personal Layer.', category: 'Interior Styling', image: 'bedroom', type: 'Styling', description: 'The right objects can change the feeling of a room. We work with colour, texture, furniture and light to give a space its own quiet character.', list: ['Furniture and decorative lighting selection', 'Artwork, objects and textile direction', 'A considered, room-by-room styling plan'] },
    renovation: { title: 'Familiar Space. Fresh Perspective.', category: 'Renovation & Spatial Reimagining', image: 'courtyard', type: 'Renovation', description: 'Not every new chapter needs a blank canvas. We look for the potential in an existing space and plan what to keep, refine and reimagine.', list: ['Existing-space review and layout strategy', 'Material upgrades and joinery design', 'Phased planning for the agreed scope'] }
  };
  let selectedType = '';
  function showDetail(data, trigger) {
    selectedType = data.type;
    document.querySelector('#detail-title').textContent = data.title;
    document.querySelector('#detail-category').textContent = data.category;
    document.querySelector('#detail-description').textContent = data.description;
    const photo = document.querySelector('#detail-photo');
    photo.src = `assets/${data.image}.webp`;
    photo.alt = data.title + ' interior illustration';
    const list = document.querySelector('#detail-list');
    list.replaceChildren(...data.list.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    openDialog(detail, trigger);
  }
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => showDetail(projectData[button.dataset.project], button)));
  document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => showDetail(serviceData[button.dataset.service], button)));
  document.querySelector('.detail-enquire').addEventListener('click', () => {
    document.querySelector('#project').value = selectedType;
    detail.close();
  });

  const filters = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('.project')];
  filters.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    projects.forEach(project => { project.hidden = filter !== 'all' && project.dataset.category !== filter; });
    document.querySelector('.projects-grid').classList.toggle('is-filtered', filter !== 'all');
    document.querySelector('.work-count').textContent = filter === 'all' ? 'Three spaces to explore' : 'One space to explore';
  }));

  const services = document.querySelector('.services');
  const track = document.querySelector('.services-track');
  const progressBar = document.querySelector('.service-progress span');
  const stories = document.querySelector('.stories');
  const storyCards = [...document.querySelectorAll('.story-card')];
  const storiesTitle = document.querySelector('.stories h2');
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  let queued = false;
  function sectionProgress(section) {
    const rect = section.getBoundingClientRect();
    return clamp(-rect.top / Math.max(1, rect.height - innerHeight), 0, 1);
  }
  function renderMotion() {
    queued = false;
    header.classList.toggle('is-fixed', scrollY > hero.offsetHeight * .8);
    if (reduce.matches) return;
    if (!mobile.matches) {
      const progress = sectionProgress(services);
      const travel = Math.max(0, track.scrollWidth - innerWidth);
      track.style.transform = `translate3d(${-progress * travel}px,0,0)`;
      progressBar.style.width = `${progress * 100}%`;
    } else track.style.removeProperty('transform');
    const progress = sectionProgress(stories);
    storiesTitle.style.transform = `translate3d(${(progress - .5) * (mobile.matches ? -35 : -100)}px,-50%,0)`;
    storyCards.forEach((card, i) => {
      const start = [.13, .58, .97][i];
      const y = (start - progress) * innerHeight * 2.6 - card.offsetHeight * .5;
      card.style.transform = `translate3d(0,${y}px,0)`;
    });
  }
  function requestMotion() { if (!queued) { queued = true; requestAnimationFrame(renderMotion); } }
  addEventListener('scroll', requestMotion, { passive: true });
  addEventListener('resize', requestMotion, { passive: true });
  addEventListener('load', requestMotion);
  requestMotion();
  let keyboardNavigation = false;
  addEventListener('keydown', event => { if (event.key === 'Tab') keyboardNavigation = true; });
  addEventListener('pointerdown', () => { keyboardNavigation = false; });
  track.addEventListener('focusin', event => {
    if (!keyboardNavigation || mobile.matches || reduce.matches) return;
    const panel = event.target.closest('.service-panel');
    if (!panel) return;
    const travel = Math.max(1, track.scrollWidth - innerWidth);
    const progress = clamp((panel.offsetLeft - innerWidth * .15) / travel, 0, 1);
    const top = scrollY + services.getBoundingClientRect().top;
    scrollTo({ top: top + progress * (services.offsetHeight - innerHeight), behavior: 'auto' });
  });
  if (mobile.matches) document.querySelector('.horizontal-hint').firstChild.textContent = 'Swipe To Explore ';

  const counters = [...document.querySelectorAll('[data-count]')];
  const metricObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      metricObserver.unobserve(entry.target);
      if (reduce.matches) return;
      const target = Number(entry.target.dataset.count);
      const start = performance.now();
      function frame(now) {
        const p = clamp((now - start) / 1300, 0, 1);
        entry.target.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
  }, { threshold: .8 });
  counters.forEach(item => metricObserver.observe(item));

  document.querySelector('#enquiry-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const content = ['SOVEN / Project Enquiry', '', `Name: ${data.get('name')}`, `Email: ${data.get('email')}`, `Project type: ${data.get('project') || 'Not specified'}`, `Location: ${data.get('location') || 'Not specified'}`, '', 'Project brief:', data.get('message'), '', 'Prepared locally in the Soven website preview. No details were sent.'].join('\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'Soven-Project-Enquiry.txt';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    form.querySelector('.form-status').textContent = 'Your enquiry file is ready. Save it for your next conversation. No information has been sent.';
  });
  document.querySelector('#year').textContent = String(new Date().getFullYear());
})();
