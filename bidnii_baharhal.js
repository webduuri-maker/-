(function(){
  document.addEventListener('DOMContentLoaded', function(){
    // NAV TOGGLE
    const navToggle = document.querySelector('.nav-toggle');
    const primaryNav = document.getElementById('primary-nav');

    if(navToggle && primaryNav){
      navToggle.addEventListener('click', function(){
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!expanded));
        primaryNav.classList.toggle('open');
      });

      // close nav on resize to wider screens
      window.addEventListener('resize', function(){
        if(window.innerWidth > 900 && primaryNav.classList.contains('open')){
          primaryNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded','false');
        }
      });
    }

    // LAZY-LOAD (add loading="lazy" to images if not present)
    const images = Array.from(document.querySelectorAll('.gallery-grid img'));
    images.forEach(img => {
      if(!img.hasAttribute('loading')){
        img.setAttribute('loading','lazy');
      }
      // ensure keyboard focus works on figure for accessibility
      const fig = img.closest('figure');
      if(fig && !fig.hasAttribute('tabindex')){
        fig.setAttribute('tabindex','0');
        fig.style.cursor = 'pointer';
      }
    });

    // LIGHTBOX / MODAL
    let currentIndex = -1;
    const figures = Array.from(document.querySelectorAll('.gallery-grid .img-card'));
    const buildLightbox = (index) => {
      const fig = figures[index];
      if(!fig) return null;
      const img = fig.querySelector('img');
      const title = fig.querySelector('h3') ? fig.querySelector('h3').textContent : '';
      const desc = fig.querySelector('p') ? fig.querySelector('p').textContent : '';

      // create modal elements
      const overlay = document.createElement('div');
      overlay.className = 'lightbox';
      overlay.setAttribute('role','dialog');
      overlay.setAttribute('aria-modal','true');
      overlay.setAttribute('aria-label', title || 'Зураг');

      overlay.innerHTML = `
        <div class="lightbox__panel" role="document">
          <img class="lightbox__img" src="${img.src}" alt="${img.alt || title}">
          <div class="lightbox__meta">
            <div>
              <div class="lightbox__title">${escapeHtml(title)}</div>
              <div class="lightbox__desc">${escapeHtml(desc)}</div>
            </div>
            <div>
              <button class="lb-prev" title="Өмнөх (←)">⟨</button>
              <button class="lb-next" title="Дараах (→)">⟩</button>
              <button class="lb-close" title="Хаах (Esc)">✕</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden'; // prevent background scroll

      const close = () => {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
        document.removeEventListener('keydown', onKey);
      };

      const showIndex = (newIndex) => {
        const i = (newIndex + figures.length) % figures.length;
        currentIndex = i;
        const f = figures[i];
        const newImg = f.querySelector('img');
        const panelImg = overlay.querySelector('.lightbox__img');
        const titleEl = overlay.querySelector('.lightbox__title');
        const descEl = overlay.querySelector('.lightbox__desc');
        panelImg.src = newImg.src;
        panelImg.alt = newImg.alt || (f.querySelector('h3') ? f.querySelector('h3').textContent : '');
        titleEl.textContent = f.querySelector('h3') ? f.querySelector('h3').textContent : '';
        descEl.textContent = f.querySelector('p') ? f.querySelector('p').textContent : '';
      };

      const btnPrev = overlay.querySelector('.lb-prev');
      const btnNext = overlay.querySelector('.lb-next');
      const btnClose = overlay.querySelector('.lb-close');

      btnPrev.addEventListener('click', () => showIndex(currentIndex - 1));
      btnNext.addEventListener('click', () => showIndex(currentIndex + 1));
      btnClose.addEventListener('click', close);

      overlay.addEventListener('click', function(e){
        if(e.target === overlay){
          close();
        }
      });

      const onKey = (e) => {
        if(e.key === 'Escape') close();
        if(e.key === 'ArrowLeft') showIndex(currentIndex - 1);
        if(e.key === 'ArrowRight') showIndex(currentIndex + 1);
      };
      document.addEventListener('keydown', onKey);

      // set initial index
      currentIndex = index;

      return { overlay, close, showIndex };
    };

    // helper: open lightbox for a figure index
    const openLightbox = (idx) => {
      // ensure only one modal present at a time
      const existing = document.querySelector('.lightbox');
      if(existing) existing.remove();
      buildLightbox(idx);
    };

    // attach click + key handlers to each figure
    figures.forEach((fig, i) => {
      const img = fig.querySelector('img');
      const trigger = () => openLightbox(i);
      img.addEventListener('click', trigger);
      // support Enter/Space on figure
      fig.addEventListener('keydown', (ev) => {
        if(ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          trigger();
        }
      });
    });

    // UTILS
    function escapeHtml(text){
      if(!text) return '';
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // Optional: IntersectionObserver enhanced lazy loading for browsers without good native support
    if('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            const im = entry.target;
            // if data-src attribute present, swap in
            if(im.dataset.src){
              im.src = im.dataset.src;
              im.removeAttribute('data-src');
            }
            obs.unobserve(im);
          }
        });
      }, {rootMargin: '150px'});

      images.forEach(img => {
        if(img.dataset.src){
          io.observe(img);
        }
      });
    }

  }); // DOMContentLoaded end
})();
