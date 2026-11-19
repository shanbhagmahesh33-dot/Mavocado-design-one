/* FAQ search, category filtering and legal-page navigation. */
(() => {
  'use strict';
  const input = document.querySelector('#faq-search');
  if (input) {
    let category = 'all';
    const filters = [...document.querySelectorAll('[data-faq-filter]')];
    const groups = [...document.querySelectorAll('[data-faq-group]')];
    const count = document.querySelector('.faq-result-count');
    const empty = document.querySelector('.faq-empty');
    function update() {
      const query = input.value.trim().toLocaleLowerCase();
      let total = 0;
      groups.forEach(group => {
        let visible = 0;
        group.querySelectorAll('.policy-faq-item').forEach(item => {
          const match = (category === 'all' || category === group.dataset.faqGroup)
            && (!query || item.textContent.toLocaleLowerCase().includes(query));
          item.hidden = !match;
          if (match) visible++;
        });
        group.hidden = !visible;
        total += visible;
      });
      count.textContent = `${total} ${total === 1 ? 'question' : 'questions'} ${query ? 'found' : 'to explore'}`;
      empty.hidden = total > 0;
      filters.forEach(button => {
        const active = button.dataset.faqFilter === category;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }
    input.addEventListener('input', update);
    filters.forEach(button => button.addEventListener('click', () => {
      category = button.dataset.faqFilter;
      update();
    }));
    document.querySelector('[data-faq-reset]').addEventListener('click', () => {
      input.value = '';
      category = 'all';
      update();
      input.focus();
    });
  }
  const sections = [...document.querySelectorAll('.policy-section')];
  const links = [...document.querySelectorAll('.policy-sidebar a')];
  if (sections.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const entry = entries.find(item => item.isIntersecting);
      if (!entry) return;
      links.forEach(link => {
        if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, {rootMargin: '-115px 0px -60% 0px', threshold: 0});
    sections.forEach(section => observer.observe(section));
  }
})();
