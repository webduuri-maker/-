document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('primary-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  const profileImg = document.getElementById('profileImage');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.style.display = 'flex';
    lightbox.setAttribute('aria-hidden', 'false');
    lightboxClose.focus();
  }
  function closeLightbox() {
    lightbox.style.display = 'none';
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
  }

  if (profileImg && lightbox) {
    profileImg.addEventListener('click', () => openLightbox(profileImg.src, profileImg.alt));
    profileImg.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(profileImg.src, profileImg.alt);
      }
    });
  }
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.style.display === 'flex') closeLightbox();
    });
  }

  const viewMore = document.getElementById('viewMore');
  if (viewMore) {
    viewMore.addEventListener('click', () => {
      const title = document.getElementById('profile-title');
      if (title) {
        title.scrollIntoView({behavior: 'smooth', block: 'center'});
        title.focus({preventScroll: true});
      }
    });
  }
});
