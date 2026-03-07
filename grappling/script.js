/**
 * FLAME – Performance Grappling Wear
 * script.js
 * ─────────────────────────────────────
 * - Navbar scroll behavior
 * - Parallax effects (Hero + Features)
 * - Intersection Observer reveal animations
 * - Mobile nav toggle
 * - Smooth scroll anchor links
 */

(function () {
  'use strict';

  /* ── DOM References ─────────────────────────────── */
  const navbar     = document.getElementById('navbar');
  const navToggle  = document.getElementById('navToggle');
  const navLinks   = document.getElementById('navLinks');
  const heroParallax = document.getElementById('heroParallax');
  const featBg     = document.getElementById('featBg');

  /* ================================================================
     1. NAVBAR – background on scroll
  ================================================================ */
  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ================================================================
     2. PARALLAX
  ================================================================ */
  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;

    // Hero parallax – moves slower than scroll
    if (heroParallax) {
      const heroH = heroParallax.closest('.hero')?.offsetHeight || window.innerHeight;
      if (scrollY < heroH * 1.5) {
        heroParallax.style.transform = `translateY(${scrollY * 0.38}px)`;
      }
    }

    // Features section parallax
    if (featBg) {
      const section = featBg.closest('.features');
      if (section) {
        const rect = section.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) {
          const offset = (window.innerHeight - rect.top) * 0.2;
          featBg.style.transform = `translateY(${offset}px)`;
        }
      }
    }

    ticking = false;
  }

  function onScroll() {
    handleNavbarScroll();

    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Run once on load
  handleNavbarScroll();
  updateParallax();

  /* ================================================================
     3. INTERSECTION OBSERVER – reveal on scroll
  ================================================================ */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // fire once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ================================================================
     4. MOBILE NAV TOGGLE
  ================================================================ */
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      // Prevent body scroll when menu open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ================================================================
     5. SMOOTH SCROLL (native fallback for older browsers)
  ================================================================ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      // Only override if CSS scroll-behavior not supported
      if (!CSS.supports('scroll-behavior', 'smooth')) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ================================================================
     6. PRODUCT CARD – subtle tilt on hover (desktop only)
  ================================================================ */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.product-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        card.style.transform = `translateY(-6px) rotateY(${dx * 5}deg) rotateX(${-dy * 3}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ================================================================
     7. STAGGER REVEAL for grid items
  ================================================================ */
  // Products grid
  document.querySelectorAll('.products-grid .product-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  // Features grid
  document.querySelectorAll('.features-grid .feature-item').forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.1}s`;
  });

  /* ================================================================
     8. HERO – text entrance on load
  ================================================================ */
  window.addEventListener('load', () => {
    // Trigger hero reveals slightly after load
    setTimeout(() => {
      document.querySelectorAll('.hero .reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 120);
      });
    }, 200);
  });

})();
