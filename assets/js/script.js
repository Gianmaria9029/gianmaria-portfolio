/* ===========================================
   GIANMARIA GORI — PORTFOLIO
   script.js
   =========================================== */

'use strict';

/* ---- CUSTOM CURSOR ---- */
(function initCursor() {
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * .12;
    ringY += (mouseY - ringY) * .12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Expand ring on interactive elements
  const interactives = 'a, button, .project-card, .contact-card, .skill-tag';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactives)) ring.classList.add('hovered');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactives)) ring.classList.remove('hovered');
  });

  // Hide on touch devices
  document.addEventListener('touchstart', () => {
    dot.style.display  = 'none';
    ring.style.display = 'none';
    cancelAnimationFrame(raf);
  }, { once: true });
})();


/* ---- NAVBAR SCROLL STATE ---- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ---- MOBILE NAV TOGGLE ---- */
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    // Animate hamburger → X
    const spans = toggle.querySelectorAll('span');
    if (open) {
      spans[0].style.cssText = 'transform: translateY(6.5px) rotate(45deg)';
      spans[1].style.cssText = 'opacity: 0';
      spans[2].style.cssText = 'transform: translateY(-6.5px) rotate(-45deg)';
    } else {
      spans.forEach(s => s.style.cssText = '');
    }
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.querySelectorAll('span').forEach(s => s.style.cssText = '');
    });
  });
})();


/* ---- INTERSECTION OBSERVER — REVEAL ANIMATIONS ---- */
(function initReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();


/* ---- HERO: trigger initial reveals on load ---- */
window.addEventListener('load', () => {
  // The hero elements have CSS transitions with delays — just add revealed
  document.querySelectorAll('.hero [data-reveal]').forEach(el => {
    el.classList.add('revealed');
  });
});


/* ---- ANIMATED COUNTERS ---- */
(function initCounters() {
  const counters = document.querySelectorAll('.counter-num');
  if (!counters.length) return;

  let started = false;

  const runCounters = () => {
    if (started) return;
    const heroCounter = document.querySelector('.hero-counter');
    if (!heroCounter) return;

    const rect = heroCounter.getBoundingClientRect();
    if (rect.top < window.innerHeight * .9) {
      started = true;
      counters.forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        const duration = 1200;
        const startTime = performance.now();

        function update(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // ease out quad
          const eased = 1 - (1 - progress) * (1 - progress);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target;
        }
        requestAnimationFrame(update);
      });
    }
  };

  window.addEventListener('scroll', runCounters, { passive: true });
  // Try immediately in case already in view
  setTimeout(runCounters, 800);
})();


/* ---- SKILL BARS — animate width on scroll ---- */
(function initSkillBars() {
  const fills = document.querySelectorAll('.band-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(f => observer.observe(f));
})();


/* ---- ACTIVE NAV LINK highlight on scroll ---- */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !links.length) return;

  const onScroll = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    links.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current
        ? 'var(--text)'
        : '';
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ---- FOOTER YEAR ---- */
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ---- SMOOTH ANCHOR SCROLL (fallback for older browsers) ---- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
