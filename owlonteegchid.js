(function(){
  document.addEventListener('DOMContentLoaded', function(){
    // Mobile nav toggle
    const navToggle = document.querySelector('.nav-toggle');
    const primaryNav = document.getElementById('primary-nav');
    if(navToggle && primaryNav){
      navToggle.addEventListener('click', function(){
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!expanded));
        primaryNav.classList.toggle('open');
      });

      // close nav on resize for consistency
      window.addEventListener('resize', function(){
        if(window.innerWidth > 900 && primaryNav.classList.contains('open')){
          primaryNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded','false');
        }
      });
    }

    // Accessibility: make portrait focusable & allow 'P' key to focus it
    const portrait = document.querySelector('.portrait');
    if(portrait && !portrait.hasAttribute('tabindex')){
      portrait.setAttribute('tabindex','0');
      portrait.style.outline = 'none';
    }
    if(portrait){
      document.addEventListener('keydown', function(e){
        if(e.key === 'p' || e.key === 'P'){
          portrait.scrollIntoView({behavior:'smooth', block:'center'});
          try { portrait.focus(); } catch(e){}
        }
      });
    }

    // tel long-press copy (mobile-friendly)
    const tel = document.querySelector('.meta a[href^="tel:"]');
    if(tel){
      let pressTimer = null;
      tel.addEventListener('touchstart', function(){
        pressTimer = setTimeout(()=>{
          const num = tel.getAttribute('href').replace('tel:','');
          if(navigator.clipboard) navigator.clipboard.writeText(num).catch(()=>{});
          tel.setAttribute('data-copied','true');
          setTimeout(()=>tel.removeAttribute('data-copied'),1200);
        },700);
      }, {passive:true});
      tel.addEventListener('touchend', function(){ clearTimeout(pressTimer); }, {passive:true});
    }
  });
})();
