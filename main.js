// main.js — small interactivity & animation triggers
document.addEventListener('DOMContentLoaded', function () {
  // mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (navToggle) navToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('hidden');
  });

  // IntersectionObserver to add animate.css classes from data-animate attribute
  const animated = document.querySelectorAll('[data-animate]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const cls = el.getAttribute('data-animate');
        el.classList.add(cls);
        // optionally remove after animation ends to allow re-animations
        el.addEventListener('animationend', () => {
          // keep animation classes so it stays visible — no-op
        }, { once: true });
        io.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  animated.forEach(el => io.observe(el));

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile nav
        if (!mobileNav.classList.contains('hidden')) mobileNav.classList.add('hidden');
      }
    });
  });
});
