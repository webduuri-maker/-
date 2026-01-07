/* ============================================
   COMPLETE JAVASCRIPT IMPLEMENTATION
   Баянбараатын Дөмөн Аялгуу Website
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // =========================
    // 1. CAROUSEL FUNCTIONALITY
    // =========================
    
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    let currentSlide = 0;
    let autoSlideInterval;

    // Create carousel indicators dynamically
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'carousel-indicator';
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });

    const indicators = document.querySelectorAll('.carousel-indicator');

    /**
     * Show specific slide by index
     */
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            indicators[i].classList.remove('active');
        });

        slides[index].classList.add('active');
        indicators[index].classList.add('active');
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
        autoSlideInterval = setInterval(nextSlide, 10000); // 10 seconds
    }

    /**
     * Reset auto-slide timer
     */
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Carousel button event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });
    }

    // Pause carousel on hover
    const carousel = document.querySelector('.hero-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });

        carousel.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }

    // Keyboard navigation for carousel
    document.addEventListener('keydown', (e) => {
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

    // =========================
    // 2. MOBILE MENU TOGGLE
    // =========================
    
    (function setupMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        const dropdowns = document.querySelectorAll('.dropdown');

        if (!hamburger || !navMenu) {
            console.warn('Hamburger or navMenu not found. Required IDs: #hamburger, #navMenu');
            return;
        }

        /**
         * Open mobile menu
         */
        function openMenu() {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        /**
         * Close mobile menu
         */
        function closeMenu() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            dropdowns.forEach(d => d.classList.remove('active'));
            document.body.style.overflow = '';
        }

        /**
         * Toggle menu open/closed
         */
        function toggleMenu(e) {
            if (e && e.stopPropagation) e.stopPropagation();
            if (hamburger.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        // Hamburger click/touch events
        hamburger.addEventListener('pointerdown', toggleMenu);
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
        });

        // Keyboard accessibility for hamburger
        hamburger.setAttribute('role', 'button');
        hamburger.setAttribute('tabindex', '0');
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.code === 'Enter') {
                e.preventDefault();
                toggleMenu(e);
            } else if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                toggleMenu(e);
            } else if (e.key === 'Escape') {
                closeMenu();
            }
        });

        // Prevent clicks inside nav from closing menu
        navMenu.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
        });

        /**
         * Close menu when clicking outside
         */
        function outsideHandler(e) {
            if (!navMenu.classList.contains('active')) return;
            const target = e.target;
            if (!hamburger.contains(target) && !navMenu.contains(target)) {
                closeMenu();
            }
        }
        
        document.addEventListener('pointerdown', outsideHandler);
        document.addEventListener('touchstart', outsideHandler, { passive: true });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });

        // Mobile dropdown toggles
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
    })();

    // =========================
    // 3. SMOOTH SCROLL
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
                    
                    // Close mobile menu if open
                    const hamburger = document.getElementById('hamburger');
                    const navMenu = document.getElementById('navMenu');
                    if (hamburger && navMenu) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                        hamburger.setAttribute('aria-expanded', 'false');
                        document.body.style.overflow = '';
                    }
                }
            }
        });
    });

    // =========================
    // 4. HEADER SCROLL EFFECT
    // =========================
    
    let lastScroll = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        }
        
        lastScroll = currentScroll;
    });

    // =========================
    // 5. INTERSECTION OBSERVER
    // =========================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

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

    // =========================
    // 6. TOUCH SWIPE SUPPORT
    // =========================
    
    let touchStartX = 0;
    let touchEndX = 0;

    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
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
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
            resetAutoSlide();
        }
    }

    // =========================
    // 7. LAZY LOADING
    // =========================
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        // Observe all images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});
