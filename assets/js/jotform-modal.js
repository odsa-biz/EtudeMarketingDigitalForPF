(function(){
  var FORM_URL='https://form.jotform.com/261125230398049';
  var JOTFORM_ID='261125230398049';

  function injectModal(){
    if(document.getElementById('ns-modal')) return;
    var el=document.createElement('div');
    el.id='ns-modal';
    el.setAttribute('role','dialog');
    el.setAttribute('aria-modal','true');
    el.setAttribute('aria-label','Obtenir mon rapport personnalisé');
    el.innerHTML=
      '<div class="ns-modal-backdrop" id="ns-modal-backdrop"></div>'+
      '<div class="ns-modal-box">'+
        '<div class="ns-modal-header">'+
          '<div class="ns-modal-title">'+
            '<strong>Rapport personnalisé gratuit</strong>'+
            '<span>4 minutes · Résultat par email</span>'+
          '</div>'+
          '<button class="ns-modal-close" id="ns-modal-close" aria-label="Fermer">&#x2715;</button>'+
        '</div>'+
        '<div class="ns-modal-body">'+
          '<iframe id="ns-modal-iframe" src="" title="Formulaire rapport personnalisé NEOSOCLE" frameborder="0" allowfullscreen></iframe>'+
        '</div>'+
      '</div>';
    document.body.appendChild(el);
    document.getElementById('ns-modal-close').addEventListener('click', closeModal);
    document.getElementById('ns-modal-backdrop').addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });
  }

  function openModal(){
    var modal=document.getElementById('ns-modal');
    var iframe=document.getElementById('ns-modal-iframe');
    if(!iframe.src) iframe.src='https://form.jotform.com/'+JOTFORM_ID;
    modal.classList.add('ns-modal-open');
    document.body.style.overflow='hidden';
  }

  function closeModal(){
    var modal=document.getElementById('ns-modal');
    modal.classList.remove('ns-modal-open');
    document.body.style.overflow='';
  }

  function interceptCTAs(){
    document.querySelectorAll('a[href*="'+JOTFORM_ID+'"]').forEach(function(a){
      a.setAttribute('href','#rapport');
      a.removeAttribute('target');
      a.removeAttribute('rel');
      a.addEventListener('click',function(e){
        e.preventDefault();
        openModal();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    injectModal();
    interceptCTAs();
  });
})();
