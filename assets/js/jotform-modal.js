/**
 * NEOSOCLE — Modal Rapport personnalisé gratuit
 * Formulaire custom 5 étapes, envoi webhook Make
 */
(function () {
  'use strict';

  /* ─── CONFIG ─────────────────────────────────────────────── */
  var MAKE_WEBHOOK = 'https://hook.eu2.make.com/VOTRE_WEBHOOK_ICI'; // ← remplacer
  var TOTAL_STEPS  = 5;

  var state = {
    step: 1,
    secteur: '',
    tache: '',
    outils: [],
    taille: '',
    email: '',
    submitted: false
  };

  var SECTEURS = [
    { id: 'sante',      icon: '+',  label: 'Professionnel de santé',      sub: 'Médecin, kiné, vétérinaire, opticien…' },
    { id: 'gestion',    icon: '§',  label: 'Cabinet comptable / gestion', sub: 'Expertise comptable, juridique, RH…' },
    { id: 'commerce',   icon: '◈',  label: 'Commerce / artisan',          sub: 'Boutique, restauration, artisan…' },
    { id: 'autre',      icon: '◎',  label: 'Autre secteur',               sub: 'Prestataire, consultant, autre…' }
  ];

  var TACHES = [
    { id: 'facturation', label: 'Facturation & relances',       sub: 'Devis, factures, rappels de paiement' },
    { id: 'documents',   label: 'Collecte de documents clients',sub: 'Pièces, formulaires, dossiers à compléter' },
    { id: 'agenda',      label: 'Agenda & rappels RDV',         sub: 'Prises de rendez-vous, confirmations' },
    { id: 'avis',        label: 'Avis Google & communication',  sub: 'Demandes d\'avis, suivi clients' },
    { id: 'autre',       label: 'Autre tâche répétitive',       sub: 'Saisies manuelles, copier-coller…' }
  ];

  var OUTILS = [
    { id: 'google',    label: 'Google (Drive, Gmail, Agenda)' },
    { id: 'office',    label: 'Excel / Word / Outlook' },
    { id: 'metier',    label: 'Logiciel métier spécifique' },
    { id: 'nocode',    label: 'Notion / Airtable / autre no-code' },
    { id: 'aucun',     label: 'Pas d\'outils numériques' }
  ];

  var TAILLES = [
    { id: 'solo', label: 'Seul(e)',        sub: 'Indépendant / micro' },
    { id: 'tpe',  label: '2 – 5',          sub: 'personnes' },
    { id: 'pme',  label: '6 – 20',         sub: 'personnes' },
    { id: 'gr',   label: '20+',            sub: 'personnes' }
  ];

  /* ─── STYLES ─────────────────────────────────────────────── */
  function injectStyles() {
    if (document.getElementById('ns-rapport-styles')) return;
    var s = document.createElement('style');
    s.id = 'ns-rapport-styles';
    s.textContent = [
      /* Container */
      '#ns-modal{display:none;position:fixed;inset:0;z-index:1000}',
      '#ns-modal.ns-modal-open{display:block}',
      '.ns-modal-backdrop{position:absolute;inset:0;background:rgba(28,43,58,.75);backdrop-filter:blur(4px)}',
      '.ns-modal-box{',
        'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);',
        'width:min(600px,94vw);background:#FAF7F2;border-radius:16px;',
        'overflow:hidden;box-shadow:0 28px 72px rgba(0,0,0,.3);',
        'font-family:"Outfit",Arial,sans-serif;',
      '}',
      '@media(max-width:600px){',
        '.ns-modal-box{width:100vw;border-radius:16px 16px 0 0;top:auto;bottom:0;left:0;transform:none}',
      '}',
      /* Header */
      '.ns-modal-header{',
        'display:flex;align-items:center;justify-content:space-between;',
        'padding:16px 20px 12px;border-bottom:1px solid #E8E0D5;background:#FAF7F2;flex-shrink:0;',
      '}',
      '.ns-modal-title{display:flex;flex-direction:column;gap:2px}',
      '.ns-modal-title strong{font-family:"Fraunces",Georgia,serif;font-size:15px;font-weight:500;color:#1C2B3A}',
      '.ns-modal-title span{font-size:11px;color:#6B7280}',
      '.ns-modal-close{',
        'width:30px;height:30px;border-radius:50%;border:1px solid #E8E0D5;',
        'background:transparent;cursor:pointer;font-size:13px;color:#6B7280;',
        'display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0;',
      '}',
      '.ns-modal-close:hover{background:#1C2B3A;color:#FAF7F2;border-color:#1C2B3A}',
      /* Progress */
      '.ns-progress{height:3px;background:#E8E0D5}',
      '.ns-progress-fill{height:100%;background:#C84B31;transition:width .35s ease}',
      /* Body */
      '.ns-modal-body{padding:26px 24px 18px}',
      '.ns-step{display:none}',
      '.ns-step.active{display:block}',
      '.ns-step-label{font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:#C84B31;margin-bottom:7px}',
      '.ns-step-title{font-family:"Fraunces",Georgia,serif;font-size:19px;font-weight:500;color:#1C2B3A;margin-bottom:5px;line-height:1.3}',
      '.ns-step-sub{font-size:13px;color:#6B7280;margin-bottom:18px}',
      /* Cards */
      '.ns-opts{display:grid;gap:7px}',
      '.ns-opt{',
        'border:1.5px solid #E8E0D5;border-radius:10px;padding:12px 14px;',
        'cursor:pointer;display:flex;align-items:center;gap:11px;',
        'background:#fff;transition:border-color .12s,background .12s;',
        'text-align:left;width:100%;',
      '}',
      '.ns-opt:hover{border-color:#C84B31;background:#FAECEA}',
      '.ns-opt.sel{border-color:#C84B31;background:#FAECEA}',
      '.ns-opt-icon{',
        'width:32px;height:32px;border-radius:7px;background:#FAF7F2;border:1px solid #E8E0D5;',
        'display:flex;align-items:center;justify-content:center;',
        'font-size:13px;font-weight:700;color:#6B7280;flex-shrink:0;transition:all .12s;',
      '}',
      '.ns-opt.sel .ns-opt-icon{background:#C84B31;color:#fff;border-color:#C84B31}',
      '.ns-opt-text strong{font-size:13px;font-weight:500;color:#1C2B3A;display:block;line-height:1.3}',
      '.ns-opt-text span{font-size:11px;color:#9CA3AF}',
      /* Multi-select (outils) */
      '.ns-multi{display:grid;gap:7px}',
      '.ns-check{',
        'border:1.5px solid #E8E0D5;border-radius:9px;padding:11px 14px;',
        'cursor:pointer;display:flex;align-items:center;gap:10px;',
        'background:#fff;transition:border-color .12s,background .12s;',
        'text-align:left;width:100%;',
      '}',
      '.ns-check:hover{border-color:#C84B31;background:#FAECEA}',
      '.ns-check.sel{border-color:#C84B31;background:#FAECEA}',
      '.ns-check-box{',
        'width:18px;height:18px;border-radius:4px;border:1.5px solid #E8E0D5;',
        'background:#FAF7F2;display:flex;align-items:center;justify-content:center;',
        'flex-shrink:0;transition:all .12s;font-size:10px;color:transparent;',
      '}',
      '.ns-check.sel .ns-check-box{background:#C84B31;border-color:#C84B31;color:#fff}',
      '.ns-check strong{font-size:13px;font-weight:400;color:#1C2B3A}',
      '.ns-multi-hint{font-size:11px;color:#9CA3AF;margin-bottom:12px}',
      /* Taille 2-col */
      '.ns-opts-2{display:grid;grid-template-columns:1fr 1fr;gap:7px}',
      '@media(max-width:400px){.ns-opts-2{grid-template-columns:1fr}}',
      '.ns-opts-2 .ns-opt{flex-direction:column;align-items:flex-start;gap:3px}',
      '.ns-opts-2 .ns-opt-icon{width:28px;height:28px;font-size:13px}',
      '.ns-opts-2 .ns-opt-text strong{font-size:15px;font-weight:600}',
      '.ns-opts-2 .ns-opt-text span{font-size:11px}',
      /* Email step */
      '.ns-email-field{display:flex;flex-direction:column;gap:6px;margin-top:4px}',
      '.ns-email-field label{font-size:12px;font-weight:500;color:#1C2B3A}',
      '.ns-email-input{',
        'border:1.5px solid #E8E0D5;border-radius:9px;padding:12px 14px;',
        'font-family:"Outfit",Arial,sans-serif;font-size:15px;color:#1C2B3A;',
        'background:#fff;outline:none;transition:border-color .15s;',
      '}',
      '.ns-email-input:focus{border-color:#C84B31}',
      '.ns-email-input.err{border-color:#ef4444}',
      '.ns-email-note{font-size:11px;color:#9CA3AF;margin-top:8px;display:flex;align-items:center;gap:5px}',
      '.ns-err{font-size:11px;color:#ef4444;display:none;margin-top:7px}',
      '.ns-err.show{display:block}',
      /* Footer */
      '.ns-foot{',
        'display:flex;align-items:center;justify-content:space-between;',
        'padding:12px 24px 20px;gap:12px;',
      '}',
      '.ns-back{',
        'font-size:13px;color:#6B7280;background:none;border:none;cursor:pointer;',
        'padding:10px 0;transition:color .15s;',
      '}',
      '.ns-back:hover{color:#1C2B3A}',
      '.ns-back.hidden{visibility:hidden}',
      '.ns-next{',
        'background:#C84B31;color:#fff;border:none;border-radius:9px;',
        'padding:12px 24px;font-family:"Outfit",Arial,sans-serif;font-size:14px;font-weight:500;',
        'cursor:pointer;transition:background .15s,transform .1s;margin-left:auto;',
        'display:flex;align-items:center;gap:7px;',
      '}',
      '.ns-next:hover{background:#9B2C14;transform:translateY(-1px)}',
      '.ns-next:disabled{background:#E8E0D5;color:#9CA3AF;cursor:not-allowed;transform:none}',
      /* Success */
      '.ns-success{text-align:center;padding:36px 24px 32px}',
      '.ns-success-icon{',
        'width:52px;height:52px;background:#FAECEA;border-radius:50%;margin:0 auto 14px;',
        'display:flex;align-items:center;justify-content:center;font-size:20px;color:#C84B31;font-weight:700;',
      '}',
      '.ns-success h3{font-family:"Fraunces",Georgia,serif;font-size:20px;font-weight:500;color:#1C2B3A;margin-bottom:8px}',
      '.ns-success p{font-size:13px;color:#6B7280;line-height:1.7;margin-bottom:10px}',
      '.ns-success strong{color:#1C2B3A}',
      /* Loading spinner */
      '.ns-loading{display:none;text-align:center;padding:40px 24px}',
      '.ns-spinner{',
        'width:32px;height:32px;border:3px solid #E8E0D5;border-top-color:#C84B31;',
        'border-radius:50%;animation:ns-spin .7s linear infinite;margin:0 auto 12px;',
      '}',
      '@keyframes ns-spin{to{transform:rotate(360deg)}}',
      '.ns-loading p{font-size:13px;color:#6B7280}',
    ].join('');
    document.head.appendChild(s);
  }

  /* ─── INJECT HTML ────────────────────────────────────────── */
  function injectModal() {
    if (document.getElementById('ns-modal')) return;
    var el = document.createElement('div');
    el.id = 'ns-modal';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.innerHTML =
      '<div class="ns-modal-backdrop" id="ns-bd"></div>' +
      '<div class="ns-modal-box">' +
        '<div class="ns-modal-header">' +
          '<div class="ns-modal-title">' +
            '<strong>Rapport personnalisé gratuit</strong>' +
            '<span>Étape <span id="ns-sn">1</span> sur 5 — reçu en 5 min par email</span>' +
          '</div>' +
          '<button class="ns-modal-close" id="ns-close" aria-label="Fermer">✕</button>' +
        '</div>' +
        '<div class="ns-progress"><div class="ns-progress-fill" id="ns-fill" style="width:20%"></div></div>' +
        '<div class="ns-modal-body">' +

          /* S1 — Secteur */
          '<div class="ns-step active" id="ns-s1">' +
            '<div class="ns-step-label">Étape 1 / 5</div>' +
            '<div class="ns-step-title">Vous travaillez dans quel domaine ?</div>' +
            '<div class="ns-step-sub">Cela détermine les automatisations recommandées.</div>' +
            '<div class="ns-opts" id="ns-secteurs"></div>' +
            '<span class="ns-err" id="ns-e1">Sélectionnez votre secteur</span>' +
          '</div>' +

          /* S2 — Tâche */
          '<div class="ns-step" id="ns-s2">' +
            '<div class="ns-step-label">Étape 2 / 5</div>' +
            '<div class="ns-step-title">Quelle tâche vous prend le plus de temps ?</div>' +
            '<div class="ns-step-sub">La tâche la plus répétitive ou la plus chronophage.</div>' +
            '<div class="ns-opts" id="ns-taches"></div>' +
            '<span class="ns-err" id="ns-e2">Sélectionnez une tâche</span>' +
          '</div>' +

          /* S3 — Outils */
          '<div class="ns-step" id="ns-s3">' +
            '<div class="ns-step-label">Étape 3 / 5</div>' +
            '<div class="ns-step-title">Vous utilisez déjà des outils numériques ?</div>' +
            '<div class="ns-step-sub" style="margin-bottom:10px">Sélectionnez tout ce qui s\'applique.</div>' +
            '<p class="ns-multi-hint">Plusieurs réponses possibles</p>' +
            '<div class="ns-multi" id="ns-outils"></div>' +
            '<span class="ns-err" id="ns-e3">Sélectionnez au moins une option</span>' +
          '</div>' +

          /* S4 — Taille */
          '<div class="ns-step" id="ns-s4">' +
            '<div class="ns-step-label">Étape 4 / 5</div>' +
            '<div class="ns-step-title">Combien êtes-vous dans la structure ?</div>' +
            '<div class="ns-step-sub">Pour calibrer les recommandations.</div>' +
            '<div class="ns-opts-2" id="ns-tailles"></div>' +
            '<span class="ns-err" id="ns-e4">Sélectionnez une option</span>' +
          '</div>' +

          /* S5 — Email */
          '<div class="ns-step" id="ns-s5">' +
            '<div class="ns-step-label">Étape 5 / 5</div>' +
            '<div class="ns-step-title">Où envoyer votre rapport ?</div>' +
            '<div class="ns-step-sub">Vos 3 automatisations prioritaires vous attendent.</div>' +
            '<div class="ns-email-field">' +
              '<label for="ns-email">Votre email professionnel</label>' +
              '<input type="email" id="ns-email" class="ns-email-input" autocomplete="email" placeholder="vous@votreentreprise.fr">' +
              '<p class="ns-email-note">Aucun spam. Uniquement votre rapport personnalisé.</p>' +
            '</div>' +
            '<span class="ns-err" id="ns-e5">Entrez un email valide</span>' +
          '</div>' +

          /* Loading */
          '<div class="ns-loading" id="ns-loading">' +
            '<div class="ns-spinner"></div>' +
            '<p>Génération de votre rapport…</p>' +
          '</div>' +

          /* Success */
          '<div class="ns-step" id="ns-done">' +
            '<div class="ns-success">' +
              '<div class="ns-success-icon">✓</div>' +
              '<h3>Votre rapport est en route !</h3>' +
              '<p>Vérifiez votre boîte mail dans <strong>quelques minutes.</strong><br>' +
              'Vous y trouverez vos <strong>3 automatisations prioritaires</strong><br>personnalisées pour votre activité.</p>' +
              '<p style="font-size:11px;color:#9CA3AF;margin-top:6px">Pensez à vérifier vos spams si vous ne le voyez pas.</p>' +
            '</div>' +
          '</div>' +

        '</div>' +
        '<div class="ns-foot" id="ns-foot">' +
          '<button class="ns-back hidden" id="ns-back">← Retour</button>' +
          '<button class="ns-next" id="ns-next">Suivant →</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(el);
  }

  /* ─── BUILD OPTIONS ──────────────────────────────────────── */
  function buildOptions() {
    /* Secteurs */
    fill('ns-secteurs', SECTEURS, false, function (id) {
      state.secteur = id;
      document.getElementById('ns-e1').classList.remove('show');
    });
    /* Tâches */
    fill('ns-taches', TACHES, false, function (id) {
      state.tache = id;
      document.getElementById('ns-e2').classList.remove('show');
    });
    /* Outils (multi) */
    buildMulti();
    /* Tailles */
    var tc = document.getElementById('ns-tailles');
    TAILLES.forEach(function (t) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ns-opt';
      btn.dataset.id = t.id;
      btn.innerHTML =
        '<div class="ns-opt-icon">' + t.label + '</div>' +
        '<div class="ns-opt-text"><strong>' + t.label + '</strong><span>' + t.sub + '</span></div>';
      btn.addEventListener('click', function () {
        tc.querySelectorAll('.ns-opt').forEach(function (o) { o.classList.remove('sel'); });
        btn.classList.add('sel');
        state.taille = t.id;
        document.getElementById('ns-e4').classList.remove('show');
      });
      tc.appendChild(btn);
    });
  }

  function fill(containerId, items, multi, onSelect) {
    var c = document.getElementById(containerId);
    items.forEach(function (item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ns-opt';
      btn.dataset.id = item.id;
      btn.innerHTML =
        '<div class="ns-opt-icon">' + (item.icon || item.label.charAt(0).toUpperCase()) + '</div>' +
        '<div class="ns-opt-text"><strong>' + item.label + '</strong>' +
        (item.sub ? '<span>' + item.sub + '</span>' : '') + '</div>';
      btn.addEventListener('click', function () {
        if (!multi) c.querySelectorAll('.ns-opt').forEach(function (o) { o.classList.remove('sel'); });
        btn.classList.toggle('sel');
        onSelect(item.id, btn.classList.contains('sel'));
      });
      c.appendChild(btn);
    });
  }

  function buildMulti() {
    var c = document.getElementById('ns-outils');
    OUTILS.forEach(function (o) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ns-check';
      btn.dataset.id = o.id;
      btn.innerHTML =
        '<div class="ns-check-box">✓</div>' +
        '<strong>' + o.label + '</strong>';
      btn.addEventListener('click', function () {
        btn.classList.toggle('sel');
        var idx = state.outils.indexOf(o.id);
        if (btn.classList.contains('sel')) {
          if (idx === -1) state.outils.push(o.id);
          /* Si "aucun" → décocher les autres */
          if (o.id === 'aucun') {
            c.querySelectorAll('.ns-check').forEach(function (b) {
              if (b.dataset.id !== 'aucun') {
                b.classList.remove('sel');
                var i2 = state.outils.indexOf(b.dataset.id);
                if (i2 > -1) state.outils.splice(i2, 1);
              }
            });
          } else {
            var aucunBtn = c.querySelector('[data-id="aucun"]');
            if (aucunBtn) {
              aucunBtn.classList.remove('sel');
              var ia = state.outils.indexOf('aucun');
              if (ia > -1) state.outils.splice(ia, 1);
            }
          }
        } else {
          if (idx > -1) state.outils.splice(idx, 1);
        }
        document.getElementById('ns-e3').classList.remove('show');
      });
      c.appendChild(btn);
    });
  }

  /* ─── EVENTS ─────────────────────────────────────────────── */
  function bindEvents() {
    document.getElementById('ns-close').addEventListener('click', closeModal);
    document.getElementById('ns-bd').addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
    document.getElementById('ns-next').addEventListener('click', handleNext);
    document.getElementById('ns-back').addEventListener('click', handleBack);

    /* Intercept all "Rapport" CTAs */
    document.querySelectorAll('a[href*="261125230398049"]').forEach(function (a) {
      a.setAttribute('href', '#rapport');
      a.removeAttribute('target');
      a.removeAttribute('rel');
      a.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
    });
  }

  /* ─── NAVIGATION ─────────────────────────────────────────── */
  function handleNext() {
    var n = state.step;
    if (n === 1 && !state.secteur)       { show('ns-e1'); return; }
    if (n === 2 && !state.tache)         { show('ns-e2'); return; }
    if (n === 3 && !state.outils.length) { show('ns-e3'); return; }
    if (n === 4 && !state.taille)        { show('ns-e4'); return; }
    if (n === 5) { submitForm(); return; }
    goTo(n + 1);
  }

  function handleBack() { if (state.step > 1) goTo(state.step - 1); }

  function goTo(n) {
    hide('ns-s' + state.step);
    state.step = n;
    show('ns-s' + n, 'active');
    updateUI();
  }

  function updateUI() {
    var n = state.step;
    document.getElementById('ns-sn').textContent = n;
    document.getElementById('ns-fill').style.width = (n / TOTAL_STEPS * 100) + '%';
    document.getElementById('ns-back').classList.toggle('hidden', n === 1);
    var nextBtn = document.getElementById('ns-next');
    nextBtn.textContent = n === TOTAL_STEPS ? 'Recevoir mon rapport →' : 'Suivant →';
    nextBtn.disabled = false;
  }

  /* ─── SUBMIT ─────────────────────────────────────────────── */
  function submitForm() {
    var email = document.getElementById('ns-email').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      show('ns-e5');
      document.getElementById('ns-email').classList.add('err');
      return;
    }
    state.email = email;

    /* Show loading */
    hide('ns-s5');
    document.getElementById('ns-foot').style.display = 'none';
    document.getElementById('ns-fill').style.width = '100%';
    var loading = document.getElementById('ns-loading');
    loading.style.display = 'block';

    /* POST to Make webhook */
    var payload = {
      secteur:  state.secteur,
      tache:    state.tache,
      outils:   state.outils.join(', '),
      taille:   state.taille,
      email:    state.email,
      source:   'rapport-modal',
      date:     new Date().toISOString()
    };

    var req = new XMLHttpRequest();
    req.open('POST', MAKE_WEBHOOK, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function () {
      if (req.readyState === 4) showSuccess();
    };
    req.onerror = function () { showSuccess(); }; /* affiche succès même si erreur réseau */
    req.send(JSON.stringify(payload));

    state.submitted = true;
  }

  function showSuccess() {
    document.getElementById('ns-loading').style.display = 'none';
    show('ns-done', 'active');
  }

  /* ─── OPEN / CLOSE ───────────────────────────────────────── */
  function openModal() {
    if (state.submitted) resetModal();
    document.getElementById('ns-modal').classList.add('ns-modal-open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      var el = document.getElementById('ns-secteurs');
      if (el) el.focus && el.focus();
    }, 100);
  }

  function closeModal() {
    document.getElementById('ns-modal').classList.remove('ns-modal-open');
    document.body.style.overflow = '';
  }

  function resetModal() {
    state = { step: 1, secteur: '', tache: '', outils: [], taille: '', email: '', submitted: false };
    for (var i = 1; i <= TOTAL_STEPS; i++) {
      var el = document.getElementById('ns-s' + i);
      if (el) { el.classList.remove('active'); }
    }
    document.getElementById('ns-done').classList.remove('active');
    document.getElementById('ns-s1').classList.add('active');
    document.getElementById('ns-foot').style.display = '';
    document.getElementById('ns-loading').style.display = 'none';
    document.querySelectorAll('.ns-opt, .ns-check').forEach(function (o) { o.classList.remove('sel'); });
    var emailInput = document.getElementById('ns-email');
    if (emailInput) { emailInput.value = ''; emailInput.classList.remove('err'); }
    document.querySelectorAll('.ns-err').forEach(function (e) { e.classList.remove('show'); });
    document.getElementById('ns-back').classList.add('hidden');
    document.getElementById('ns-next').textContent = 'Suivant →';
    document.getElementById('ns-sn').textContent = '1';
    document.getElementById('ns-fill').style.width = '20%';
  }

  /* ─── HELPERS ────────────────────────────────────────────── */
  function show(id, cls) {
    var el = document.getElementById(id);
    if (el) el.classList.add(cls || 'show');
  }
  function hide(id, cls) {
    var el = document.getElementById(id);
    if (el) el.classList.remove(cls || 'active');
  }

  /* ─── INIT ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    injectStyles();
    injectModal();
    buildOptions();
    bindEvents();
  });

})();
