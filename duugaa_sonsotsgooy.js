// duugaa_sonsotsgooy.js
// Enhanced audio page: single audio playback, lazy-load, visualizer (Web Audio API), filters, search.
// Respects prefers-reduced-motion and uses data-src lazy-loading.

(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const grid = document.getElementById('song-grid');
    const cards = Array.from(document.querySelectorAll('.song-card'));
    const filterForm = document.querySelector('.filter-form');
    const searchInput = document.getElementById('song-search');

    // collect audio elements and play buttons
    const audioEls = Array.from(document.querySelectorAll('.audio'));
    const playBtns = Array.from(document.querySelectorAll('.play-btn'));

    // remember last volume
    const storedVol = Number(localStorage.getItem('audio_volume') || 1);
    audioEls.forEach(a => { a.volume = isNaN(storedVol) ? 1 : storedVol; });

    // Web Audio API visualizer helpers
    let audioCtx = null;
    const analysers = new WeakMap(); // audio element -> analyser node
    const sources = new WeakMap(); // audio element -> media element source
    const rafIds = new WeakMap(); // canvas -> raf id

    function createAudioContext(){
      if(audioCtx) return audioCtx;
      try{
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch(e){ audioCtx = null; }
      return audioCtx;
    }

    function ensureAudioLoaded(audio){
      const src = audio.querySelector('source[data-src]');
      if(src){
        src.src = src.dataset.src;
        src.removeAttribute('data-src');
        audio.load();
        // update download link if present
        const card = audio.closest('.song-card');
        if(card){
          const dl = card.querySelector('.download');
          if(dl) dl.href = src.src;
        }
      }
    }

    // preload when near viewport (for snappy playback)
    if('IntersectionObserver' in window && !prefersReduced){
      const preloadIO = new IntersectionObserver((entries, obs) => {
        entries.forEach(en => {
          if(en.isIntersecting){
            const audio = en.target.querySelector('.audio');
            if(audio) ensureAudioLoaded(audio);
            obs.unobserve(en.target);
          }
        });
      }, {rootMargin: '220px'});
      cards.forEach(c => preloadIO.observe(c));
    }

    // Pause other audios when one plays
    function pauseAllExcept(current){
      audioEls.forEach(a => {
        if(a !== current && !a.paused){
          a.pause();
          const p = a.closest('.song-card') && a.closest('.song-card').querySelector('.play-btn');
          if(p) p.classList.remove('playing');
          if(a.closest('.song-card')) a.closest('.song-card').classList.remove('active');
        }
      });
    }

    // Visualizer draw
    function startVisualizerFor(audio, canvas){
      if(prefersReduced || !canvas) return;
      const ctx = createAudioContext();
      if(!ctx) return;
      // create analyser if not exists
      if(!analysers.has(audio)){
        const source = ctx.createMediaElementSource(audio);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyser.connect(ctx.destination);
        analysers.set(audio, analyser);
        sources.set(audio, source);
      }
      const analyser = analysers.get(audio);
      const dCtx = canvas.getContext('2d');
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      function draw(){
        rafIds.set(canvas, requestAnimationFrame(draw));
        analyser.getByteFrequencyData(dataArray);
        dCtx.clearRect(0,0,canvas.width,canvas.height);
        const barWidth = canvas.width / bufferLength;
        for(let i=0;i<bufferLength;i++){
          const v = dataArray[i] / 255;
          const barHeight = v * canvas.height;
          const x = i * barWidth;
          const grad = dCtx.createLinearGradient(0,0,0,canvas.height);
          grad.addColorStop(0, '#4cc9f0');
          grad.addColorStop(1, '#2f6fdb');
          dCtx.fillStyle = grad;
          dCtx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        }
      }
      // set canvas high-DPI
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.clientWidth * ratio);
      canvas.height = Math.floor(canvas.clientHeight * ratio);
      dCtx.scale(ratio, ratio);
      draw();
    }

    function stopVisualizerFor(canvas){
      const id = rafIds.get(canvas);
      if(id) cancelAnimationFrame(id);
      rafIds.delete(canvas);
      if(canvas){
        const dCtx = canvas.getContext('2d');
        dCtx.clearRect(0,0,canvas.width,canvas.height);
      }
    }

    // Wire play buttons
    playBtns.forEach((btn) => {
      const card = btn.closest('.song-card');
      const audio = card.querySelector('.audio');
      const canvas = card.querySelector('.visualizer');

      // click toggles play/pause
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        ensureAudioLoaded(audio);
        if(audio.paused){
          // resume audio context if suspended (autoplay policies)
          if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(()=>{});
          pauseAllExcept(audio);
          audio.play().catch(()=>{ /* play failed due autoplay */ });
        } else {
          audio.pause();
        }
      });

      // reflect state via audio events
      audio.addEventListener('play', () => {
        btn.classList.add('playing');
        card.classList.add('active');
        pauseAllExcept(audio);
        // visualizer start
        startVisualizerFor(audio, canvas);
        // aria announce
        announce(`Одоо тоглож байна: ${card.querySelector('.song-title').textContent}`);
      });
      audio.addEventListener('pause', () => {
        btn.classList.remove('playing');
        card.classList.remove('active');
        // visualizer stop
        stopVisualizerFor(canvas);
        announce(`Тоглолт зогслоо: ${card.querySelector('.song-title').textContent}`);
      });
      audio.addEventListener('ended', () => {
        btn.classList.remove('playing');
        card.classList.remove('active');
        stopVisualizerFor(canvas);
      });

      audio.addEventListener('volumechange', () => {
        try{ localStorage.setItem('audio_volume', String(audio.volume)); }catch(e){}
      });

      // keyboard: Enter or Space when card focused toggles playback
      card.addEventListener('keydown', (ev) => {
        if(ev.key === 'Enter' || ev.key === ' '){
          ev.preventDefault();
          btn.click();
        }
      });

      // share button (copy link to clipboard with fragment for this card)
      const shareBtn = card.querySelector('.share-btn');
      if(shareBtn){
        shareBtn.addEventListener('click', () => {
          try{
            const url = new URL(window.location.href);
            url.hash = card.id || '';
            navigator.clipboard.writeText(url.toString()).then(()=> {
              flashShare(shareBtn, 'Холбоос хуулагдлаа');
            }).catch(()=> {
              flashShare(shareBtn, 'Хуулж чадсангүй');
            });
          }catch(e){
            flashShare(shareBtn, 'Алдаа');
          }
        });
      }
    });

    function flashShare(el, text){
      const prev = el.textContent;
      el.textContent = text;
      setTimeout(()=> el.textContent = prev, 1400);
    }

    // If user plays audio via browser controls, ensure single-play
    audioEls.forEach(a => {
      a.addEventListener('play', () => pauseAllExcept(a));
    });

    // SEARCH + FILTER
    function applyFilterAndSearch(){
      const cat = filterForm.querySelector('input[name="cat"]:checked').value;
      const q = (searchInput && searchInput.value || '').trim().toLowerCase();
      cards.forEach(c => {
        const matchesCat = (cat === 'all') || c.dataset.category === cat;
        const title = (c.querySelector('.song-title') && c.querySelector('.song-title').textContent || '').toLowerCase();
        const subtitle = (c.querySelector('.song-sub') && c.querySelector('.song-sub').textContent || '').toLowerCase();
        const matchesQuery = !q || title.includes(q) || subtitle.includes(q);
        const show = matchesCat && matchesQuery;
        c.style.display = show ? '' : 'none';
      });
    }

    if(filterForm) filterForm.addEventListener('change', applyFilterAndSearch);
    if(searchInput) searchInput.addEventListener('input', debounce(applyFilterAndSearch, 180));

    // debounce helper
    function debounce(fn, delay=200){
      let t;
      return function(...args){
        clearTimeout(t);
        t = setTimeout(()=> fn.apply(this,args), delay);
      };
    }

    // Reveal animation for cards
    if('IntersectionObserver' in window && !prefersReduced){
      const ro = new IntersectionObserver((entries, obs) => {
        entries.forEach(en => {
          if(en.isIntersecting){
            en.target.classList.add('show');
            obs.unobserve(en.target);
          }
        });
      }, {threshold: 0.12});
      document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
    } else {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('show'));
    }

    // aria-live announcer
    let ariaRegion = document.getElementById('audio-announce');
    if(!ariaRegion){
      ariaRegion = document.createElement('div');
      ariaRegion.id = 'audio-announce';
      ariaRegion.setAttribute('aria-live','polite');
      ariaRegion.className = 'sr-only';
      document.body.appendChild(ariaRegion);
    }
    function announce(text){
      if(!ariaRegion) return;
      ariaRegion.textContent = text;
    }

    // Utility: stop visualizers & audio on pagehide
    window.addEventListener('pagehide', () => {
      audioEls.forEach(a => { try{ a.pause(); }catch(e){} });
      document.querySelectorAll('.visualizer').forEach(stopVisualizerFor);
    });

  }); // DOMContentLoaded
})();
