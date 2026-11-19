/* Basic opt-in consent: the analytics tag is never loaded before permission. */
(() => {
  'use strict';
  const KEY = 'mavocado-consent-v1';
  const TTL = 180 * 24 * 60 * 60 * 1000;
  let choice = null;
  let saved = true;
  let trigger = null;
  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (value && value.version === 1 && typeof value.analytics === 'boolean'
        && Number.isFinite(value.savedAt) && Date.now() - value.savedAt >= 0
        && Date.now() - value.savedAt < TTL) return value;
      localStorage.removeItem(KEY);
    } catch { /* Unavailable storage leaves the default choice unset. */ }
    return null;
  }
  choice = read();
  window.MavocadoPrivacy = {
    analyticsAllowed: () => choice?.analytics === true,
    getChoice: () => choice ? {...choice} : null,
    open: () => openSettings(document.activeElement)
  };
  const banner = document.createElement('section');
  banner.className = 'privacy-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie choices');
  banner.hidden = Boolean(choice);
  banner.innerHTML = `<div><h2>Your Privacy Choices</h2><p>We use browser storage for website features. With your permission, optional analytics helps us understand visits and improve the website. Read our <a href="cookies.html">Cookie Policy</a>.</p></div><div class="privacy-actions"><button type="button" class="privacy-action secondary" data-reject-analytics>Reject Analytics</button><button type="button" class="privacy-action" data-accept-analytics>Accept Analytics</button><button type="button" class="privacy-action quiet" data-cookie-settings>Manage Preferences</button></div>`;
  const dialog = document.createElement('dialog');
  dialog.className = 'privacy-dialog';
  dialog.setAttribute('aria-labelledby', 'privacy-settings-title');
  dialog.innerHTML = `<button type="button" class="privacy-close" aria-label="Close cookie preferences">×</button><span class="privacy-eyebrow">YOUR PRIVACY CHOICES</span><h2 id="privacy-settings-title">A little more control.</h2><p>Choose whether to allow optional analytics. You can change your choice at any time through Cookie Settings.</p><div class="privacy-option"><h3>Essential</h3><span>Always Active</span><p>Storage needed to remember this choice and support requested website features. It is not used for optional analytics.</p></div><div class="privacy-option"><h3>Analytics</h3><label class="privacy-switch"><input type="checkbox" id="privacy-analytics"><span>Allow Analytics</span></label><p>Helps us understand visits and website interactions using Google Analytics. Off until you choose to allow it.</p></div><p>Read our <a href="privacy.html">Privacy Policy</a> and <a href="cookies.html">Cookie Policy</a>.</p><div class="privacy-actions"><button type="button" class="privacy-action secondary" data-reject-analytics>Reject Analytics</button><button type="button" class="privacy-action" data-accept-analytics>Accept Analytics</button><button type="button" class="privacy-action secondary" data-save-preferences>Save My Preferences</button></div><p class="privacy-feedback" role="status"></p>`;
  document.body.append(banner, dialog);
  const checkbox = dialog.querySelector('#privacy-analytics');
  function refreshStatus() {
    document.querySelectorAll('[data-consent-status]').forEach(el => {
      el.textContent = choice ? `Your current choice: analytics ${choice.analytics ? 'accepted' : 'rejected'}.` + (saved ? '' : ' This choice could not be saved in this browser.') : 'Optional analytics is off. You have not saved a choice yet.';
    });
  }
  function clearAnalyticsCookies() {
    const names = document.cookie.split(';').map(item => item.split('=')[0].trim()).filter(name => /^_ga(?:_|$)|^_gid$|^_gat/.test(name));
    const host = location.hostname;
    const domains = ['', host, '.' + host, 'mavocado.design', '.mavocado.design'];
    names.forEach(name => domains.forEach(domain => {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? '; Domain=' + domain : ''}`;
    }));
  }
  function closeSettings() {
    if (dialog.open) dialog.close();
  }
  function openSettings(element) {
    trigger = element;
    checkbox.checked = choice?.analytics === true;
    dialog.querySelector('.privacy-feedback').textContent = '';
    if (!dialog.open) dialog.showModal();
  }
  function setChoice(analytics) {
    choice = {version: 1, essential: true, analytics: Boolean(analytics), savedAt: Date.now()};
    saved = true;
    try { localStorage.setItem(KEY, JSON.stringify(choice)); } catch { saved = false; }
    if (!analytics) clearAnalyticsCookies();
    banner.hidden = true;
    checkbox.checked = Boolean(analytics);
    refreshStatus();
    document.dispatchEvent(new CustomEvent('mavocado:consent-change', {detail: {...choice}}));
    closeSettings();
    // The banner is gone; do not leave keyboard focus on its hidden buttons.
    if (!dialog.open && banner.contains(document.activeElement)) {
      const main = document.querySelector('main');
      if (main) { main.setAttribute('tabindex', '-1'); main.focus({preventScroll: true}); }
    }
  }
  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target.closest('button') : null;
    if (!target) return;
    if (target.matches('[data-cookie-settings]')) openSettings(target);
    else if (target.matches('[data-accept-analytics]')) setChoice(true);
    else if (target.matches('[data-reject-analytics]')) setChoice(false);
    else if (target.matches('[data-save-preferences]')) setChoice(checkbox.checked);
  });
  dialog.querySelector('.privacy-close').addEventListener('click', closeSettings);
  dialog.addEventListener('close', () => {
    if (trigger?.isConnected && !banner.contains(trigger)) trigger.focus({preventScroll: true});
    else if (!banner.hidden && trigger?.isConnected) trigger.focus({preventScroll: true});
  });
  window.addEventListener('storage', event => {
    if (event.key !== KEY && event.key !== null) return;
    choice = read();
    banner.hidden = Boolean(choice);
    checkbox.checked = choice?.analytics === true;
    if (!choice?.analytics) clearAnalyticsCookies();
    refreshStatus();
    document.dispatchEvent(new CustomEvent('mavocado:consent-change', {detail: choice || {analytics: false}}));
  });
  refreshStatus();
})();
