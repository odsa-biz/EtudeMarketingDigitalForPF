/**
 * Neosocle — Bandeau cookies CNIL conforme
 * 3 options : Accepter / Refuser / Continuer sans accepter
 * Conforme CNIL (délibération n°2020-091) et RGPD
 */
(function() {
  'use strict';

  var STORAGE_KEY = 'neosocle_cookies_consent';
  var GOOGLE_FONTS_URL = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap';

  // Charger Google Fonts seulement si consentement donné
  function loadGoogleFonts() {
    if (document.querySelector('link[href*="googleapis"]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = GOOGLE_FONTS_URL;
    document.head.appendChild(link);
  }

  // Vérifier le consentement existant
  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch(e) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch(e) {}
  }

  // Appliquer le choix
  function applyConsent(choice) {
    if (choice === 'accepted') {
      loadGoogleFonts();
    }
    // 'refused' ou 'skipped' : polices système utilisées, aucun cookie tiers
  }

  // Fermer et mémoriser le choix
  function handleChoice(choice) {
    setConsent(choice);
    applyConsent(choice);
    var banner = document.getElementById('ns-cookie-banner');
    if (banner) {
      banner.style.transform = 'translateY(100%)';
      banner.style.opacity = '0';
      setTimeout(function() { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 400);
    }
  }

  // Créer le bandeau
  function createBanner() {
    var banner = document.createElement('div');
    banner.id = 'ns-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Gestion des cookies');
    banner.style.cssText = [
      'position:fixed', 'bottom:0', 'left:0', 'right:0', 'z-index:99999',
      'background:#0e0e0e', 'color:#f8f5f0',
      'padding:20px 24px', 'border-top:1px solid rgba(248,245,240,.12)',
      'font-family:system-ui,-apple-system,sans-serif', 'font-size:14px', 'line-height:1.5',
      'transition:transform .4s ease,opacity .4s ease',
      'box-shadow:0 -4px 24px rgba(0,0,0,.3)'
    ].join(';');

    banner.innerHTML = [
      '<div style="max-width:1180px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:16px;justify-content:space-between">',
        '<div style="flex:1;min-width:280px">',
          '<strong style="font-size:15px;color:#fff;display:block;margin-bottom:6px">🍪 Ce site utilise des cookies</strong>',
          '<span style="color:rgba(248,245,240,.7)">',
            'Les polices de caractères (Google Fonts) peuvent déposer des cookies tiers. ',
            'Vous pouvez les accepter, les refuser ou continuer sans vous prononcer. ',
            '<a href="/cookies.html" target="_blank" rel="noopener" style="color:#a5b8ff;text-decoration:underline">En savoir plus</a>.',
          '</span>',
        '</div>',
        '<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;flex-shrink:0">',
          '<button id="ns-skip" style="background:transparent;border:none;color:rgba(248,245,240,.55);font-size:13px;cursor:pointer;text-decoration:underline;padding:4px 0;font-family:inherit">',
            'Continuer sans accepter',
          '</button>',
          '<button id="ns-refuse" style="background:transparent;border:1.5px solid rgba(248,245,240,.3);color:#f8f5f0;font-size:13px;font-weight:600;padding:10px 18px;border-radius:7px;cursor:pointer;font-family:inherit;transition:border-color .15s">',
            'Tout refuser',
          '</button>',
          '<button id="ns-accept" style="background:#1a3cff;color:#fff;border:none;font-size:13px;font-weight:700;padding:10px 20px;border-radius:7px;cursor:pointer;font-family:inherit;transition:background .15s">',
            'Tout accepter',
          '</button>',
        '</div>',
      '</div>'
    ].join('');

    document.body.appendChild(banner);

    document.getElementById('ns-accept').onclick = function() { handleChoice('accepted'); };
    document.getElementById('ns-refuse').onclick = function() { handleChoice('refused'); };
    document.getElementById('ns-skip').onclick = function() { handleChoice('skipped'); };

    // Hover effects
    document.getElementById('ns-refuse').onmouseover = function() { this.style.borderColor = '#f8f5f0'; };
    document.getElementById('ns-refuse').onmouseout = function() { this.style.borderColor = 'rgba(248,245,240,.3)'; };
    document.getElementById('ns-accept').onmouseover = function() { this.style.background = '#0a2bcc'; };
    document.getElementById('ns-accept').onmouseout = function() { this.style.background = '#1a3cff'; };
  }

  // Initialisation
  function init() {
    var existing = getConsent();
    if (existing) {
      applyConsent(existing);
      return; // Pas de bandeau si choix déjà fait
    }
    // Premier chargement : retirer Google Fonts du <head> (remplacé par le consentement)
    var gfLinks = document.querySelectorAll('link[href*="googleapis.com/css"]');
    gfLinks.forEach(function(l) { l.parentNode.removeChild(l); });

    createBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
