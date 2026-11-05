(() => {
 'use strict';
 const oldEmail = 'hello@mavocado.in', email = 'hello@mavocado.design';
 function syncEmail() {
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
   if (a.getAttribute('href').includes(oldEmail)) a.setAttribute('href', a.getAttribute('href').replaceAll(oldEmail, email));
  });
  document.querySelectorAll('footer').forEach(footer => {
   const walker = document.createTreeWalker(footer, NodeFilter.SHOW_TEXT);
   while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.nodeValue.includes(oldEmail)) node.nodeValue = node.nodeValue.replaceAll(oldEmail, email);
   }
  });
 }
 syncEmail();
 new MutationObserver(syncEmail).observe(document.body, {childList:true, subtree:true});
 const fine = matchMedia('(hover:hover) and (pointer:fine)');
 if (!fine.matches) return;
 const markup = '<svg aria-hidden="true" viewBox="0 0 48 54"><path d="M7 7Q7 2 12 5L39 22Q46 27 39 31L27 31 19 44Q15 50 12 43Z" fill="#fff" stroke="#202220" stroke-linejoin="round" stroke-width="5"/><path d="M13 12 35 26 24 26 17 39Z" fill="#202220"/></svg><span>You</span>';
 const pointers = new Map();
 function getPointer(container) {
  if (pointers.has(container)) return pointers.get(container);
  const el = document.createElement('div');
  el.className = 'mavocado-pointer';
  el.setAttribute('aria-hidden','true');
  el.innerHTML = markup;
  container.appendChild(el);
  pointers.set(container,el);
  return el;
 }
 const root = document.documentElement;
 getPointer(document.body);
 function hide() {
  root.classList.remove('mavocado-pointer-active');
  pointers.forEach(el => el.classList.remove('is-visible','is-pressed'));
 }
 document.addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse' || !fine.matches) { hide(); return; }
  const target = e.target instanceof Element ? e.target : null;
  if (!target || target.closest('input,textarea,[contenteditable="true"],iframe')) { hide(); return; }
  const container = target.closest('dialog[open]') || document.body;
  const pointer = getPointer(container);
  pointers.forEach(el => { if (el !== pointer) el.classList.remove('is-visible'); });
  pointer.style.transform = 'translate3d('+(e.clientX-7)+'px,'+(e.clientY-5)+'px,0)';
  pointer.classList.toggle('is-link', Boolean(target.closest('a,button,summary,select,[role="button"]')));
  pointer.classList.add('is-visible');
  root.classList.add('mavocado-pointer-active');
 },{passive:true});
 document.addEventListener('pointerdown', () => pointers.forEach(el => el.classList.add('is-pressed')));
 document.addEventListener('pointerup', () => pointers.forEach(el => el.classList.remove('is-pressed')));
 document.addEventListener('pointercancel', hide);
 root.addEventListener('pointerleave', hide);
 window.addEventListener('blur', hide);
 document.addEventListener('visibilitychange', hide);
 document.addEventListener('close', hide, true);
 document.addEventListener('keydown', e => { if (e.key === 'Tab' || e.key === 'Escape') hide(); });
 fine.addEventListener('change', hide);
})();
