// holboo_barih.js
// Enhancements for contact page:
// - client-side validation + accessible error messages
// - submit: POST if form.action != "#" else save to localStorage (demo)
// - copy-to-clipboard for email/phone; toast feedback
// - dynamic map loader: if data-lat/data-lng present, loads Leaflet from CDN and shows map
// - lightweight, respects prefers-reduced-motion

(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Elements
    const form = document.querySelector('.contact-form form');
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const messageEl = document.getElementById('message');
    const toastEl = document.getElementById('toast');
    const emailLink = document.querySelector('.info-card a[href^="mailto:"]');
    const phoneText = document.querySelector('.info-card p') && Array.from(document.querySelectorAll('.info-card')).find(c => c.textContent.includes('91919791') || c.textContent.includes('99914009'));
    const mapPlaceholder = document.querySelector('.map-placeholder');

    // show toast
    let toastTimer = null;
    function showToast(msg, duration=2800){
      if(!toastEl) return;
      toastEl.textContent = msg;
      toastEl.classList.remove('hidden');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(()=> toastEl.classList.add('hidden'), duration);
    }

    // simple validators
    function isEmail(v){ return /\S+@\S+\.\S+/.test(v); }
    function validate(){
      let ok = true;
      clearFieldError(nameEl);
      clearFieldError(emailEl);
      clearFieldError(messageEl);

      if(!nameEl.value.trim()){ setFieldError(nameEl, 'Нэр оруулна уу.'); ok = false; }
      if(!emailEl.value.trim() || !isEmail(emailEl.value.trim())){ setFieldError(emailEl, 'Зөв имэйл хаяг оруулна уу.'); ok = false; }
      if(!messageEl.value.trim()){ setFieldError(messageEl, 'Зурвас хоосон байж болохгүй.'); ok = false; }
      return ok;
    }
    function setFieldError(el, msg){
      el.setAttribute('aria-invalid','true');
      let err = el.parentNode.querySelector('.field-error');
      if(!err){
        err = document.createElement('div'); err.className = 'field-error'; err.setAttribute('role','alert');
        el.parentNode.appendChild(err);
      }
      err.textContent = msg;
    }
    function clearFieldError(el){
      el.removeAttribute('aria-invalid');
      const err = el.parentNode.querySelector('.field-error');
      if(err) err.remove();
    }

    // live validation on blur
    [nameEl, emailEl, messageEl].forEach(el => {
      el && el.addEventListener('blur', () => {
        if(el === emailEl && emailEl.value.trim() && !isEmail(emailEl.value.trim())) setFieldError(emailEl, 'Зөв имэйл хаяг түрэхгүй байна.');
        else if(el.value.trim() === '') setFieldError(el, el === messageEl ? 'Зурвас хоосон байна.' : 'Энэ талбар шаардагдана.');
        else clearFieldError(el);
      });
    });

    // submit handler
    if(form){
      form.addEventListener('submit', function(e){
        e.preventDefault();
        if(!validate()){
          // focus first invalid
          const firstInvalid = form.querySelector('[aria-invalid="true"]');
          if(firstInvalid) firstInvalid.focus();
          showToast('Алдаа: талбаруудыг шалгана уу.', 2500);
          return;
        }
        const submitBtn = form.querySelector('button[type="submit"]');
        if(submitBtn) { submitBtn.disabled = true; submitBtn.setAttribute('aria-busy','true'); }

        const payload = {
          name: nameEl.value.trim(),
          email: emailEl.value.trim(),
          message: messageEl.value.trim(),
          ts: new Date().toISOString()
        };

        // If form action present and not '#' try to POST
        const action = form.getAttribute('action') || '#';
        if(action && action !== '#'){
          fetch(action, { method:'POST', headers:{ 'Accept':'application/json' }, body: new FormData(form) })
            .then(resp => {
              if(resp.ok) return resp.json().catch(()=>({ok:true}));
              throw new Error('Network');
            }).then(data => {
              showToast('Мессеж амжилттай илгээлээ. Бид холбогдоно.');
              form.reset();
            }).catch(err => {
              console.warn(err);
              showToast('Илгээхэд алдаа гарлаа. Дараа оролдоно уу.', 3200);
            }).finally(()=>{
              if(submitBtn){ submitBtn.disabled=false; submitBtn.removeAttribute('aria-busy'); }
            });
        } else {
          // demo: save to localStorage
          try{
            const key = 'contact_messages_v1';
            const arr = JSON.parse(localStorage.getItem(key) || '[]');
            arr.unshift(payload);
            localStorage.setItem(key, JSON.stringify(arr));
            showToast('Мессеж амжилттай хадгалагдлаа (локал).');
            form.reset();
          }catch(err){
            console.warn(err);
            showToast('Хадгалах үед алдаа.', 2500);
          } finally {
            if(submitBtn){ submitBtn.disabled=false; submitBtn.removeAttribute('aria-busy'); }
          }
        }
      });
    }

    // copy email / phone to clipboard
    if(emailLink){
      emailLink.addEventListener('click', function(ev){
        // allow normal mailto on mobile; but also copy to clipboard for desktop
        try{
          navigator.clipboard && navigator.clipboard.writeText(emailLink.getAttribute('href').replace('mailto:',''));
          showToast('Имэйл хаяг clipboard-д хуулсан');
        }catch(e){}
      });
    }

    // copy phone when clicking phone card
    const phoneCards = Array.from(document.querySelectorAll('.info-card')).filter(c => c.textContent.match(/\d{2,}/));
    phoneCards.forEach(card => {
      const text = card.textContent.trim();
      if(/91919791/.test(text) || /99914009/.test(text)){
        card.addEventListener('click', function(){
          const numbers = text.match(/(\+?\d[\d\s\-]+)/g);
          if(numbers && numbers.length){
            const num = numbers.join(', ');
            navigator.clipboard && navigator.clipboard.writeText(num);
            showToast('Утасны дугаар clipboard-д хууллаа');
          }
        });
        card.style.cursor = 'pointer';
      }
    });

    // Map loader: if mapPlaceholder has data-lat & data-lng, load Leaflet and render
    (function initMap(){
      if(!mapPlaceholder) return;
      const lat = mapPlaceholder.dataset.lat;
      const lng = mapPlaceholder.dataset.lng;
      if(!lat || !lng) return; // no coords provided; keep placeholder or embed iframe manually

      // load Leaflet CSS+JS dynamically
      const L_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      const L_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      function loadCss(href){ return new Promise((res,rej)=>{ const l = document.createElement('link'); l.rel='stylesheet'; l.href=href; l.onload=res; l.onerror=rej; document.head.appendChild(l); }); }
      function loadScript(src){ return new Promise((res,rej)=>{ const s = document.createElement('script'); s.src=src; s.async=true; s.onload=res; s.onerror=rej; document.body.appendChild(s); }); }

      Promise.all([loadCss(L_CSS), loadScript(L_JS)]).then(()=>{
        try{
          const mapDiv = document.createElement('div');
          mapDiv.style.width = '100%';
          mapDiv.style.height = '100%';
          mapDiv.style.minHeight = '300px';
          mapDiv.style.borderRadius = '10px';
          mapPlaceholder.innerHTML = '';
          mapPlaceholder.appendChild(mapDiv);
          const map = L.map(mapDiv).setView([parseFloat(lat), parseFloat(lng)], 12);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);
          L.marker([parseFloat(lat), parseFloat(lng)]).addTo(map)
            .bindPopup('Орхон аймаг').openPopup();
        }catch(e){ console.warn('Leaflet init fail', e); }
      }).catch(err => {
        console.warn('Leaflet load error', err);
      });
    })();

    // Accessibility: simple keyboard shortcut focus to form (press "c")
    document.addEventListener('keydown', function(e){
      if(e.key === 'c' || e.key === 'C'){
        nameEl && nameEl.focus();
        nameEl && nameEl.scrollIntoView({behavior: prefersReduced ? 'auto' : 'smooth', block: 'center'});
      }
    });

  }); // DOMContentLoaded
})();
