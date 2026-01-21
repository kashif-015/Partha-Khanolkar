// Enhanced JavaScript for Partha Khanolkar Website
// Performance-optimized vanilla JavaScript

(function() {
    'use strict';
    
    // Performance: Debounce function for scroll events
    function debounce(func, wait = 20, immediate = true) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // Lazy Loading Images (if images are added later)
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Performance Monitoring
    function logPerformanceMetrics() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = window.performance.timing;
                    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                    const connectTime = perfData.responseEnd - perfData.requestStart;
                    const renderTime = perfData.domComplete - perfData.domLoading;
                    
                    console.log('Performance Metrics:');
                    console.log(`Page Load Time: ${pageLoadTime}ms`);
                    console.log(`Connect Time: ${connectTime}ms`);
                    console.log(`Render Time: ${renderTime}ms`);
                    
                    // Log Largest Contentful Paint (LCP)
                    if ('PerformanceObserver' in window) {
                        try {
                            const po = new PerformanceObserver((list) => {
                                const entries = list.getEntries();
                                const lastEntry = entries[entries.length - 1];
                                console.log(`LCP: ${lastEntry.renderTime || lastEntry.loadTime}ms`);
                            });
                            po.observe({ type: 'largest-contentful-paint', buffered: true });
                        } catch (e) {
                            console.log('LCP monitoring not supported');
                        }
                    }
                }, 0);
            });
        }
    }
    
    // Enhanced Mobile Menu with Animation
    function initMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                const isHidden = mobileMenu.classList.contains('hidden');
                mobileMenu.classList.toggle('hidden');
                
                // Update ARIA attributes for accessibility
                mobileMenuButton.setAttribute('aria-expanded', isHidden);
                mobileMenu.setAttribute('aria-hidden', !isHidden);
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                    mobileMenu.classList.add('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Close mobile menu on link click
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                });
            });
        }
    }
    
    // Scroll-based Section Animation
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Stop observing once visible (performance optimization)
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.section-fade').forEach(section => {
            observer.observe(section);
        });
    }
    
    // Smooth Scroll with Offset for Fixed Nav
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed nav
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without jump
                    history.pushState(null, null, href);
                }
            });
        });
    }
    
    // Active Navigation State Based on Scroll
    function initActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        const updateActiveLink = debounce(() => {
            let current = '';
            const scrollPosition = window.pageYOffset;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 200;
                const sectionHeight = section.clientHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('text-purple-600', 'font-bold');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('text-purple-600', 'font-bold');
                }
            });
        }, 100);
        
        window.addEventListener('scroll', updateActiveLink, { passive: true });
    }
    
    // Add 'Back to Top' Button
    function initBackToTop() {
        const backToTopButton = document.createElement('button');
        backToTopButton.innerHTML = '↑';
        backToTopButton.className = 'fixed bottom-8 right-8 bg-purple-600 text-white w-12 h-12 rounded-full shadow-lg hover:bg-purple-700 transition opacity-0 pointer-events-none z-50';
        backToTopButton.setAttribute('aria-label', 'Back to top');
        backToTopButton.id = 'back-to-top';
        document.body.appendChild(backToTopButton);
        
        const toggleBackToTop = debounce(() => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.remove('opacity-0', 'pointer-events-none');
            } else {
                backToTopButton.classList.add('opacity-0', 'pointer-events-none');
            }
        }, 100);
        
        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Add scroll effect to navigation
    function initNavScroll() {
        const nav = document.querySelector('nav');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled', 'shadow-lg');
            } else {
                nav.classList.remove('scrolled', 'shadow-lg');
            }
        }, { passive: true });
    }
    
    // Initialize all features when DOM is ready
    function init() {
        initMobileMenu();
        initScrollAnimations();
        initSmoothScroll();
        initActiveNavigation();
        initBackToTop();
        initNavScroll();
        lazyLoadImages();
        
        // Performance monitoring in development only
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            logPerformanceMetrics();
        }
    }
    
    // Start when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Service Worker Registration (for PWA capabilities - optional)
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(
                registration => console.log('ServiceWorker registered'),
                err => console.log('ServiceWorker registration failed')
            ).catch(err => console.log(err));
        });
    }
    
})();
