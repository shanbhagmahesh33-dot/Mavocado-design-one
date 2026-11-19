/* Google Analytics loads only after an explicit, current analytics opt-in. */
(() => {
  'use strict';
  const id = String(window.MAVOCADO_GA4_ID || '').trim();
  const production = ['mavocado.design', 'www.mavocado.design'].includes(location.hostname);
  if (!/^G-[A-Z0-9]{6,}$/.test(id) || !production) return;
  let configured = false;
  function allowed() { return window.MavocadoPrivacy?.analyticsAllowed() === true; }
  function sync() {
    window['ga-disable-' + id] = !allowed();
    if (!allowed() || configured) return;
    configured = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, {
      page_location: location.origin + location.pathname,
      page_title: document.title,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    tag.dataset.mavocadoAnalytics = 'true';
    document.head.appendChild(tag);
  }
  document.addEventListener('mavocado:consent-change', sync);
  document.addEventListener('click', event => {
    if (!allowed() || !configured) return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link) return;
    const href = link.getAttribute('href') || '';
    const method = href.startsWith('mailto:') ? 'email' : href.startsWith('tel:') ? 'phone' : /^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href) ? 'whatsapp' : null;
    if (method) window.gtag('event', 'contact_click', {contact_method: method});
  });
  document.addEventListener('mavocado:form-success', event => {
    if (!allowed() || !configured) return;
    const kind = event.detail?.kind;
    if (kind === 'ebook') window.gtag('event', 'ebook_request', {});
    else if (kind === 'audit' || kind === 'project') window.gtag('event', 'generate_lead', {lead_type: kind === 'audit' ? 'ux_audit' : 'project_enquiry'});
  });
  sync();
})();
