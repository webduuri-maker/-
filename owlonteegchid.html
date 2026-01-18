// owlonteegchid.js
// Adds gentle interactivity: scroll reveal, portrait tilt, and small sparkle celebration on click.
// Respects prefers-reduced-motion and is lightweight.

(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1) Scroll reveal for elements with .reveal
    if('IntersectionObserver' in window && !prefersReduced){
      const ro = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if(e.isIntersecting){
            e.target.classList.add('show');
            obs.unobserve(e.target);
          }
        });
      }, {threshold: 0.12});
      document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
    } else {
      // fallback: show immediately
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('show'));
    }

    // 2) Portrait tilt effect (pointermove)
    const portrait = document.querySelector('.portrait');
    const frame = portrait ? portrait.closest('.portrait-frame') : null;

    if(portrait && !prefersReduced){
      // make portrait float a bit
      portrait.classList.add('floaty');

      let raf = null;
      const onMove = (e) => {
        const rect = portrait.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        const pointerX = (e.clientX ?? (e.touches && e.touches[0].clientX)) || cx;
        const pointerY = (e.clientY ?? (e.touches && e.touches[0].clientY)) || cy;
        const dx = pointerX - cx;
        const dy = pointerY - cy;
        const rx = (dy / rect.height) * -6; // rotateX
        const ry = (dx / rect.width) * 8;   // rotateY
        if(raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(()=> {
          portrait.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
        });
      };
      const onLeave = () => {
        if(raf) cancelAnimationFrame(raf);
        portrait.style.transform = '';
      };
      frame && frame.addEventListener('pointermove', onMove, {passive:true});
      frame && frame.addEventListener('pointerleave', onLeave);
      frame && frame.addEventListener('touchend', onLeave);
    }

    // 3) Small sparkle celebration when portrait clicked (or 'C' pressed).
    // Creates ephemeral SVG circles that fly out and fade.
    function sparkleAt(x,y){
      const n = 12;
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = 0;
      container.style.top = 0;
      container.style.pointerEvents = 'none';
      container.style.zIndex = 9999;
      document.body.appendChild(container);

      for(let i=0;i<n;i++){
        const s = document.createElement('div');
        const size = 6 + Math.random()*12;
        s.style.width = s.style.height = `${size}px`;
        s.style.borderRadius = '50%';
        s.style.position = 'absolute';
        s.style.left = `${x - size/2}px`;
        s.style.top = `${y - size/2}px`;
        // pick color
        const colors = ['#ffd166','#ff6b6b','#4cc9f0','#7bd389','#f78fb3'];
        s.style.background = colors[Math.floor(Math.random()*colors.length)];
        s.style.opacity = '0.98';
        s.style.transform = `translate3d(0,0,0) scale(1)`;
        s.style.transition = `transform ${600 + Math.random()*600}ms cubic-bezier(.2,.9,.2,1), opacity 600ms ease-out`;
        container.appendChild(s);

        // trigger animation
        (function(el,i){
          requestAnimationFrame(()=>{
            const angle = (Math.PI*2) * (i/n);
            const dist = 60 + Math.random()*90;
            const tx = Math.cos(angle) * dist * (0.6 + Math.random()*0.9);
            const ty = Math.sin(angle) * dist * (0.6 + Math.random()*0.9) - 10;
            el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(0.6)`;
            el.style.opacity = '0';
          });
        })(s,i);
      }

      // cleanup
      setTimeout(()=> {
        document.body.removeChild(container);
      }, 1400);
    }

    function celebrate(clientX, clientY){
      if(prefersReduced) return;
      sparkleAt(clientX, clientY);
    }

    if(portrait){
      portrait.addEventListener('click', function(ev){
        const cx = ev.clientX || (window.innerWidth/2);
        const cy = ev.clientY || (window.innerHeight/2);
        celebrate(cx, cy);
        // small accessible feedback
        portrait.setAttribute('aria-pressed','true');
        setTimeout(()=> portrait.removeAttribute('aria-pressed'), 900);
      });
      portrait.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          const rect = portrait.getBoundingClientRect();
          celebrate(rect.left + rect.width/2, rect.top + rect.height/2);
        }
      });
    }

    // keyboard shortcut 'C' for celebration, 'P' for portrait focus (accessible)
    document.addEventListener('keydown', function(e){
      if(e.key === 'c' || e.key === 'C'){
        // center of portrait or center of window
        const rect = portrait ? portrait.getBoundingClientRect() : null;
        const x = rect ? rect.left + rect.width/2 : window.innerWidth/2;
        const y = rect ? rect.top + rect.height/2 : window.innerHeight/2;
        celebrate(x,y);
      }
      if(e.key === 'p' || e.key === 'P'){
        portrait && portrait.focus && portrait.focus({preventScroll:false});
        portrait && portrait.scrollIntoView({behavior:'smooth', block:'center'});
      }
    });

    // 4) small accessibility: ensure portrait is focusable
    if(portrait && !portrait.hasAttribute('tabindex')){
      portrait.setAttribute('tabindex','0');
    }

  }); // DOMContentLoaded
})();
