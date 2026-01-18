// medee_medeelel.js
// Search + category filter + client-side "load more" + reveal & lazy-load.
// Respects prefers-reduced-motion.

(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Elements
    const searchInput = document.getElementById('news-search');
    const clearBtn = document.getElementById('clear-search');
    const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
    const grid = document.getElementById('news-grid');
    const cards = Array.from(grid.querySelectorAll('.card'));
    const loadMoreBtn = document.getElementById('load-more');

    // client-side pagination
    const PAGE_SIZE = 6;
    let shown = 0;

    // initialize: hide all, then show initial page
    function hideAll(){
      cards.forEach(c => c.classList.add('hidden'));
    }
    function showNext(n = PAGE_SIZE){
      const hiddenCards = cards.filter(c => c.classList.contains('hidden') && !c.dataset.filteredHidden);
      for(let i=0;i<n && i<hiddenCards.length;i++){
        hiddenCards[i].classList.remove('hidden');
        revealElement(hiddenCards[i]);
      }
      shown = cards.filter(c => !c.classList.contains('hidden')).length;
      if(cards.filter(c => c.classList.contains('hidden') && !c.dataset.filteredHidden).length === 0){
        loadMoreBtn.classList.add('hidden');
      } else {
        loadMoreBtn.classList.remove('hidden');
      }
    }

    // search + filter logic
    function applyFilters(){
      const q = (searchInput.value || '').trim().toLowerCase();
      const activeCat = (filterBtns.find(b => b.classList.contains('active')) || {dataset:{cat:'all'}}).dataset.cat;
      cards.forEach(c => {
        const title = (c.dataset.title || '').toLowerCase();
        const cat = (c.dataset.category || '').toLowerCase();
        const matchesQ = !q || title.includes(q) || (c.querySelector('.card-excerpt') && c.querySelector('.card-excerpt').textContent.toLowerCase().includes(q));
        const matchesCat = activeCat === 'all' || cat === activeCat;
        const shouldShow = matchesQ && matchesCat;
        c.dataset.filteredHidden = shouldShow ? '' : '1';
        c.classList.toggle('hidden', true); // hide all, then show via pagination
      });
      // reset pagination and show first page of filtered
      showFilteredFirst();
    }

    function showFilteredFirst(){
      // hide all visually then show first PAGE_SIZE of those with filteredHidden empty
      cards.forEach(c => {
        if(c.dataset.filteredHidden) {
          c.classList.add('hidden');
        } else {
          c.classList.add('hidden');
        }
      });
      const visibleFiltered = cards.filter(c => !c.dataset.filteredHidden);
      for(let i=0;i<Math.min(PAGE_SIZE, visibleFiltered.length); i++){
        visibleFiltered[i].classList.remove('hidden');
        revealElement(visibleFiltered[i]);
      }
      shown = visibleFiltered.filter(c => !c.classList.contains('hidden')).length;
      if(visibleFiltered.length > shown){
        loadMoreBtn.classList.remove('hidden');
      } else {
        loadMoreBtn.classList.add('hidden');
      }
    }

    // debounce helper
    function debounce(fn, delay=250){
      let t;
      return function(...args){
        clearTimeout(t);
        t = setTimeout(()=> fn.apply(this,args), delay);
      };
    }

    // wire search
    if(searchInput){
      searchInput.addEventListener('input', debounce(function(){
        const v = this.value.trim();
        clearBtn.classList.toggle('hidden', v === '');
        applyFilters();
      }, 220));
      clearBtn.addEventListener('click', function(){
        searchInput.value = '';
        clearBtn.classList.add('hidden');
        applyFilters();
        searchInput.focus();
      });
    }

    // wire filters
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function(){
        filterBtns.forEach(b => b.classList.remove('active'));
        filterBtns.forEach(b => b.setAttribute('aria-pressed','false'));
        this.classList.add('active');
        this.setAttribute('aria-pressed','true');
        applyFilters();
      });
    });

    // load more
    if(loadMoreBtn){
      loadMoreBtn.addEventListener('click', function(){
        // show next PAGE_SIZE of currently-filtered-hidden==false
        const visibleFiltered = cards.filter(c => !c.dataset.filteredHidden && c.classList.contains('hidden'));
        for(let i=0;i<PAGE_SIZE && i<visibleFiltered.length; i++){
          visibleFiltered[i].classList.remove('hidden');
          revealElement(visibleFiltered[i]);
        }
        // toggle hidden state of loadmore
        const remaining = cards.filter(c => !c.dataset.filteredHidden && c.classList.contains('hidden')).length;
        if(remaining === 0) loadMoreBtn.classList.add('hidden');
        // smooth scroll to new items if on small screens
        if(window.innerWidth < 700 && visibleFiltered.length > 0){
          visibleFiltered[0].scrollIntoView({behavior:'smooth', block:'center'});
        }
      });
    }

    // reveal + lazy-loading
    const lazyImgs = Array.from(document.querySelectorAll('img.lazy'));
    function revealElement(el){
      if(prefersReduced) {
        el.classList.add('show');
        return;
      }
      el.classList.add('show');
    }

    if('IntersectionObserver' in window && !prefersReduced){
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            const el = entry.target;
            el.classList.add('show');
            // lazy img inside
            const img = el.querySelector('img.lazy');
            if(img && img.dataset.src){
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              img.classList.remove('lazy');
            }
            obs.unobserve(el);
          }
        });
      }, {threshold: 0.12, rootMargin: '120px'});
      document.querySelectorAll('.reveal').forEach(el => io.observe(el));
      // also observe images not inside reveal
      lazyImgs.forEach(img => {
        if(img.dataset.src){
          const imgObs = new IntersectionObserver((entries, iobs) => {
            entries.forEach(e => {
              if(e.isIntersecting){
                const im = e.target;
                im.src = im.dataset.src;
                im.removeAttribute('data-src');
                im.classList.remove('lazy');
                iobs.unobserve(im);
              }
            });
          }, {rootMargin:'200px'});
          imgObs.observe(img);
        }
      });
    } else {
      // fallback: load all images and show
      lazyImgs.forEach(img => {
        if(img.dataset.src) img.src = img.dataset.src;
        img.classList.remove('lazy');
      });
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('show'));
    }

    // initial setup: mark all cards as hidden and clear filteredHidden
    cards.forEach(c => { c.classList.add('hidden'); c.dataset.filteredHidden = ''; });

    // initial show
    showFilteredFirst();

    // Accessibility: keyboard for load more (Enter triggers)
    if(loadMoreBtn){
      loadMoreBtn.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
      });
    }

    // Expose a small helper to re-scan DOM if new cards injected dynamically
    window.NewsHelpers = {
      rescan: function(){
        // re-populate lists (not full implementation; call after DOM changes)
        // For simple usage: reload page
        console.warn('Rescan called. For full dynamic injection, implement re-query of cards and re-run init logic.');
      }
    };

  }); // DOMContentLoaded end
})();
