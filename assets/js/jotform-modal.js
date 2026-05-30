(function(){
  var JOTFORM_URL='https://form.jotform.com/261125230398049';
  var opened=false;

  function injectModal(){
    if(document.getElementById('ns-modal')) return;
    var el=document.createElement('div');
    el.id='ns-modal';
    el.setAttribute('role','dialog');
    el.setAttribute('aria-modal','true');
    el.innerHTML=
      '<div class="ns-modal-backdrop" id="ns-modal-backdrop"></div>'+
      '<div class="ns-modal-box">'+
        '<div class="ns-modal-header">'+
          '<div class="ns-modal-title">'+
            '<strong>Rapport personnalis\u00e9 gratuit</strong>'+
            '<span>4 minutes \u00b7 R\u00e9sultat par email</span>'+
          '</div>'+
          '<button class="ns-modal-close" id="ns-modal-close" aria-label="Fermer">\u2715</button>'+
        '</div>'+
        '<div class="ns-modal-body">'+
          '<iframe id="ns-modal-iframe"'+
            ' title="Formulaire NEOSOCLE"'+
            ' allow="geolocation; microphone; camera; fullscreen"'+
            ' allowtransparency="true"'+
            ' frameborder="0"'+
            ' scrolling="yes">'+
          '</iframe>'+
        '</div>'+
      '</div>';
    document.body.appendChild(el);
    document.getElementById('ns-modal-close').addEventListener('click',closeModal);
    document.getElementById('ns-modal-backdrop').addEventListener('click',closeModal);
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();});
  }

  function openModal(){
    document.getElementById('ns-modal').classList.add('ns-modal-open');
    document.body.style.overflow='hidden';
    if(!opened){
      opened=true;
      document.getElementById('ns-modal-iframe').src=JOTFORM_URL;
    }
  }

  function closeModal(){
    document.getElementById('ns-modal').classList.remove('ns-modal-open');
    document.body.style.overflow='';
  }

  function interceptCTAs(){
    document.querySelectorAll('a[href*="261125230398049"]').forEach(function(a){
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
