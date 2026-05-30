(function () {
  'use strict';

  var CALENDLY_URL = 'https://calendly.com/neosocle/appel-gratuit';
  var TOTAL_STEPS = 2;

  var state = {
    step: 1,
    besoin: '',
    taille: '',
    submitted: false
  };

  var BESOINS = [
    { id: 'devis',   icon: '◆', label: 'Devis, factures & relances',      sub: 'Automatiser la facturation et les relances clients' },
    { id: 'avis',    icon: '◈', label: 'Avis Google & e-réputation',       sub: 'Collecter et gérer les avis automatiquement' },
    { id: 'synchro', icon: '◉', label: 'Synchro outils',                   sub: 'CRM, agenda, formulaires, paiements connectés' },
    { id: 'autre',   icon: '◎', label: 'Autre besoin d\'automatisation',   sub: 'Un process spécifique à digitaliser' }
  ];

  var TAILLES = [
    { id: 'solo', label: 'Indépendant',   sub: 'Seul ou avec des occasionnels' },
    { id: 'tpe',  label: 'TPE',           sub: '1 – 9 salariés' },
    { id: 'pme',  label: 'PME',           sub: '10 – 49 salariés' },
    { id: 'gr',   label: '50+ personnes', sub: 'Équipe élargie' }
  ];

  /* ─── INJECT ─────────────────────────────────────────────── */
  function inject() {
    if (document.getElementById('ns-mission-modal')) return;

    var style = document.createElement('style');
    style.textContent = [
      '#ns-mission-modal{display:none;position:fixed;inset:0;z-index:1001}',
      '#ns-mission-modal.open{display:block}',
      '.msm-bd{position:absolute;inset:0;background:rgba(28,43,58,.75);backdrop-filter:blur(4px)}',
      '.msm-box{',
        'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);',
        'width:min(560px,94vw);background:#FAF7F2;border-radius:16px;',
        'overflow:hidden;box-shadow:0 28px 72px rgba(0,0,0,.32);',
        'font-family:"Outfit",Arial,sans-serif;',
      '}',
      '@media(max-width:600px){',
        '.msm-box{width:100vw;border-radius:16px 16px 0 0;top:auto;bottom:0;left:0;transform:none;}',
      '}',
      '.msm-head{',
        'display:flex;align-items:center;justify-content:space-between;',
        'padding:18px 22px 14px;border-bottom:1px solid #E8E0D5;background:#FAF7F2;',
      '}',
      '.msm-titles strong{font-family:"Fraunces",Georgia,serif;font-size:15px;font-weight:500;color:#1C2B3A;display:block}',
      '.msm-titles span{font-size:11px;color:#6B7280}',
      '.msm-close{',
        'width:30px;height:30px;border-radius:50%;border:1px solid #E8E0D5;',
        'background:transparent;cursor:pointer;font-size:13px;color:#6B7280;',
        'display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0;',
      '}',
      '.msm-close:hover{background:#1C2B3A;color:#FAF7F2;border-color:#1C2B3A}',
      '.msm-progress{height:3px;background:#E8E0D5;position:relative}',
      '.msm-progress-fill{height:100%;background:#C84B31;transition:width .4s ease}',
      '.msm-body{padding:28px 26px 22px}',
      '.msm-step{display:none}',
      '.msm-step.active{display:block}',
      '.msm-step-label{font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:#C84B31;margin-bottom:8px}',
      '.msm-step-title{font-family:"Fraunces",Georgia,serif;font-size:20px;font-weight:500;color:#1C2B3A;margin-bottom:6px;line-height:1.3}',
      '.msm-step-sub{font-size:13px;color:#6B7280;margin-bottom:22px}',
      '.msm-opts{display:grid;gap:8px}',
      '.msm-opt{',
        'border:1.5px solid #E8E0D5;border-radius:10px;padding:13px 15px;',
        'cursor:pointer;display:flex;align-items:center;gap:12px;',
        'background:#fff;transition:border-color .15s,background .15s;',
        'text-align:left;width:100%;',
      '}',
      '.msm-opt:hover{border-color:#C84B31;background:#FAECEA}',
      '.msm-opt.sel{border-color:#C84B31;background:#FAECEA}',
      '.msm-opt-icon{',
        'width:34px;height:34px;border-radius:8px;background:#FAF7F2;',
        'display:flex;align-items:center;justify-content:center;',
        'font-size:15px;flex-shrink:0;border:1px solid #E8E0D5;color:#6B7280;transition:all .15s;',
      '}',
      '.msm-opt.sel .msm-opt-icon{background:#C84B31;color:#fff;border-color:#C84B31}',
      '.msm-opt-text strong{font-size:13px;font-weight:500;color:#1C2B3A;display:block;line-height:1.3}',
      '.msm-opt-text span{font-size:11px;color:#6B7280}',
      '.msm-opts-2{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
      '@media(max-width:420px){.msm-opts-2{grid-template-columns:1fr}}',
      '.msm-opts-2 .msm-opt{flex-direction:column;align-items:flex-start;gap:4px;padding:14px}',
      '.msm-opts-2 .msm-opt-icon{width:28px;height:28px;font-size:12px;border-radius:6px;font-weight:700;letter-spacing:-.3px}',
      '.msm-err-opt{font-size:11px;color:#ef4444;display:none;margin-top:8px}',
      '.msm-err-opt.show{display:block}',
      '.msm-foot{',
        'display:flex;align-items:center;justify-content:space-between;',
        'padding:14px 26px 22px;gap:12px;',
      '}',
      '.msm-back{',
        'font-size:13px;color:#6B7280;background:none;border:none;cursor:pointer;',
        'padding:10px 0;display:flex;align-items:center;gap:4px;transition:color .15s;',
      '}',
      '.msm-back:hover{color:#1C2B3A}',
      '.msm-back.hidden{visibility:hidden}',
      '.msm-next{',
        'background:#C84B31;color:#fff;border:none;border-radius:9px;',
        'padding:12px 26px;font-family:"Outfit",Arial,sans-serif;font-size:14px;font-weight:500;',
        'cursor:pointer;transition:background .15s,transform .1s;display:flex;align-items:center;gap:7px;',
        'margin-left:auto;',
      '}',
      '.msm-next:hover{background:#9B2C14;transform:translateY(-1px)}',
      '.msm-next:disabled{background:#E8E0D5;color:#9CA3AF;cursor:not-allowed;transform:none}',
      /* Success */
      '.msm-success{text-align:center;padding:36px 26px 32px}',
      '.msm-success-icon{',
        'width:54px;height:54px;background:#FAECEA;border-radius:50%;',
        'display:flex;align-items:center;justify-content:center;margin:0 auto 16px;',
        'font-size:22px;color:#C84B31;font-weight:700;',
      '}',
      '.msm-success h3{font-family:"Fraunces",Georgia,serif;font-size:20px;font-weight:500;color:#1C2B3A;margin-bottom:8px}',
      '.msm-success p{font-size:13px;color:#6B7280;margin-bottom:6px;line-height:1.6}',
      '.msm-success .msm-note{',
        'font-size:11px;color:#9CA3AF;margin-bottom:22px;',
        'display:flex;align-items:center;justify-content:center;gap:5px;',
      '}',
      '.msm-success-cta{',
        'display:inline-flex;align-items:center;gap:8px;',
        'background:#C84B31;color:#fff;border:none;border-radius:9px;',
        'padding:13px 28px;font-family:"Outfit",Arial,sans-serif;font-size:14px;font-weight:500;',
        'text-decoration:none;cursor:pointer;transition:background .15s;',
      '}',
      '.msm-success-cta:hover{background:#9B2C14}',
    ].join('');
    document.head.appendChild(style);

    var el = document.createElement('div');
    el.id = 'ns-mission-modal';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.innerHTML =
      '<div class="msm-bd" id="msm-bd"></div>' +
      '<div class="msm-box" role="document">' +
        '<div class="msm-head">' +
          '<div class="msm-titles">' +
            '<strong id="msm-title">Démarrer ma mission</strong>' +
            '<span id="msm-subtitle">Étape <span id="msm-step-n">1</span> sur 2 — 1 minute</span>' +
          '</div>' +
          '<button class="msm-close" id="msm-close" aria-label="Fermer">✕</button>' +
        '</div>' +
        '<div class="msm-progress"><div class="msm-progress-fill" id="msm-fill" style="width:50%"></div></div>' +
        '<div class="msm-body">' +

          /* STEP 1 — Besoin */
          '<div class="msm-step active" id="msm-s1">' +
            '<div class="msm-step-label">Étape 1 / 2</div>' +
            '<div class="msm-step-title">Votre priorité principale ?</div>' +
            '<div class="msm-step-sub">Sélectionnez le besoin le plus urgent.</div>' +
            '<div class="msm-opts" id="msm-besoins"></div>' +
            '<span class="msm-err-opt" id="msm-err-besoin">Sélectionnez une option</span>' +
          '</div>' +

          /* STEP 2 — Taille */
          '<div class="msm-step" id="msm-s2">' +
            '<div class="msm-step-label">Étape 2 / 2</div>' +
            '<div class="msm-step-title">Taille de votre structure ?</div>' +
            '<div class="msm-step-sub">Cela aide à dimensionner votre mission.</div>' +
            '<div class="msm-opts-2" id="msm-tailles"></div>' +
            '<span class="msm-err-opt" id="msm-err-taille">Sélectionnez une option</span>' +
          '</div>' +

          /* SUCCESS */
          '<div class="msm-step" id="msm-success">' +
            '<div class="msm-success">' +
              '<div class="msm-success-icon">✓</div>' +
              '<h3>C\'est noté !</h3>' +
              '<p>Choisissez votre créneau pour votre<br><strong>appel découverte gratuit de 30 minutes.</strong></p>' +
              '<p class="msm-note">Aucune obligation · Juste une vraie conversation</p>' +
              '<a href="' + CALENDLY_URL + '" target="_blank" rel="noopener" class="msm-success-cta" id="msm-calendly-btn">' +
                'Choisir mon créneau →' +
              '</a>' +
            '</div>' +
          '</div>' +

        '</div>' +
        '<div class="msm-foot" id="msm-foot">' +
          '<button class="msm-back hidden" id="msm-back">← Retour</button>' +
          '<button class="msm-next" id="msm-next">Suivant →</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(el);
    buildOptions();
    bindEvents();
  }

  /* ─── BUILD OPTIONS ──────────────────────────────────────── */
  function buildOptions() {
    var bc = document.getElementById('msm-besoins');
    BESOINS.forEach(function (b) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'msm-opt';
      btn.dataset.id = b.id;
      btn.innerHTML =
        '<div class="msm-opt-icon">' + b.icon + '</div>' +
        '<div class="msm-opt-text"><strong>' + b.label + '</strong><span>' + b.sub + '</span></div>';
      btn.addEventListener('click', function () {
        bc.querySelectorAll('.msm-opt').forEach(function (o) { o.classList.remove('sel'); });
        btn.classList.add('sel');
        state.besoin = b.id;
        document.getElementById('msm-err-besoin').classList.remove('show');
        document.getElementById('msm-next').disabled = false;
      });
      bc.appendChild(btn);
    });

    var tc = document.getElementById('msm-tailles');
    TAILLES.forEach(function (t) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'msm-opt';
      btn.dataset.id = t.id;
      btn.innerHTML =
        '<div class="msm-opt-icon">' + t.label.charAt(0) + '</div>' +
        '<div class="msm-opt-text"><strong>' + t.label + '</strong><span>' + t.sub + '</span></div>';
      btn.addEventListener('click', function () {
        tc.querySelectorAll('.msm-opt').forEach(function (o) { o.classList.remove('sel'); });
        btn.classList.add('sel');
        state.taille = t.id;
        document.getElementById('msm-err-taille').classList.remove('show');
        document.getElementById('msm-next').disabled = false;
      });
      tc.appendChild(btn);
    });
  }

  /* ─── EVENTS ─────────────────────────────────────────────── */
  function bindEvents() {
    document.getElementById('msm-close').addEventListener('click', closeModal);
    document.getElementById('msm-bd').addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
    document.getElementById('msm-next').addEventListener('click', handleNext);
    document.getElementById('msm-back').addEventListener('click', handleBack);

    var selectors = ['a[href*="261174531559056"]', 'a[data-ns-mission]'];
    document.querySelectorAll(selectors.join(',')).forEach(function (a) {
      a.setAttribute('href', '#mission');
      a.removeAttribute('target');
      a.removeAttribute('rel');
      a.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
    });
  }

  /* ─── NAVIGATION ─────────────────────────────────────────── */
  function handleNext() {
    if (state.step === 1) {
      if (!state.besoin) { document.getElementById('msm-err-besoin').classList.add('show'); return; }
      goTo(2);
    } else if (state.step === 2) {
      if (!state.taille) { document.getElementById('msm-err-taille').classList.add('show'); return; }
      submit();
    }
  }

  function handleBack() {
    if (state.step > 1) goTo(state.step - 1);
  }

  function goTo(n) {
    document.getElementById('msm-s' + state.step).classList.remove('active');
    state.step = n;
    document.getElementById('msm-s' + n).classList.add('active');
    updateUI();
  }

  function updateUI() {
    var n = state.step;
    document.getElementById('msm-step-n').textContent = n;
    document.getElementById('msm-fill').style.width = (n / TOTAL_STEPS * 100) + '%';
    document.getElementById('msm-back').classList.toggle('hidden', n === 1);
    document.getElementById('msm-next').textContent = n === TOTAL_STEPS ? 'Confirmer →' : 'Suivant →';
    document.getElementById('msm-next').disabled = (n === 1 && !state.besoin) || (n === 2 && !state.taille);
  }

  /* ─── SUBMIT ─────────────────────────────────────────────── */
  function submit() {
    document.getElementById('msm-s2').classList.remove('active');
    document.getElementById('msm-success').classList.add('active');
    document.getElementById('msm-foot').style.display = 'none';
    document.getElementById('msm-subtitle').textContent = 'Réservez votre créneau';
    document.getElementById('msm-fill').style.width = '100%';

    /* Open Calendly after short pause */
    setTimeout(function () {
      window.open(CALENDLY_URL, '_blank', 'noopener');
    }, 700);

    state.submitted = true;
  }

  /* ─── OPEN / CLOSE ───────────────────────────────────────── */
  function openModal() {
    if (state.submitted) resetModal();
    document.getElementById('ns-mission-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    document.getElementById('ns-mission-modal').classList.remove('open');
    document.body.style.overflow = '';
  }

  function resetModal() {
    state = { step: 1, besoin: '', taille: '', submitted: false };

    ['msm-s1', 'msm-s2'].forEach(function (id) {
      document.getElementById(id).classList.remove('active');
    });
    document.getElementById('msm-success').classList.remove('active');
    document.getElementById('msm-s1').classList.add('active');
    document.getElementById('msm-foot').style.display = '';

    document.querySelectorAll('#msm-besoins .msm-opt, #msm-tailles .msm-opt').forEach(function (o) {
      o.classList.remove('sel');
    });
    document.getElementById('msm-err-besoin').classList.remove('show');
    document.getElementById('msm-err-taille').classList.remove('show');

    document.getElementById('msm-back').classList.add('hidden');
    document.getElementById('msm-next').disabled = false;
    document.getElementById('msm-next').textContent = 'Suivant →';
    document.getElementById('msm-step-n').textContent = '1';
    document.getElementById('msm-fill').style.width = '50%';
    document.getElementById('msm-subtitle').textContent = 'Étape 1 sur 2 — 1 minute';
  }

  /* ─── INIT ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () { inject(); });

})();
