// uraldaan_bolzol.js
// Page-specific interactivity for uраldaan_bolzol.html:
// - accordion rules
// - toggle open all
// - timeline reveal
// - countdown to next important date (uses nearest future date from timeline items)
// - register modal with validation + localStorage demo
// - copy dates to clipboard, toast notifications
// - respects prefers-reduced-motion

(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Helpers
    function qs(sel, ctx=document){ return ctx.querySelector(sel); }
    function qsa(sel, ctx=document){ return Array.from((ctx||document).querySelectorAll(sel)); }

    // Accordion: rules
    const ruleToggles = qsa('.rule-toggle');
    ruleToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        const body = btn.nextElementSibling;
        if(body) body.classList.toggle('hidden');
      });
    });

    // Toggle All
    const toggleAll = qs('.toggle-all');
    if(toggleAll){
      toggleAll.addEventListener('click', () => {
        const expanded = toggleAll.getAttribute('aria-expanded') === 'true';
        ruleToggles.forEach(btn => {
          btn.setAttribute('aria-expanded', String(!expanded));
          const body = btn.nextElementSibling;
          if(body){
            if(expanded) body.classList.add('hidden'); else body.classList.remove('hidden');
          }
        });
        toggleAll.setAttribute('aria-expanded', String(!expanded));
        toggleAll.textContent = expanded ? 'Бүгдийг нээх' : 'Бүгдийг хаах';
      });
    }

    // Reveal elements on intersection
    if('IntersectionObserver' in window && !prefersReduced){
      const ro = new IntersectionObserver((entries, obs) => {
        entries.forEach(en => {
          if(en.isIntersecting){
            en.target.classList.add('show');
            obs.unobserve(en.target);
          }
        });
      }, {threshold: 0.12});
      qsa('.reveal').forEach(el => ro.observe(el));
    } else {
      qsa('.reveal').forEach(el => el.classList.add('show'));
    }

    // Countdown: find nearest future date in timeline items
    const timelineItems = qsa('.timeline-item');
    const cdTimer = qs('#cd-timer');
    function parseDateString(s){
      // accept YYYY-MM-DD format
      const parts = s.split('-').map(Number);
      if(parts.length===3) return new Date(parts[0], parts[1]-1, parts[2]);
      return new Date(s);
    }
    const futureDates = timelineItems.map(it => {
      return {el: it, date: parseDateString(it.dataset.date)};
    }).filter(o => o.date && o.date > new Date()).sort((a,b)=> a.date - b.date);

    function updateCountdown(){
      if(!cdTimer) return;
      if(futureDates.length === 0){
        cdTimer.textContent = 'Огноо байхгүй';
        return;
      }
      const target = futureDates[0].date;
      const now = new Date();
      let diff = Math.max(0, target - now);
      const days = Math.floor(diff / (1000*60*60*24));
      diff -= days*(1000*60*60*24);
      const hours = Math.floor(diff / (1000*60*60));
      diff -= hours*(1000*60*60);
      const minutes = Math.floor(diff / (1000*60));
      diff -= minutes*(1000*60);
      const seconds = Math.floor(diff/1000);
      cdTimer.textContent = `${days} өдөр ${hours} цаг ${minutes} минут`;
      return;
    }
    updateCountdown();
    let cdInterval = null;
    if(futureDates.length > 0){
      cdInterval = setInterval(updateCountdown, 60*1000); // update every minute
    }

    // Modal register
    const openRegister = qs('#openRegister');
    const registerModal = qs('#registerModal');
    const modalClose = qs('.modal-close');
    const cancelRegister = qs('#cancelRegister');
    const registerForm = qs('#registerForm');
    const toast = qs('#toast');

    function showModal(){
      if(!registerModal) return;
      registerModal.classList.remove('hidden');
      registerModal.setAttribute('aria-hidden','false');
      trapFocus(registerModal);
    }
    function hideModal(){
      if(!registerModal) return;
      registerModal.classList.add('hidden');
      registerModal.setAttribute('aria-hidden','true');
      releaseFocusTrap();
    }
    if(openRegister) openRegister.addEventListener('click', showModal);
    if(modalClose) modalClose.addEventListener('click', hideModal);
    if(cancelRegister) cancelRegister.addEventListener('click', hideModal);
    registerModal && registerModal.addEventListener('click', (e)=> {
      if(e.target === registerModal) hideModal();
    });

    // Basic form submit with client-side validation + localStorage
    if(registerForm){
      registerForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const data = {
          name: registerForm.name.value.trim(),
          age: registerForm.age.value.trim(),
          phone: registerForm.phone.value.trim(),
          email: registerForm.email.value.trim(),
          info: registerForm.info.value.trim(),
          date: (new Date()).toISOString()
        };
        if(!data.name || !data.age || !data.phone){
          showToast('Нэр, нас, утас заавал шаардлагатай', true);
          return;
        }
        try{
          const key = 'uraldaan_registrations_v1';
          const arr = JSON.parse(localStorage.getItem(key) || '[]');
          arr.unshift(data);
          localStorage.setItem(key, JSON.stringify(arr));
        }catch(err){
          // localStorage save failed
        }
        hideModal();
        registerForm.reset();
        showToast('Таны хүсэлтийг хүлээн авлаа. Бид холбогдоно.');
      });
    }

    // Toast
    let toastTimer = null;
    function showToast(msg, isError=false){
      if(!toast) return;
      toast.textContent = msg;
      toast.classList.remove('hidden');
      toast.style.background = isError ? 'linear-gradient(90deg,#ff6b6b,#ff9e9e)' : '';
      clearTimeout(toastTimer);
      toastTimer = setTimeout(()=> {
        toast.classList.add('hidden');
        toast.style.background = '';
      }, 3000);
    }

    // Copy dates to clipboard
    const copyDatesBtn = qs('#copyDates');
    if(copyDatesBtn){
      copyDatesBtn.addEventListener('click', async () => {
        try{
          const lines = timelineItems.map(item => {
            const title = item.querySelector('.ti-title').textContent.trim();
            const date = item.querySelector('.ti-date').textContent.trim();
            return `${title}: ${date}`;
          });
          const txt = lines.join('\n');
          await navigator.clipboard.writeText(txt);
          showToast('Чухал огноог clipboard-д хууллаа');
        }catch(e){
          showToast('Хуулах боломжгүй', true);
        }
      });
    }

    // Nav toggle (re-use simple pattern)
    const navToggle = qs('.nav-toggle');
    const primaryNav = qs('#primary-nav');
    if(navToggle && primaryNav){
      navToggle.addEventListener('click', function(){
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!expanded));
        primaryNav.classList.toggle('open');
      });
      window.addEventListener('resize', () => {
        if(window.innerWidth > 900 && primaryNav.classList.contains('open')) {
          primaryNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded','false');
        }
      });
    }

    // focus trap for modal
    let lastFocused = null;
    let observer = null;
    function trapFocus(modal){
      lastFocused = document.activeElement;
      const focusable = modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled])');
      const first = focusable[0];
      const last = focusable[focusable.length -1];
      if(first) first.focus();
      modal.addEventListener('keydown', handleKeyDown);
      function handleKeyDown(e){
        if(e.key !== 'Tab') return;
        if(e.shiftKey && document.activeElement === first){
          e.preventDefault();
          last.focus();
        } else if(!e.shiftKey && document.activeElement === last){
          e.preventDefault();
          first.focus();
        }
      }
      modal._handleKeyDown = handleKeyDown;
    }
    function releaseFocusTrap(){
      const modal = registerModal;
      if(modal && modal._handleKeyDown) modal.removeEventListener('keydown', modal._handleKeyDown);
      if(lastFocused && lastFocused.focus) lastFocused.focus();
      lastFocused = null;
    }

    // keyboard escape to close modal
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape'){
        if(!registerModal.classList.contains('hidden')) hideModal();
      }
    });

    // Cleanup on unload
    window.addEventListener('unload', function(){
      if(cdInterval) clearInterval(cdInterval);
    });

  }); // DOMContentLoaded
})();
