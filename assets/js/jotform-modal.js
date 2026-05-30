(function(){
  var JOTFORM_ID='261125230398049';
  var formLoaded=false;

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
        '<div class="ns-modal-body" id="ns-modal-body">'+
          '<div id="ns-jotform-container" style="min-height:500px;padding:0 4px;"></div>'+
        '</div>'+
      '</div>';
    document.body.appendChild(el);
    document.getElementById('ns-modal-close').addEventListener('click',closeModal);
    document.getElementById('ns-modal-backdrop').addEventListener('click',closeModal);
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();});
  }

  function loadForm(){
    if(formLoaded) return;
    formLoaded=true;
    var container=document.getElementById('ns-jotform-container');
    if(!container) return;
    var s=document.createElement('script');
    s.type='text/javascript';
    s.src='https://form.jotform.com/jsform/'+JOTFORM_ID;
    container.appendChild(s);
  }

  function openModal(){
    var modal=document.getElementById('ns-modal');
    modal.classList.add('ns-modal-open');
    document.body.style.overflow='hidden';
    loadForm();
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

  document.addEventListener('DOMContentLoaded',function(){
    injectModal();
    interceptCTAs();
  });
})();
