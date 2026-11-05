/* One submission handler for every Mavocado enquiry form. */
(() => {
 'use strict';
 const recipient = 'hello@mavocado.design';
 const endpoint = 'https://formsubmit.co/ajax/' + recipient;
 const pending = new WeakSet();
 document.querySelectorAll('.footer-eyebrow').forEach(el => {
  if (el.textContent.trim().toLowerCase() === 'quick links') el.textContent = 'QUICK LINKS';
 });
 function statusFor(form) {
  let status = form.querySelector('.form-status,[role="status"]');
  if (!status) {
   status = document.createElement('p'); status.className = 'form-status';
   form.appendChild(status);
  }
  status.setAttribute('role','status'); status.setAttribute('aria-live','polite');
  status.tabIndex = -1;
  return status;
 }
 document.addEventListener('submit', async event => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.action.startsWith('https://formsubmit.co/')) return;
  // Prevent the older page-specific handlers from sending a second request.
  event.preventDefault(); event.stopImmediatePropagation();
  if (pending.has(form) || !form.reportValidity()) return;
  const status = statusFor(form);
  const button = event.submitter || form.querySelector('button[type="submit"],input[type="submit"]');
  const payload = new FormData(form);
  if (String(payload.get('_honey') || '').trim()) return;
  const audit = form.dataset.directForm === 'audit' || Boolean(form.querySelector('[name="review"]'));
  const ebook = form.matches('.ebook-form,.ebook-signup');
  const kind = audit ? 'Free UX Audit Request' : ebook ? 'eBook Request' : 'Project Enquiry';
  payload.set('_subject', 'Mavocado Design — ' + kind);
  payload.set('_template', 'table');
  payload.set('_captcha', 'false');
  payload.set('_url', location.href);
  payload.set('request_type', kind);
  payload.set('page_url', location.href);
  const service = form.querySelector('select[name="service"]');
  if (service) payload.set('service', service.selectedOptions[0]?.textContent || service.value);
  pending.add(form);
  if (button) button.disabled = true;
  form.setAttribute('aria-busy','true');
  status.dataset.state = 'sending'; status.textContent = 'Sending your request…';
  form.querySelectorAll('.enquiry-error').forEach(el => el.hidden = true);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
   const response = await fetch(endpoint, {method:'POST', body:JSON.stringify(Object.fromEntries(payload)), headers:{'Content-Type':'application/json',Accept:'application/json'}, signal:controller.signal});
   const result = await response.json();
   if (!response.ok || (result.success !== true && result.success !== 'true')) {
    throw new Error(result.message || 'The submission service could not accept your request.');
   }
   status.dataset.state = 'success';
   status.textContent = 'Thank you. Your request has been submitted. We’ll reply to the email address you provided.';
   form.reset();
   if (ebook) form.querySelectorAll('.ebook-download').forEach(el => el.hidden = false);
   const panel = form.closest('.contact-form-panel');
   const success = panel?.querySelector('.enquiry-success');
   if (form.hasAttribute('data-contact-form') && success) {
    form.hidden = true;
    const intro = panel.querySelector('.enquiry-intro');
    if (intro) intro.hidden = true;
    const copy = success.querySelector('p');
    if (copy) copy.textContent = 'Thank you. Your enquiry has been submitted. We’ll review the details and reply to the email address you provided.';
    success.hidden = false; success.focus();
   } else status.focus({preventScroll:true});
  } catch (error) {
   status.dataset.state = 'error';
   status.textContent = error.name === 'AbortError'
    ? 'We couldn’t confirm your submission in time. Your details are still here. Try again or email ' + recipient + '.'
    : 'Your request could not be sent. Your details are still here. Try again or email ' + recipient + '.';
   status.focus({preventScroll:true});
  } finally {
   clearTimeout(timer); pending.delete(form);
   if (button) button.disabled = false;
   form.removeAttribute('aria-busy');
  }
 }, true);
})();
