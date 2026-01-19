/* sudalgaanii_sedew.js
   Enhanced: debounced search, filter, pdf preview modal with accessible focus trap,
   improved toast feedback, reveal animations, and graceful fallbacks.
*/

(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // elements
    const searchInput = document.getElementById('site-search');
    const clearBtn = document.getElementById('clear-search');
    const filterSelect = document.getElementById('filter-select');
    const topicsList = document.getElementById('topics-list');
    const previewGrid = document.getElementById('preview-grid');
    const docsList = document.getElementById('docs-list');
    const previewModal = document.getElementById('previewModal');
    const previewFrame = document.getElementById('previewFrame');
    const modalClose = document.querySelector('.modal-close');
    const toast = document.getElementById('toast');
    const openAllBtn = document.getElementById('open-all');

    // small helpers
    const qsa = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
    const qs = (sel, ctx=document) => ctx.querySelector(sel);

    // reveal on scroll
    (function initReveal(){
      const els = qsa('.reveal');
      if('IntersectionObserver' in window && !prefersReduced){
        const io = new IntersectionObserver((entries, obs) => {
          entries.forEach(en => { if(en.isIntersecting){ en.target.classList.add('show'); obs.unobserve(en.target); } });
        }, {threshold:0.12});
        els.forEach(el => io.observe(el));
      } else {
        els.forEach(el => el.classList.add('show'));
      }
    })();

    // debounce
    function debounce(fn, ms=220){
      let t;
      return (...args) => { clearTimeout(t); t = setTimeout(()=> fn.apply(this, args), ms); };
    }

    // unified filter function
    function textMatch(node, q){
      if(!q) return true;
      return (node.textContent || '').toLowerCase().includes(q);
    }
    function applyFilters(){
      const q = (searchInput && searchInput.value || '').trim().toLowerCase();
      const type = filterSelect ? filterSelect.value : 'all';

      // topics
      if(topicsList){
        qsa('li', topicsList).forEach(li => {
          const visible = (type === 'all' || type === 'topic') && textMatch(li, q);
          li.style.display = visible ? '' : 'none';
        });
      }
      // previews
      if(previewGrid){
        qsa('.preview-card', previewGrid).forEach(card => {
          const visible = (type === 'all' || type === 'preview') && textMatch(card, q);
          card.style.display = visible ? '' : 'none';
        });
      }
      // docs
      if(docsList){
        qsa('li', docsList).forEach(li => {
          const visible = (type === 'all' || type === 'doc') && textMatch(li, q);
          li.style.display = visible ? '' : 'none';
        });
      }

      clearBtn && clearBtn.classList.toggle('hidden', q === '');
    }
    const debouncedApply = debounce(applyFilters, 200);
    if(searchInput){
      searchInput.addEventListener('input', debouncedApply);
      clearBtn && clearBtn.addEventListener('click', function(){ searchInput.value=''; applyFilters(); searchInput.focus(); });
    }
    if(filterSelect) filterSelect.addEventListener('change', applyFilters);

    // Preview modal logic (iframe)
    function openPreview(url, title = 'Preview'){
      if(!previewModal || !previewFrame) { window.open(url, '_blank'); return; }
      previewFrame.src = url;
      previewFrame.title = title;
      previewModal.classList.remove('hidden');
      previewModal.setAttribute('aria-hidden','false');
      trapFocus(previewModal);
      // add small loading state
      previewFrame.onload = () => { /* loaded */ };
      previewFrame.onerror = () => { showToast('Preview ачаалсангүй', true); };
    }
    function closePreview(){
      if(!previewModal || !previewFrame) return;
      previewModal.classList.add('hidden');
      previewModal.setAttribute('aria-hidden','true');
      previewFrame.src = '';
      releaseFocusTrap();
    }

    // attach preview buttons
    qsa('.preview-btn').forEach(btn=>{
      btn.addEventListener('click', () => {
        const src = btn.dataset.src;
        if(!src){ showToast('Preview файл олдсонгүй', true); return; }
        // quick existence check (HEAD)
        fetch(src, {method:'HEAD'}).then(res=>{
          if(res.ok) openPreview(src, 'Preview: ' + (btn.closest('li')?.querySelector('h3')?.textContent || 'Document'));
          else window.open(src, '_blank');
        }).catch(()=> openPreview(src));
      });
    });

    modalClose && modalClose.addEventListener('click', closePreview);
    previewModal && previewModal.addEventListener('click', e => { if(e.target === previewModal) closePreview(); });
    document.addEventListener('keydown', e => { if(e.key==='Escape') closePreview(); });

    // Download all: attempt head check for zip; fallback: inform user
    openAllBtn && openAllBtn.addEventListener('click', () => {
      const zipUrl = 'assets/all_resources.zip';
      fetch(zipUrl, {method:'HEAD'}).then(res => {
        if(res.ok) window.location.href = zipUrl;
        else showToast('ZIP файл олдсонгүй эсвэл сервер дээр байрлаагүй байна', true);
      }).catch(()=> showToast('ZIP файл олдсонгүй', true));
    });

    // small toast util
    let toastTimer = null;
    function showToast(msg, isError=false){
      if(!toast) return;
      toast.textContent = msg;
      toast.classList.remove('hidden');
      toast.style.background = isError ? 'linear-gradient(90deg,#ff6b6b,#ff9e9e)' : '';
      clearTimeout(toastTimer);
      toastTimer = setTimeout(()=> { toast.classList.add('hidden'); toast.style.background=''; }, 3000);
    }

    // focus trap helpers
    let lastFocused = null;
    function trapFocus(modal){
      lastFocused = document.activeElement;
      const focusable = modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if(first) first.focus();
      function handle(e){
        if(e.key !== 'Tab') return;
        if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
        else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
      }
      modal._handleKey = handle;
      modal.addEventListener('keydown', handle);
    }
    function releaseFocusTrap(){
      const modal = previewModal;
      if(modal && modal._handleKey) modal.removeEventListener('keydown', modal._handleKey);
      if(lastFocused && lastFocused.focus) lastFocused.focus();
      lastFocused = null;
    }

    // Accessibility: announce visible results count
    (function addLiveRegion(){
      const live = document.createElement('div');
      live.className = 'sr-only';
      live.setAttribute('aria-live','polite');
      document.body.appendChild(live);
      const update = debounce(()=> {
        const visible = document.querySelectorAll('.topic-card:not([style*="display: none"]), .preview-card:not([style*="display: none"]), .docs-list li:not([style*="display: none"])');
        live.textContent = `${visible.length} үр дүн`;
      }, 300);
      searchInput && searchInput.addEventListener('input', update);
      filterSelect && filterSelect.addEventListener('change', update);
    })();

    // Nav toggle (mobile)
    const navToggle = document.querySelector('.nav-toggle');
    const primaryNav = document.getElementById('primary-nav');
    if(navToggle && primaryNav){
      navToggle.addEventListener('click', function(){
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!expanded));
        primaryNav.classList.toggle('open');
      });
    }

    // Expose for debugging
    window.ResearchUI = { applyFilters, openPreview, closePreview, showToast };

  }); // DOMContentLoaded
})();
