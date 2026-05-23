/**
 * Neosocle — Gestion consentement cookies (conforme CNIL / ePrivacy)
 * GA4 chargé UNIQUEMENT après acceptation explicite
 */
(function () {
  const CONSENT_KEY = 'neo_cookie_consent';
  const GA_ID = 'G-RV2ELNWW4X';

  /* --- Charger GA4 --- */
  function loadGA() {
    if (window._gaLoaded) return;
    window._gaLoaded = true;
    var s = document.createElement('script');
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    s.async = true;
    document.head.appendChild(s);
    s.onload = function () {
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', GA_ID, { anonymize_ip: true });
    };
  }

  /* --- Vérifier consentement existant --- */
  var consent = '';
  try { consent = localStorage.getItem(CONSENT_KEY) || ''; } catch (e) {}

  if (consent === 'accepted') { loadGA(); return; }
  if (consent === 'refused') { return; }

  /* --- Afficher le banner --- */
  function showBanner() {
    var el = document.createElement('div');
    el.id = 'neo-cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Gestion des cookies');
    el.innerHTML = [
      '<div class="neo-cb-inner">',
        '<div class="neo-cb-text">',
          '<span class="neo-cb-icon">🍪</span>',
          '<div>',
            '<strong>Ce site utilise des cookies</strong>',
            '<p>Nous utilisons des cookies pour mesurer l\'audience et améliorer notre site.',
            ' <a href="/cookies">En savoir plus</a></p>',
          '</div>',
        '</div>',
        '<div class="neo-cb-actions">',
          '<button id="neo-cb-refuse" onclick="neoCookieRefuse()">Refuser</button>',
          '<button id="neo-cb-accept" onclick="neoCookieAccept()">Accepter</button>',
        '</div>',
      '</div>'
    ].join('');

    var style = document.createElement('style');
    style.textContent = [
      '#neo-cookie-banner{',
        'position:fixed;bottom:0;left:0;right:0;z-index:9999;',
        'background:#1a1a2e;color:#f8f5f0;',
        'padding:16px 24px;',
        'box-shadow:0 -4px 24px rgba(0,0,0,.25);',
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;',
        'font-size:14px;',
      '}',
      '.neo-cb-inner{',
        'max-width:1180px;margin:0 auto;',
        'display:flex;align-items:center;justify-content:space-between;',
        'gap:24px;flex-wrap:wrap;',
      '}',
      '.neo-cb-text{display:flex;align-items:flex-start;gap:12px;flex:1;min-width:200px}',
      '.neo-cb-icon{font-size:20px;flex-shrink:0;margin-top:2px}',
      '.neo-cb-text strong{display:block;margin-bottom:4px;font-size:15px}',
      '.neo-cb-text p{margin:0;opacity:.8;line-height:1.5}',
      '.neo-cb-text a{color:#a78bfa;text-decoration:underline}',
      '.neo-cb-actions{display:flex;gap:10px;flex-shrink:0}',
      '#neo-cb-refuse{',
        'padding:10px 20px;border-radius:6px;border:1px solid rgba(248,245,240,.3);',
        'background:transparent;color:#f8f5f0;cursor:pointer;font-size:14px;font-weight:500;',
        'transition:background .15s;',
      '}',
      '#neo-cb-refuse:hover{background:rgba(248,245,240,.1)}',
      '#neo-cb-accept{',
        'padding:10px 20px;border-radius:6px;border:none;',
        'background:#6d28d9;color:#fff;cursor:pointer;font-size:14px;font-weight:500;',
        'transition:background .15s;',
      '}',
      '#neo-cb-accept:hover{background:#7c3aed}',
      '@media(max-width:600px){',
        '.neo-cb-inner{flex-direction:column}',
        '.neo-cb-actions{width:100%;justify-content:flex-end}',
      '}'
    ].join('');

    document.head.appendChild(style);
    document.body.appendChild(el);
  }

  /* --- Actions boutons --- */
  window.neoCookieAccept = function () {
    try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch (e) {}
    var b = document.getElementById('neo-cookie-banner');
    if (b) b.remove();
    loadGA();
  };

  window.neoCookieRefuse = function () {
    try { localStorage.setItem(CONSENT_KEY, 'refused'); } catch (e) {}
    var b = document.getElementById('neo-cookie-banner');
    if (b) b.remove();
  };

  /* --- Attendre que le DOM soit prêt --- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showBanner);
  } else {
    showBanner();
  }
})();
