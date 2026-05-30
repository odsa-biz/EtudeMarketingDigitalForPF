(function () {
  'use strict';

  var CALENDLY_URL = 'https://calendly.com/neosocle/appel-gratuit';

  var state = {
    step: 1,
    nom: '',
    email: '',
    besoin: '',
    taille: '',
    submitted: false
  };

  var BESOINS = [
    { id: 'devis',   icon: '◆', label: 'Devis, factures & relances',           sub: 'Automatiser la facturation et les relances clients' },
    { id: 'avis',    icon: '◈', label: 'Avis Google & e-réputation',            sub: 'Collecter et gérer les avis automatiquement' },
    { id: 'synchro', icon: '◉', label: 'Synchro outils',                        sub: 'CRM, agenda, formulaires, paiements connectés' },
    { id: 'autre',   icon: '◎', label: 'Autre besoin d\'automatisation',        sub: 'Un process spécifique à digitaliser' }
  ];

  var TAILLES = [
    { id: 'solo', label: 'Indépendant',    sub: 'Seul ou avec des occasionnels' },
    { id: 'tpe',  label: 'TPE',            sub: '1 – 9 salariés' },
    { id: 'pme',  label: 'PME',            sub: '10 – 49 salariés' },
    { id: 'gr',   label: '50+ personnes',  sub: 'Équipe élargie' }
  ];

  /* ─── INJECT ─────────────────────────────────────────────── */
  function inject() {
    if (document.getElementById('ns-mission-modal')) return;

    /* Styles inline pour ne pas polluer la CSS partagée */
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

      /* Header */
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

      /* Progress bar */
      '.msm-progress{height:3px;background:#E8E0D5;position:relative}',
      '.msm-progress-fill{height:100%;background:#C84B31;transition:width .4s ease}',

      /* Body */
      '.msm-body{padding:28px 26px 22px}',
      '.msm-step{display:none}',
      '.msm-step.active{display:block}',
      '.msm-step-label{font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:#C84B31;margin-bottom:8px}',
      '.msm-step-title{font-family:"Fraunces",Georgia,serif;font-size:20px;font-weight:500;color:#1C2B3A;margin-bottom:6px;line-height:1.3}',
      '.msm-step-sub{font-size:13px;color:#6B7280;margin-bottom:22px}',

      /* Fields */
      '.msm-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px}',
      '@media(max-width:480px){.msm-row{grid-template-columns:1fr}}',
      '.msm-field{display:flex;flex-direction:column;gap:5px;margin-bottom:14px}',
      '.msm-field label{font-size:12px;font-weight:500;color:#1C2B3A}',
      '.msm-field input{',
        'border:1.5px solid #E8E0D5;border-radius:8px;padding:11px 13px;',
        'font-family:"Outfit",Arial,sans-serif;font-size:14px;color:#1C2B3A;',
        'background:#fff;outline:none;transition:border-color .15s;',
      '}',
      '.msm-field input:focus{border-color:#C84B31}',
      '.msm-field input.err{border-color:#ef4444}',
      '.msm-err{font-size:11px;color:#ef4444;display:none}',
      '.msm-err.show{display:block}',

      /* Option cards */
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
      /* 2-col grid for step 3 */
      '.msm-opts-2{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
      '@media(max-width:420px){.msm-opts-2{grid-template-columns:1fr}}',
      '.msm-opts-2 .msm-opt{flex-direction:column;align-items:flex-start;gap:4px;padding:14px 14px}',
      '.msm-opts-2 .msm-opt-icon{width:28px;height:28px;font-size:13px;border-radius:6px}',

      /* Footer */
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

      /* Success screen */
      '.msm-success{text-align:center;padding:32px 26px 28px}',
      '.msm-success-icon{',
        'width:54px;height:54px;background:#FAECEA;border-radius:50%;',
        'display:flex;align-items:center;justify-content:center;margin:0 auto 16px;',
        'font-size:22px;',
      '}',
      '.msm-success h3{font-family:"Fraunces",Georgia,serif;font-size:20px;font-weight:500;color:#1C2B3A;margin-bottom:8px}',
      '.msm-success p{font-size:13px;color:#6B7280;margin-bottom:20px;line-height:1.6}',
      '.msm-success-cta{',
        'display:inline-flex;align-items:center;gap:8px;',
        'background:#C84B31;color:#fff;border:none;border-radius:9px;',
        'padding:13px 28px;font-family:"Outfit",Arial,sans-serif;font-size:14px;font-weight:500;',
        'text-decoration:none;cursor:pointer;transition:background .15s;',
      '}',
      '.msm-success-cta:hover{background:#9B2C14}',
    ].join('');
    document.head.appendChild(style);

    /* Modal HTML */
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
            '<span id="msm-subtitle">Étape <span id="msm-step-n">1</span> sur 3 — 2 minutes</span>' +
          '</div>' +
          '<button class="msm-close" id="msm-close" aria-label="Fermer">✕</button>' +
        '</div>' +
        '<div class="msm-progress"><div class="msm-progress-fill" id="msm-fill" style="width:33%"></div></div>' +
        '<div class="msm-body">' +

          /* STEP 1 */
          '<div class="msm-step active" id="msm-s1">' +
            '<div class="msm-step-label">Étape 1 / 3</div>' +
            '<div class="msm-step-title">Qui êtes-vous ?</div>' +
            '<div class="msm-step-sub">Pour personnaliser votre appel découverte.</div>' +
            '<div class="msm-row">' +
              '<div class="msm-field">' +
                '<label for="msm-prenom">Prénom *</label>' +
                '<input type="text" id="msm-prenom" autocomplete="given-name" placeholder="Marie">' +
                '<span class="msm-err" id="msm-err-prenom">Prénom requis</span>' +
              '</div>' +
              '<div class="msm-field">' +
                '<label for="msm-nom">Nom *</label>' +
                '<input type="text" id="msm-nom" autocomplete="family-name" placeholder="Dupont">' +
                '<span class="msm-err" id="msm-err-nom">Nom requis</span>' +
              '</div>' +
            '</div>' +
            '<div class="msm-field">' +
              '<label for="msm-email">Email professionnel *</label>' +
              '<input type="email" id="msm-email" autocomplete="email" placeholder="marie@monentreprise.fr">' +
              '<span class="msm-err" id="msm-err-email">Email valide requis</span>' +
            '</div>' +
          '</div>' +

          /* STEP 2 */
          '<div class="msm-step" id="msm-s2">' +
            '<div class="msm-step-label">Étape 2 / 3</div>' +
            '<div class="msm-step-title">Votre priorité principale ?</div>' +
            '<div class="msm-step-sub">Sélectionnez le besoin le plus urgent.</div>' +
            '<div class="msm-opts" id="msm-besoins"></div>' +
            '<span class="msm-err" id="msm-err-besoin" style="margin-top:8px;display:none">Sélectionnez une option</span>' +
          '</div>' +

          /* STEP 3 */
          '<div class="msm-step" id="msm-s3">' +
            '<div class="msm-step-label">Étape 3 / 3</div>' +
            '<div class="msm-step-title">Taille de votre structure ?</div>' +
            '<div class="msm-step-sub">Cela aide à dimensionner votre mission.</div>' +
            '<div class="msm-opts-2" id="msm-tailles"></div>' +
            '<span class="msm-err" id="msm-err-taille" style="margin-top:8px;display:none">Sélectionnez une option</span>' +
          '</div>' +

          /* SUCCESS */
          '<div class="msm-step" id="msm-success" style="padding:0">' +
            '<div class="msm-success">' +
              '<div class="msm-success-icon">✓</div>' +
              '<h3>C\'est noté !</h3>' +
              '<p>Choisissez votre créneau pour votre<br><strong>appel découverte gratuit de 30 minutes.</strong><br>Aucune obligation, juste une vraie conversation.</p>' +
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

  /* ─── BUILD OPTION CARDS ─────────────────────────────────── */
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
        '<div class="msm-opt-icon" style="font-size:11px;font-weight:700;letter-spacing:-.3px">' + t.label.charAt(0) + '</div>' +
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

  /* ─── BIND EVENTS ────────────────────────────────────────── */
  function bindEvents() {
    document.getElementById('msm-close').addEventListener('click', closeModal);
    document.getElementById('msm-bd').addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
    document.getElementById('msm-next').addEventListener('click', handleNext);
    document.getElementById('msm-back').addEventListener('click', handleBack);

    /* Intercepte tous les CTAs Mission + Sur-mesure (Jotform + data attr) */
    var selectors = [
      'a[href*="261174531559056"]',
      'a[data-ns-mission]'
    ];
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
      if (!validateStep1()) return;
      goTo(2);
    } else if (state.step === 2) {
      if (!state.besoin) {
        document.getElementById('msm-err-besoin').classList.add('show');
        return;
      }
      goTo(3);
    } else if (state.step === 3) {
      if (!state.taille) {
        document.getElementById('msm-err-taille').classList.add('show');
        return;
      }
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
    document.getElementById('msm-fill').style.width = (n / 3 * 100) + '%';

    var back = document.getElementById('msm-back');
    var next = document.getElementById('msm-next');

    back.classList.toggle('hidden', n === 1);
    next.textContent = n === 3 ? 'Confirmer →' : 'Suivant →';
    next.disabled = (n === 2 && !state.besoin) || (n === 3 && !state.taille);
  }

  /* ─── VALIDATION ─────────────────────────────────────────── */
  function validateStep1() {
    var prenom = document.getElementById('msm-prenom').value.trim();
    var nom = document.getElementById('msm-nom').value.trim();
    var email = document.getElementById('msm-email').value.trim();
    var ok = true;

    toggle('msm-prenom', 'msm-err-prenom', !prenom); if (!prenom) ok = false;
    toggle('msm-nom', 'msm-err-nom', !nom); if (!nom) ok = false;
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    toggle('msm-email', 'msm-err-email', !emailOk); if (!emailOk) ok = false;

    if (ok) { state.prenom = prenom; state.nom = nom; state.email = email; }
    return ok;
  }

  function toggle(inputId, errId, hasError) {
    var input = document.getElementById(inputId);
    var err = document.getElementById(errId);
    input.classList.toggle('err', hasError);
    err.classList.toggle('show', hasError);
  }

  /* ─── SUBMIT ─────────────────────────────────────────────── */
  function submit() {
    /* Hide steps, show success screen */
    document.getElementById('msm-s3').classList.remove('active');
    document.getElementById('msm-success').classList.add('active');
    document.getElementById('msm-foot').style.display = 'none';
    document.getElementById('msm-subtitle').textContent = 'Réservez votre créneau maintenant';
    document.getElementById('msm-fill').style.width = '100%';

    /* Auto-open Calendly after short delay */
    setTimeout(function () {
      var url = buildCalendlyUrl();
      document.getElementById('msm-calendly-btn').href = url;
      window.open(url, '_blank', 'noopener');
    }, 800);

    state.submitted = true;
  }

  function buildCalendlyUrl() {
    /* Pre-fill Calendly with name and email */
    var params = new URLSearchParams({
      name: state.prenom + ' ' + state.nom,
      email: state.email
    });
    return CALENDLY_URL + '?' + params.toString();
  }

  /* ─── OPEN / CLOSE ───────────────────────────────────────── */
  function openModal() {
    /* Reset if previously submitted */
    if (state.submitted) resetModal();
    document.getElementById('ns-mission-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      var input = document.getElementById('msm-prenom');
      if (input) input.focus();
    }, 100);
  }

  function closeModal() {
    document.getElementById('ns-mission-modal').classList.remove('open');
    document.body.style.overflow = '';
  }

  function resetModal() {
    state = { step: 1, nom: '', prenom: '', email: '', besoin: '', taille: '', submitted: false };

    ['msm-s1', 'msm-s2', 'msm-s3'].forEach(function (id) {
      document.getElementById(id).classList.remove('active');
    });
    document.getElementById('msm-success').classList.remove('active');
    document.getElementById('msm-s1').classList.add('active');
    document.getElementById('msm-foot').style.display = '';

    /* Clear inputs */
    ['msm-prenom', 'msm-nom', 'msm-email'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.value = ''; el.classList.remove('err'); }
    });
    /* Clear selections */
    document.querySelectorAll('#msm-besoins .msm-opt, #msm-tailles .msm-opt').forEach(function (o) {
      o.classList.remove('sel');
    });

    updateUI();
    document.getElementById('msm-back').classList.add('hidden');
    document.getElementById('msm-next').disabled = false;
    document.getElementById('msm-next').textContent = 'Suivant →';
    document.getElementById('msm-step-n').textContent = '1';
    document.getElementById('msm-fill').style.width = '33%';
    document.getElementById('msm-subtitle').textContent = 'Étape 1 sur 3 — 2 minutes';
  }

  /* ─── INIT ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    inject();
  });

})();
