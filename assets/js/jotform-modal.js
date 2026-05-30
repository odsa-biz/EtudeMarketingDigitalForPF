(function(){
  var JOTFORM_URL='https://form.jotform.com/261125230398049';

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
          '<div class="ns-modal-loader" id="ns-modal-loader">Chargement du formulaire\u2026</div>'+
          '<iframe id="ns-modal-iframe"'+
            ' src=""'+
            ' title="Formulaire rapport NEOSOCLE"'+
            ' allow="geolocation; microphone; camera; fullscreen"'+
            ' allowtransparency="true"'+
            ' frameborder="0"'+
            ' scrolling="yes"'+
            ' style="display:none;width:100%;height:580px;border:none;">'+
          '</iframe>'+
        '</div>'+
      '</div>';
    document.body.appendChild(el);
    document.getElementById('ns-modal-close').addEventListener('click',closeModal);
    document.getElementById('ns-modal-backdrop').addEventListener('click',closeModal);
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();});

    var iframe=document.getElementById('ns-modal-iframe');
    iframe.addEventListener('load',function(){
      if(!iframe.src||iframe.src==='about:blank') return;
      document.getElementById('ns-modal-loader').style.display='none';
      iframe.style.display='block';
    });
  }

  function openModal(){
    var modal=document.getElementById('ns-modal');
    var iframe=document.getElementById('ns-modal-iframe');
    modal.classList.add('ns-modal-open');
    document.body.style.overflow='hidden';
    if(!iframe.src||iframe.src==='about:blank'||iframe.src===''){
      iframe.src=JOTFORM_URL;
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
