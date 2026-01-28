# Complete CSS and JavaScript Implementation

This document contains the complete, production-ready CSS and JavaScript code that replicates the styling and interactive behavior of the Баянбараатын Дөмөн Аялгуу website.

## Overview

The website features:
- **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop
- **Interactive Carousel**: Auto-rotating hero section with 5 slides
- **Navigation**: Multi-level dropdown menu with mobile hamburger toggle
- **Smooth Animations**: Fade-in effects, hover states, and transitions
- **Touch Support**: Swipe gestures for mobile devices
- **Accessibility**: ARIA labels, keyboard navigation

---

## --- CSS START ---

```css
/* ============================================
   COMPLETE CSS STYLESHEET
   Баянбараатын Дөмөн Аялгуу Website
   ============================================ */

/* =========================
   1. RESET AND BASE STYLES
   ========================= */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    /* Color Variables */
    --primary-color: #1e1e1e;
    --secondary-color: #0088cc;
    --accent-color: #f7941d;
    --text-color: #333;
    --light-bg: #f5f5f5;
    --white: #ffffff;
    --border-color: #e0e0e0;
    
    /* Typography */
    --font-primary: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    font-family: var(--font-primary);
    color: var(--text-color);
    line-height: 1.6;
    overflow-x: hidden;
}

html {
    scroll-behavior: smooth;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* =========================
   2. HEADER STYLES
   ========================= */
.header {
    background: var(--white);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.header-top {
    background: var(--primary-color);
    color: var(--white);
    padding: 10px 0;
    font-size: 14px;
}

.header-top .contact-info {
    display: flex;
    justify-content: flex-end;
    gap: 30px;
}

.header-top .contact-info span {
    display: flex;
    align-items: center;
    gap: 8px;
}

/* =========================
   3. NAVIGATION STYLES
   ========================= */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
}

.logo h1 {
    font-size: 25px;
    color: var(--primary-color);
    font-weight: 600;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 30px;
    align-items: center;
}

.nav-menu > li {
    position: relative;
}

.nav-menu a {
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    font-size: 15px;
    transition: color 0.3s;
    display: flex;
    align-items: center;
    gap: 5px;
}

.nav-menu a:hover {
    color: var(--secondary-color);
}

/* Dropdown Menu */
.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--white);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    list-style: none;
    min-width: 250px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s;
    z-index: 100;
    margin-top: 10px;
}

.dropdown:hover .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.dropdown-menu li {
    border-bottom: 1px solid var(--border-color);
}

.dropdown-menu li:last-child {
    border-bottom: none;
}

.dropdown-menu a {
    padding: 12px 20px;
    display: block;
    font-size: 14px;
}

.dropdown-menu a:hover {
    background: var(--light-bg);
    color: var(--secondary-color);
}

/* Hamburger Menu */
.hamburger {
    display: none;
    flex-direction: column;
    cursor: pointer;
    gap: 5px;
    z-index: 1101;
    position: relative;
}

.hamburger span {
    width: 25px;
    height: 3px;
    background: var(--primary-color);
    transition: all 0.3s;
}

/* =========================
   4. HERO CAROUSEL
   ========================= */
.hero-carousel {
    position: relative;
    height: 500px;
    overflow: hidden;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.carousel-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.carousel-slide {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 1s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.carousel-slide.active {
    opacity: 1;
    z-index: 1;
}

.slide-content {
    text-align: center;
    color: var(--white);
    z-index: 2;
}

.slide-content h2 {
    font-size: 32px;
    font-weight: 300;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.slide-content h1 {
    font-size: 56px;
    font-weight: 700;
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 3px;
}

.slide-content p {
    font-size: 24px;
    font-weight: 400;
    font-style: italic;
}

/* Carousel Controls */
.carousel-controls {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 30px;
    z-index: 10;
}

.carousel-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.5);
    color: var(--white);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transition: all 0.3s;
    backdrop-filter: blur(10px);
}

.carousel-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: var(--white);
    transform: scale(1.1);
}

/* Carousel Indicators */
.carousel-indicators {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 10;
}

.carousel-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: all 0.3s;
    border: 2px solid transparent;
}

.carousel-indicator.active {
    background: var(--white);
    transform: scale(1.2);
}

/* =========================
   5. CONTENT SECTIONS
   ========================= */
.content-section {
    padding: 80px 0;
    background: var(--white);
}

.content-section.alt-bg {
    background: var(--light-bg);
}

.section-header {
    text-align: center;
    margin-bottom: 60px;
}

.section-title {
    font-size: 36px;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 10px;
}

.section-subtitle {
    font-size: 18px;
    color: #666;
    margin-top: 15px;
    font-style: italic;
}

.content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.content-card {
    background: var(--white);
    border-radius: 8px;
    padding: 40px 30px;
    text-align: center;
    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    border-top: 4px solid var(--secondary-color);
}

.content-section.alt-bg .content-card {
    background: var(--white);
}

.content-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.content-card i {
    font-size: 48px;
    color: var(--secondary-color);
    margin-bottom: 20px;
    display: block;
}

.content-card h3 {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 15px;
    color: var(--primary-color);
    min-height: 60px;
}

.content-card h4 {
    font-size: 18px;
    font-weight: 600;
    color: var(--primary-color);
}

.content-card p {
    color: #666;
    line-height: 1.8;
    font-size: 15px;
}

.content-card ul,
.content-card ol {
    text-align: left;
    margin: 15px 0;
    padding-left: 25px;
}

.content-card li {
    margin-bottom: 8px;
    color: #555;
}

/* =========================
   6. BUTTONS AND CONTROLS
   ========================= */
.btn {
    padding: 10px 14px;
    border-radius: 6px;
    border: 1px solid transparent;
    background: var(--secondary-color);
    color: #fff;
    cursor: pointer;
    font-weight: 600;
    transition: transform 0.08s ease, box-shadow 0.12s ease, opacity 0.12s ease;
    text-decoration: none;
    display: inline-block;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0,0,0,0.08);
}

.btn.primary {
    background: linear-gradient(90deg, var(--secondary-color), var(--accent-color));
    color: #fff;
    padding: 10px 14px;
    border-radius: 8px;
    font-weight: 700;
    border: none;
}

.btn.ghost {
    background: transparent;
    color: var(--primary-color);
    border: 1px solid var(--border-color);
}

/* =========================
   7. ANIMATIONS
   ========================= */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* =========================
   8. RESPONSIVE DESIGN
   ========================= */
@media (max-width: 968px) {
    /* Mobile Navigation */
    .nav-menu {
        position: fixed;
        left: -100%;
        top: 0;
        flex-direction: column;
        background: var(--white);
        width: 80%;
        height: 100vh;
        padding: 80px 30px 30px;
        box-shadow: 2px 0 10px rgba(0,0,0,0.1);
        transition: left 0.3s;
        z-index: 1000;
        align-items: flex-start;
        gap: 0;
        overflow-y: auto;
    }

    .nav-menu.active {
        left: 0;
    }

    .nav-menu > li {
        width: 100%;
        border-bottom: 1px solid var(--border-color);
    }

    .nav-menu a {
        padding: 15px 0;
        width: 100%;
    }

    .dropdown-menu {
        position: static;
        opacity: 1;
        visibility: visible;
        transform: none;
        box-shadow: none;
        background: var(--light-bg);
        margin: 0;
        display: none;
    }

    .dropdown.active .dropdown-menu {
        display: block;
    }

    .hamburger {
        display: flex;
        z-index: 1101;
    }

    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(8px, 8px);
    }

    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -7px);
    }

    /* Carousel Adjustments */
    .hero-carousel {
        height: 400px;
    }

    .slide-content h2 {
        font-size: 24px;
    }

    .slide-content h1 {
        font-size: 40px;
    }

    .slide-content p {
        font-size: 18px;
    }

    .carousel-btn {
        width: 40px;
        height: 40px;
        font-size: 16px;
    }

    /* Content Adjustments */
    .content-section {
        padding: 50px 0;
    }

    .section-title {
        font-size: 28px;
    }

    .content-grid {
        grid-template-columns: 1fr;
    }

    .content-card {
        padding: 30px 20px;
    }

    .content-card h3 {
        min-height: auto;
    }
}

@media (max-width: 720px) {
    .header-top .contact-info {
        flex-direction: column;
        gap: 10px;
        font-size: 12px;
    }

    .logo h1 {
        font-size: 18px;
    }

    .hero-carousel {
        height: 300px;
    }

    .slide-content h2 {
        font-size: 18px;
    }

    .slide-content h1 {
        font-size: 28px;
    }

    .slide-content p {
        font-size: 14px;
    }

    .section-title {
        font-size: 24px;
    }

    .section-subtitle {
        font-size: 16px;
    }
}

/* =========================
   9. EDITOR PAGES STYLES
   (For additional HTML pages)
   ========================= */
header {
    background: var(--white);
    padding: 18px 20px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    position: sticky;
    top: 0;
    z-index: 1000;
}

header h1 {
    font-size: 20px;
    color: var(--primary-color);
    font-weight: 600;
}

a.back {
    text-decoration: none;
    color: var(--secondary-color);
    font-weight: 600;
    background: transparent;
    padding: 8px 12px;
    border-radius: 6px;
    transition: background-color 0.2s, color 0.2s;
    border: 1px solid transparent;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

a.back:hover {
    background: rgba(0,136,204,0.08);
    color: var(--secondary-color);
}

.controls {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 18px 20px;
    background: transparent;
    flex-wrap: wrap;
    border-bottom: 1px solid var(--border-color);
}

.controls input[type="text"],
.controls input {
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    min-width: 260px;
    max-width: 100%;
    background: #fff;
    color: var(--text-color);
    outline: none;
    transition: box-shadow 0.15s, border-color 0.15s;
}

.controls input:focus {
    border-color: var(--secondary-color);
    box-shadow: 0 4px 12px rgba(0,136,204,0.08);
}

article#editor {
    margin: 22px auto;
    padding: 28px;
    max-width: 980px;
    background: var(--white);
    border-radius: 10px;
    box-shadow: 0 6px 20px rgba(20,20,20,0.04);
    min-height: 380px;
    outline: none;
    caret-color: var(--secondary-color);
    word-break: break-word;
    line-height: 1.8;
}

article#editor:focus {
    box-shadow: 0 12px 30px rgba(0,136,204,0.06);
    border: 1px solid rgba(0,136,204,0.08);
}

footer {
    padding: 18px 20px;
    text-align: center;
    font-size: 14px;
    color: #666;
    border-top: 1px solid var(--border-color);
    background: transparent;
}

/* =========================
   10. PRINT STYLES
   ========================= */
@media print {
    .controls, a.back, .hamburger, nav, .footer, header {
        display: none !important;
    }
    article#editor {
        box-shadow: none;
        border: none;
        margin: 0;
        padding: 0;
    }
}
```

