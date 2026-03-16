/* ── WONDERBLOG — script.js ──────────────────────────────────────────────── */

(function () {
  'use strict';

  // ── THEME ──────────────────────────────────────────────────────────────────
  const html = document.documentElement;
  const THEME_KEY = 'velour-theme';

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    const moonIcons = document.querySelectorAll('.icon-moon');
    const sunIcons  = document.querySelectorAll('.icon-sun');
    moonIcons.forEach(el => el.style.display = theme === 'dark' ? 'none' : 'block');
    sunIcons.forEach(el  => el.style.display = theme === 'dark' ? 'block' : 'none');
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(saved);
  }

  function bindThemeToggles() {
    document.querySelectorAll('#themeToggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const current = html.getAttribute('data-theme') || 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    });
  }

  // ── MOBILE MENU ────────────────────────────────────────────────────────────
  function initMobileMenu() {
    const openBtn  = document.getElementById('mobileMenuBtn');
    const closeBtn = document.getElementById('mobileClose');
    const menu     = document.getElementById('mobileMenu');
    if (!menu) return;

    function open()  { menu.classList.add('open');  document.body.style.overflow = 'hidden'; }
    function close() { menu.classList.remove('open'); document.body.style.overflow = ''; }

    openBtn  && openBtn.addEventListener('click', open);
    closeBtn && closeBtn.addEventListener('click', close);
    menu.addEventListener('click', e => { if (e.target === menu) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  // ── TOAST ──────────────────────────────────────────────────────────────────
  function showToast(msg, duration = 3200) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }

  window.showToast = showToast;

  // ── HEADER SCROLL SHADOW ───────────────────────────────────────────────────
  function initHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10 ? '0 1px 20px rgba(0,0,0,0.08)' : 'none';
    }, { passive: true });
  }

  // ── SCROLL REVEAL ──────────────────────────────────────────────────────────
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;
    const els = document.querySelectorAll('.post-card, .stat-card, .related-card');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
      obs.observe(el);
    });
  }

  // ── DELETE CONFIRM ─────────────────────────────────────────────────────────
  // Already handled inline with onsubmit="return confirm(...)"

  // ── ACTIVE NAV HIGHLIGHT ───────────────────────────────────────────────────
  function initActiveNav() {
    const path = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && href !== '/' && path.startsWith(href)) {
        link.classList.add('active');
      } else if (href === '/' && path === '/') {
        link.classList.add('active');
      }
    });
  }

  // ── SEARCH FOCUS SHORTCUT ──────────────────────────────────────────────────
  function initSearchShortcut() {
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.querySelector('.search-input');
        input && input.focus();
      }
    });
  }

  // ── AUTO-GROW TEXTAREA ─────────────────────────────────────────────────────
  function initAutoGrow() {
    document.querySelectorAll('.field-textarea').forEach(ta => {
      ta.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight + 2) + 'px';
      });
    });
  }

  // ── READING PROGRESS BAR ───────────────────────────────────────────────────
  function initReadingProgress() {
    const article = document.querySelector('.post-detail-body');
    if (!article) return;
    const bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;top:68px;left:0;height:2px;background:var(--gold);width:0%;z-index:99;transition:width 0.1s ease;';
    document.body.appendChild(bar);
    window.addEventListener('scroll', () => {
      const rect   = article.getBoundingClientRect();
      const total  = rect.height;
      const done   = Math.max(0, -rect.top);
      const pct    = Math.min(100, (done / total) * 100);
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  // ── COPY CODE BLOCKS ───────────────────────────────────────────────────────
  function initCopyCode() {
    document.querySelectorAll('pre code').forEach(code => {
      const btn = document.createElement('button');
      btn.textContent = 'Copy';
      btn.style.cssText = 'position:absolute;top:8px;right:8px;padding:4px 10px;font-size:0.72rem;border-radius:6px;border:1px solid var(--silk-border);background:var(--canvas-2);color:var(--ink-2);cursor:pointer;';
      const pre = code.parentElement;
      pre.style.position = 'relative';
      pre.appendChild(btn);
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(code.textContent).then(() => {
          btn.textContent = 'Copied!';
          setTimeout(() => btn.textContent = 'Copy', 1500);
        });
      });
    });
  }

  // ── INIT ───────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    bindThemeToggles();
    initMobileMenu();
    initHeaderScroll();
    initScrollReveal();
    initActiveNav();
    initSearchShortcut();
    initAutoGrow();
    initReadingProgress();
    initCopyCode();

    // Flash any session messages as toasts
    const flashMsg = document.querySelector('[data-flash]');
    if (flashMsg) showToast(flashMsg.dataset.flash);
  });

  // Re-apply theme immediately to avoid flash
  initTheme();
})();
