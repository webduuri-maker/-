// surgalt.js
// Interactivity for surgalt.html:
// - toggle details accordion for program cards
// - enroll modal open/submit with simple validation + localStorage save
// - reveal on scroll + accessible keyboard behavior
// - teacher contact copy / smooth interactions
// Respects prefers-reduced-motion.

(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // NAV toggle (if shared)
    const navToggle = document.querySelector('.nav-toggle');
    const primaryNav = document.getElementById('primary-nav');
    if(navToggle && primaryNav){
      navToggle.addEventListener('click', function(){
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!expanded));
        primaryNav.classList.toggle('open');
      });
      window.addEventListener('resize', () => {
        if(window.innerWidth > 900 && primaryNav.classList.contains('open')){
          primaryNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded','false');
        }
      });
    }

    // Scroll reveal
    const reveals = Array.from(document.querySelectorAll('.reveal'));
    if('IntersectionObserver' in window && !prefersReduced){
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if(e.isIntersecting){
            e.target.classList.add('show');
            obs.unobserve(e.target);
          }
        });
      }, {threshold: 0.12});
      reveals.forEach(r => io.observe(r));
    } else {
      reveals.forEach(r => r.classList.add('show'));
    }

    // Program card accordion logic
    const programCards = Array.from(document.querySelectorAll('.program-card'));
    programCards.forEach(card => {
      const detailsBtn = card.querySelector('.details-btn');
      const body = card.querySelector('.card-body');
      // if no explicit body (some cards show inline), skip
      if(!detailsBtn || !body) return;

      detailsBtn.addEventListener('click', ()=> toggleCard(card));
      card.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' '){
          // when focused on card, toggle details
          e.preventDefault();
          toggleCard(card);
        }
      });
    });

    function toggleCard(card){
      const body = card.querySelector('.card-body');
      if(!body) return;
      const wasHidden = body.classList.contains('hidden');
      // close other cards to keep UI tidy
      programCards.forEach(c => {
        const b = c.querySelector('.card-body');
        if(b && c !== card) b.classList.add('hidden');
      });
      if(wasHidden){
        body.classList.remove('hidden');
        // focus first interactive element inside body if any
        const focusable = body.querySelector('button, a, input, select, textarea');
        if(focusable) focusable.focus();
      } else {
        body.classList.add('hidden');
      }
    }

    // Enrollment modal logic
    const modal = document.getElementById('modal');
    const modalPanel = modal && modal.querySelector('.modal-panel');
    const modalTitle = document.getElementById('modal-title');
    const modalClose = document.querySelector('.modal-close');
    const enrollForm = document.getElementById('enroll-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const toast = document.getElementById('toast');

    // Open modal when clicking enroll buttons
    const enrollBtns = Array.from(document.querySelectorAll('.enroll-btn'));
    enrollBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        openModal(e, btn);
      });
    });

    function openModal(e, triggerBtn){
      // set default level based on card
      const card = triggerBtn.closest('.program-card');
      const levelName = card ? (card.querySelector('.card-head h3') && card.querySelector('.card-head h3').textContent) : '';
      if(modalTitle) modalTitle.textContent = `Бүртгүүлэх — ${levelName || ''}`;
      showModal();
      // set select value if available
      const levelSelect = document.getElementById('level');
      if(levelSelect && levelName){
        if(levelName.includes('Анхан')) levelSelect.value = 'Анхан';
        if(levelName.includes('Дунд')) levelSelect.value = 'Дунд';
        if(levelName.includes('Дээд')) levelSelect.value = 'Дээд';
      }
    }

    function showModal(){
      if(!modal) return;
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden','false');
      // trap focus to modal
      trapFocus(modal);
      // focus first input
      const first = modal.querySelector('input,select,button,textarea');
      if(first) first.focus();
    }

    function closeModal(){
      if(!modal) return;
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden','true');
      releaseFocusTrap();
    }

    modalClose && modalClose.addEventListener('click', closeModal);
    cancelBtn && cancelBtn.addEventListener('click', closeModal);

    // close on overlay click
    modal && modal.addEventListener('click', function(e){
      if(e.target === modal) closeModal();
    });

    // form submit
    enrollForm && enrollForm.addEventListener('submit', function(e){
      e.preventDefault();
      const name = enrollForm.name.value.trim();
      const phone = enrollForm.phone.value.trim();
      const level = enrollForm.level.value;
      if(!name || !phone || !level){
        showToast('Бүх талбарыг гүйцэтгэж бөглөнө үү.', true);
        return;
      }
      // very light phone normalization
      const normalized = phone.replace(/\s+/g,'');
      const record = {name, phone:normalized, level, date: new Date().toISOString()};
      // save to localStorage (client-side demo)
      try{
        const key = 'surgalt_enrollments_v1';
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        list.unshift(record);
        localStorage.setItem(key, JSON.stringify(list));
      }catch(err){
        // localStorage save failed
      }
      closeModal();
      enrollForm.reset();
      showToast('Таны хүсэлт хүлээн авагдлаа. Бид таньтай холбогдох болно.');
    });

    // toast helper
    let toastTimer = null;
    function showToast(msg, isError){
      if(!toast) return;
      toast.textContent = msg;
      toast.classList.remove('hidden');
      toast.style.background = isError ? 'linear-gradient(90deg,#ff6b6b,#ff9e9e)' : '';
      clearTimeout(toastTimer);
      toastTimer = setTimeout(()=> {
        toast.classList.add('hidden');
        if(toast) { toast.style.background = ''; }
      }, 3000);
    }

    // accessibility: trap focus in modal
    let focusableNodes = [];
    let lastFocused = null;
    function trapFocus(container){
      lastFocused = document.activeElement;
      focusableNodes = Array.from(container.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])'))
        .filter(n => n.offsetWidth || n.offsetHeight || n.getClientRects().length);
      if(focusableNodes.length){
        const first = focusableNodes[0];
        const last = focusableNodes[focusableNodes.length-1];
        container.addEventListener('keydown', function trap(e){
          if(e.key !== 'Tab') return;
          if(e.shiftKey && document.activeElement === first){
            e.preventDefault();
            last.focus();
          } else if(!e.shiftKey && document.activeElement === last){
            e.preventDefault();
            first.focus();
          }
        });
      }
    }
    function releaseFocusTrap(){
      if(lastFocused && lastFocused.focus) lastFocused.focus();
      focusableNodes = [];
      lastFocused = null;
    }

    // teacher contact copy (click to copy)
    const telLink = document.querySelector('.teacher-card .tel');
    if(telLink){
      telLink.addEventListener('click', function(e){
        // allow default tel behavior on mobile; on others also copy
        if(navigator.clipboard){
          navigator.clipboard.writeText(telLink.textContent.trim()).then(()=> {
            showToast('Утасны дугаар хуулагдлаа');
          }).catch(()=> {
            // ignore
          });
        }
      });
    }

    // keyboard shortcuts (C to open contact modal)
    document.addEventListener('keydown', function(e){
      if(e.key === 'c' || e.key === 'C'){
        const contactBtn = document.getElementById('contact-teacher');
        contactBtn && contactBtn.click();
      }
    });

    // contact teacher -> open enroll modal preselect teacher level blank
    const contactBtn = document.getElementById('contact-teacher');
    if(contactBtn){
      contactBtn.addEventListener('click', function(){
        if(!document.getElementById('modal')) return;
        // set title
        const mt = document.getElementById('modal-title');
        if(mt) mt.textContent = 'Сургалт болон холболт — Ж. Бат-Оргил';
        showModal();
      });
    }

    // simple polyfill for :focus-visible behavior - add focus outline only on keyboard nav
    (function focusVisiblePolyfill(){
      let hadKeyboardEvent = false;
      function handleKeyDown(e){ if(e.key === 'Tab') hadKeyboardEvent = true; }
      function handlePointerDown(){ hadKeyboardEvent = false; }
      window.addEventListener('keydown', handleKeyDown, true);
      window.addEventListener('pointerdown', handlePointerDown, true);
      document.addEventListener('focusin', (e) => {
        if(hadKeyboardEvent) e.target.classList.add('focus-ring');
      });
      document.addEventListener('focusout', (e) => { e.target.classList.remove('focus-ring'); });
    })();

    // close modal on Escape
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){
        if(modal && !modal.classList.contains('hidden')) closeModal();
      }
    });

    // Expose small helper for debugging
    window.Surgalt = {
      openModal: showModal,
      closeModal,
      showToast
    };

  }); // DOMContentLoaded
})();
