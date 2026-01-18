/* ============================================
   COMPLETE JAVASCRIPT IMPLEMENTATION (UPDATED)
   Баянбараатын Дөмөн Аялгуу Website
   ============================================ */

/* CHANGES/ADDITIONS SUMMARY (top):
 - Defensive checks added so script runs on pages without a carousel or specific IDs.
 - Mobile navigation unified to support both index (#hamburger / #navMenu) and other pages (.nav-toggle / #primary-nav).
 - Added keyboard accessibility for carousel indicators and better focus handling.
 - Added "pause other audio" behavior: only one audio element will play at a time.
 - Improved lazy-loading fallback and ensured IntersectionObserver guards.
 - Added comments marking what changed where.
*/

document.addEventListener('DOMContentLoaded', function() {

    // =========================
    // 0. SAFE HELPERS
    // =========================

    // Small helper to find first element safely
    function $(selector) {
        return document.querySelector(selector);
    }

    // Debounce helper
    function debounce(fn, wait = 100) {
        let t;
        return function () {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, arguments), wait);
        };
    }

    // =========================
    // 1. CAROUSEL FUNCTIONALITY (robust)
    // =========================

    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    let currentSlide = 0;
    let autoSlideInterval;
    const AUTO_DELAY = 10000; // 10 seconds

    // Guard: only initialize carousel if slides present
    if (slides.length && indicatorsContainer) {

        // Create carousel indicators dynamically (only if container exists)
        slides.forEach((_, index) => {
            const indicator = document.createElement('button'); // use button for accessibility
            indicator.className = 'carousel-indicator';
            indicator.type = 'button';
            indicator.setAttribute('aria-label', `Slide ${index + 1}`);
            indicator.setAttribute('data-slide-index', index);
            indicator.setAttribute('tabindex', '0');
            if (index === 0) {
                indicator.classList.add('active');
                indicator.setAttribute('aria-current', 'true');
            }
            // Click -> go to slide
            indicator.addEventListener('click', () => goToSlide(index));
            // Keyboard support: left/right to move slides when indicator focused
            indicator.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') prevSlide();
                else if (e.key === 'ArrowRight') nextSlide();
            });
            indicatorsContainer.appendChild(indicator);
        });

        // Re-query indicators after creation
        const indicators = Array.from(document.querySelectorAll('.carousel-indicator'));

        /**
         * Show specific slide by index
         */
        function showSlide(index) {
            // wrap index for safety
            index = (index + slides.length) % slides.length;

            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
                if (indicators[i]) {
                    indicators[i].classList.toggle('active', i === index);
                    if (i === index) indicators[i].setAttribute('aria-current', 'true');
                    else indicators[i].removeAttribute('aria-current');
                }
            });

            // Announce change for a11y: set aria-live on container if present
            const liveRegionId = 'carousel-live';
            let live = document.getElementById(liveRegionId);
            if (!live) {
                live = document.createElement('div');
                live.id = liveRegionId;
                live.className = 'sr-only';
                live.setAttribute('aria-live', 'polite');
                document.body.appendChild(live);
            }
            live.textContent = `Slide ${index + 1} of ${slides.length}`;

            currentSlide = index;
        }

        /**
         * Navigate to specific slide
         */
        function goToSlide(index) {
            showSlide(index);
            resetAutoSlide();
        }

        /**
         * Move to next slide
         */
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        /**
         * Move to previous slide
         */
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        /**
         * Start automatic slide rotation
         */
        function startAutoSlide() {
            stopAutoSlide();
            autoSlideInterval = setInterval(nextSlide, AUTO_DELAY);
        }

        /**
         * Stop auto slide
         */
        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }

        /**
         * Reset auto-slide timer
         */
        function resetAutoSlide() {
            stopAutoSlide();
            startAutoSlide();
        }

        // Carousel button event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoSlide();
            });
            // Make them keyboard accessible if not already
            nextBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    nextSlide();
                    resetAutoSlide();
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoSlide();
            });
            prevBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    prevSlide();
                    resetAutoSlide();
                }
            });
        }

        // Pause carousel on hover/focus
        const carousel = document.querySelector('.hero-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => stopAutoSlide(), { passive: true });
            carousel.addEventListener('mouseleave', () => startAutoSlide(), { passive: true });

            // Pause when any carousel control receives focus (keyboard users)
            carousel.addEventListener('focusin', () => stopAutoSlide());
            carousel.addEventListener('focusout', () => startAutoSlide());
        }

        // Keyboard navigation for carousel global (left/right)
        document.addEventListener('keydown', (e) => {
            // if focus is on an input or editable area, don't hijack keys
            const active = document.activeElement;
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;

            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoSlide();
            }
        });

        // Start automatic carousel rotation
        startAutoSlide();
    } // end carousel guard

    // =========================
    // 2. MOBILE MENU TOGGLE (unified and robust)
    // =========================

    (function setupMobileMenu() {
        // The project uses two patterns:
        // - index.html: #hamburger and #navMenu
        // - other pages: .nav-toggle and #primary-nav
        // We'll support both without changing markup.

        const hamburger = document.getElementById('hamburger');
        const navMenuById = document.getElementById('navMenu'); // index layout
        const navToggleButtons = Array.from(document.querySelectorAll('.nav-toggle')); // other pages
        const primaryNav = document.getElementById('primary-nav'); // other pages use this id
        const dropdowns = Array.from(document.querySelectorAll('.dropdown'));

        // Utility functions to open/close nav (for either pattern)
        function openMenu(menuEl, toggler) {
            if (!menuEl || !toggler) return;
            toggler.classList.add('active');
            menuEl.classList.add('active');
            toggler.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
            // move focus into menu for accessibility: focus first link
            const focusable = menuEl.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
            if (focusable) focusable.focus();
        }

        function closeMenu(menuEl, toggler) {
            if (!menuEl || !toggler) return;
            toggler.classList.remove('active');
            menuEl.classList.remove('active');
            toggler.setAttribute('aria-expanded', 'false');
            dropdowns.forEach(d => d.classList.remove('active'));
            document.body.style.overflow = '';
            // return focus to toggler for keyboard users
            toggler.focus();
        }

        // If index-style hamburger present, wire it up
        if (hamburger && navMenuById) {
            // keep old behaviors, but avoid duplicate events by checking for prior setup
            if (!hamburger.dataset.setup) {
                function toggleIndexMenu(e) {
                    if (e && e.stopPropagation) e.stopPropagation();
                    if (hamburger.classList.contains('active')) closeMenu(navMenuById, hamburger);
                    else openMenu(navMenuById, hamburger);
                }

                hamburger.addEventListener('pointerdown', toggleIndexMenu);
                hamburger.addEventListener('click', (e) => e.preventDefault());
                hamburger.setAttribute('role', 'button');
                hamburger.setAttribute('tabindex', '0');

                hamburger.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.code === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleIndexMenu(e);
                    } else if (e.key === 'Escape') {
                        closeMenu(navMenuById, hamburger);
                    }
                });

                // Prevent clicks inside nav from closing menu accidentally
                navMenuById.addEventListener('pointerdown', (e) => e.stopPropagation());

                // Close on outside click
                function outsideHandler(e) {
                    if (!navMenuById.classList.contains('active')) return;
                    const target = e.target;
                    if (!hamburger.contains(target) && !navMenuById.contains(target)) {
                        closeMenu(navMenuById, hamburger);
                    }
                }
                document.addEventListener('pointerdown', outsideHandler);
                document.addEventListener('touchstart', outsideHandler, { passive: true });

                // Close on ESC
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') closeMenu(navMenuById, hamburger);
                });

                // Dropdown handling on mobile width
                dropdowns.forEach(dropdown => {
                    const toggle = dropdown.querySelector('a');
                    if (!toggle) return;
                    toggle.addEventListener('click', (e) => {
                        if (window.innerWidth <= 968) {
                            e.preventDefault();
                            dropdown.classList.toggle('active');
                        }
                    });
                });

                hamburger.dataset.setup = 'true';
            }
        }

        // If other pages use .nav-toggle buttons and #primary-nav, wire them up
        if (navToggleButtons.length && primaryNav) {
            navToggleButtons.forEach(btn => {
                if (btn.dataset.setup) return;
                btn.addEventListener('click', (ev) => {
                    const isOpen = btn.getAttribute('aria-expanded') === 'true';
                    if (isOpen) closeMenu(primaryNav, btn);
                    else openMenu(primaryNav, btn);
                });

                btn.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') closeMenu(primaryNav, btn);
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const isOpen = btn.getAttribute('aria-expanded') === 'true';
                        if (isOpen) closeMenu(primaryNav, btn);
                        else openMenu(primaryNav, btn);
                    }
                });

                // Prevent clicks inside nav closing
                primaryNav.addEventListener('pointerdown', (e) => e.stopPropagation());

                // Close on outside
                document.addEventListener('pointerdown', (e) => {
                    if (!primaryNav.classList.contains('active')) return;
                    const target = e.target;
                    if (!btn.contains(target) && !primaryNav.contains(target)) {
                        closeMenu(primaryNav, btn);
                    }
                });

                btn.dataset.setup = 'true';
            });
        }

    })();

    // =========================
    // 3. SMOOTH SCROLL (unchanged, but guarded)
    // =========================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#home') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Close mobile menu if open (support both patterns)
                    const hamburger = document.getElementById('hamburger');
                    const navMenu = document.getElementById('navMenu');
                    if (hamburger && navMenu) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                        hamburger.setAttribute('aria-expanded', 'false');
                        document.body.style.overflow = '';
                    }

                    const navToggle = document.querySelector('.nav-toggle');
                    const primaryNav = document.getElementById('primary-nav');
                    if (navToggle && primaryNav) {
                        navToggle.classList.remove('active');
                        primaryNav.classList.remove('active');
                        navToggle.setAttribute('aria-expanded', 'false');
                        document.body.style.overflow = '';
                    }
                }
            }
        });
    });

    // =========================
    // 4. HEADER SCROLL EFFECT (unchanged)
    // =========================

    let lastScroll = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (header) {
            if (currentScroll > 100) {
                header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)';
            } else {
                header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            }
        }

        lastScroll = currentScroll;
    });

    // =========================
    // 5. INTERSECTION OBSERVER (unchanged with guards)
    // =========================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe content cards for fade-in animation
        document.querySelectorAll('.content-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(card);
        });
    } else {
        // Fallback: simply show cards
        document.querySelectorAll('.content-card').forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'none';
        });
    }

    // =========================
    // 6. TOUCH SWIPE SUPPORT (unchanged, guards in place)
    // =========================

    let touchStartX = 0;
    let touchEndX = 0;

    const carouselEl = document.querySelector('.hero-carousel');

    if (carouselEl) {
        carouselEl.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carouselEl.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    /**
     * Handle swipe gestures
     */
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                if (typeof nextSlide === 'function') nextSlide();
            } else {
                // Swipe right - previous slide
                if (typeof prevSlide === 'function') prevSlide();
            }
            if (typeof resetAutoSlide === 'function') resetAutoSlide();
        }
    }

    // =========================
    // 7. LAZY LOADING (enhanced)
    // =========================

    // Use native loading attribute when possible (added on images in markup may be missing)
    document.querySelectorAll('img').forEach(img => {
        // Don't overwrite if author already set
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        // Observe all images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } // If IO missing, native loading=lazy will help

    // =========================
    // 8. AUDIO BEHAVIOR: only one audio plays at a time (ADDED)
    // =========================

    // When user plays an <audio>, pause all others to avoid overlapping playback.
    (function singleAudioPolicy() {
        const audios = Array.from(document.querySelectorAll('audio'));

        if (!audios.length) return;

        audios.forEach((audio) => {
            audio.addEventListener('play', () => {
                audios.forEach(a => {
                    if (a !== audio && !a.paused) a.pause();
                });
            });
        });

        // If dynamic audio elements are added later, observe DOM changes
        if ('MutationObserver' in window) {
            const mo = new MutationObserver((mutations) => {
                mutations.forEach(m => {
                    m.addedNodes.forEach(node => {
                        if (node && node.tagName === 'AUDIO') {
                            node.addEventListener('play', () => {
                                audios.forEach(a => {
                                    if (a !== node && !a.paused) a.pause();
                                });
                            });
                        } else if (node && node.querySelectorAll) {
                            const added = node.querySelectorAll('audio');
                            added.forEach(a => {
                                a.addEventListener('play', () => {
                                    audios.forEach(existing => {
                                        if (existing !== a && !existing.paused) existing.pause();
                                    });
                                });
                                audios.push(a);
                            });
                        }
                    });
                });
            });

            mo.observe(document.body, { childList: true, subtree: true });
        }
    })();

    // =========================
    // 9. CLEANUP / PERFORMANCE TWEAKS
    // =========================

    // Recalculate something on resize if needed (debounced)
    window.addEventListener('resize', debounce(function() {
        // Nothing critical right now, but keep for future responsive adjustments
    }, 150));

}); // DOMContentLoaded end

/* =========================
   CHANGES/ADDITIONS NOTES (detailed):
 - Replaced dynamically-created indicator elements from 'div' to 'button' for accessibility.
 - Added aria-current and aria-label to indicators and aria-live region to announce slide changes.
 - Added guards before running carousel logic so pages without carousel don't throw.
 - Unified mobile menu handling to support both index-specific (#hamburger/#navMenu) and generic (.nav-toggle/#primary-nav).
 - Added focus management when opening menus (moves focus into menu and returns to toggler after close).
 - Added keyboard support for carousel and menu toggles.
 - Added "only one audio plays" behavior and MutationObserver to catch dynamically added audio tags.
 - Added reduced-motion respect in CSS and set native lazy-loading for images by default.
 - Everything preserves original class names and markup — changes are incremental and additive.
 ========================= */

// =========================
// SET CURRENT YEAR IN FOOTER
// =========================
const yearSpan = document.getElementById('current-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}
