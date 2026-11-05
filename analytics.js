/* GA4 activates only after a real Measurement ID is configured. */
(() => {
 'use strict';
 const id = String(window.MAVOCADO_GA4_ID || '').trim();
 if (!/^G-[A-Z0-9]{6,}$/.test(id) || !['mavocado.design','www.mavocado.design'].includes(location.hostname)) return;
 window.dataLayer = window.dataLayer || [];
 window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
 const tag = document.createElement('script');
 tag.async = true;
 tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
 document.head.appendChild(tag);
 window.gtag('js',new Date());
 window.gtag('config',id,{
  page_location:location.origin + location.pathname,
  page_title:document.title,
  allow_google_signals:false,
  allow_ad_personalization_signals:false
 });
 document.addEventListener('click',event => {
  const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
  if (!link) return;
  const href = link.getAttribute('href') || '';
  const method = href.startsWith('mailto:') ? 'email' : href.startsWith('tel:') ? 'phone' : /^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href) ? 'whatsapp' : null;
  if (method) window.gtag('event','contact_click',{contact_method:method});
 });
 document.addEventListener('mavocado:form-success',event => {
  const kind = event.detail?.kind;
  if (kind === 'ebook') window.gtag('event','ebook_request',{});
  else if (kind === 'audit' || kind === 'project') window.gtag('event','generate_lead',{lead_type:kind === 'audit' ? 'ux_audit' : 'project_enquiry'});
 });
})();