## --- CSS END ---

---

## --- JS START ---

```javascript
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
```

## --- JS END ---

---

## Implementation Notes

### CSS Organization
The CSS is organized into 10 clear sections:
1. **Reset and Base Styles** - Normalize and variables
2. **Header Styles** - Top bar and branding
3. **Navigation Styles** - Menu and dropdowns
4. **Hero Carousel** - Slideshow styling
5. **Content Sections** - Main content areas
6. **Buttons and Controls** - Interactive elements
7. **Animations** - Keyframe animations
8. **Responsive Design** - Mobile/tablet breakpoints
9. **Editor Pages** - Additional page styles
10. **Print Styles** - Print-friendly layout

### JavaScript Features
The JavaScript implements 7 main features:
1. **Carousel Functionality** - Auto-rotating slideshow with controls
2. **Mobile Menu Toggle** - Hamburger menu with accessibility
3. **Smooth Scroll** - Anchor link navigation
4. **Header Scroll Effect** - Dynamic shadow on scroll
5. **Intersection Observer** - Fade-in animations
6. **Touch Swipe Support** - Mobile gesture control
7. **Lazy Loading** - Performance optimization

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers

### Accessibility Features
- ARIA labels and roles
- Keyboard navigation (Tab, Enter, Space, Escape, Arrow keys)
- Focus management
- Screen reader compatible

### Performance Optimizations
- CSS transitions over JavaScript animations
- Passive event listeners for touch events
- Intersection Observer for lazy loading
- Minimal DOM manipulation

