/**
 * YAKKAY AI LINE MARKETPLACE
 * Core Application State & Router
 * Pure Vanilla JS — MIT Licensed
 */

'use strict';

/* ============================================================
   GLOBAL APP STATE (Simple Observable Store)
   ============================================================ */
const YakkayStore = (() => {
  let state = {
    user: {
      id: 'usr_001',
      name: 'Arjun Mehta',
      email: 'arjun.mehta@enterprise.com',
      role: 'Enterprise Architect',
      org: 'TechCorp Industries',
      avatar: 'AM',
      plan: 'Enterprise',
      permissions: ['view','purchase','compare','bookmark','admin']
    },
    theme: localStorage.getItem('yakkay-theme') || 'light',
    sidebar: { collapsed: false },
    notifications: { count: 7, items: [] },
    bookmarks: JSON.parse(localStorage.getItem('yakkay-bookmarks') || '[]'),
    recentlyViewed: JSON.parse(localStorage.getItem('yakkay-recent') || '[]'),
    cart: [],
    search: { query: '', results: [], filters: {}, loading: false },
    currentPage: 'landing',
  };

  const listeners = {};

  return {
    get: (key) => key ? state[key] : state,
    set: (key, value) => {
      state[key] = typeof value === 'object' && !Array.isArray(value)
        ? { ...state[key], ...value }
        : value;
      (listeners[key] || []).forEach(fn => fn(state[key]));
      (listeners['*'] || []).forEach(fn => fn(state));
    },
    subscribe: (key, fn) => {
      if (!listeners[key]) listeners[key] = [];
      listeners[key].push(fn);
      return () => { listeners[key] = listeners[key].filter(l => l !== fn); };
    },
    persist: (key) => {
      localStorage.setItem(`yakkay-${key}`, JSON.stringify(state[key]));
    }
  };
})();

/* ============================================================
   SECURITY MODULE
   ============================================================ */
const Security = {
  /* XSS Prevention */
  sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /* CSRF Token */
  generateCSRFToken() {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
  },

  /* Content Security Policy header meta */
  injectCSPMeta() {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self'",
    ].join('; ');
    document.head.prepend(meta);
  },

  /* Input validation */
  validators: {
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    url:   (v) => { try { new URL(v); return true; } catch { return false; } },
    phone: (v) => /^\+?[\d\s\-()]{7,15}$/.test(v),
    noScript: (v) => !/<script|javascript:/i.test(v),
    maxLength: (v, max) => v.length <= max,
    required: (v) => v && v.trim().length > 0,
  },

  /* Rate limit (client-side UI throttle) */
  rateLimiter: (() => {
    const calls = {};
    return (key, limitMs = 1000) => {
      const now = Date.now();
      if (calls[key] && now - calls[key] < limitMs) return false;
      calls[key] = now;
      return true;
    };
  })(),

  /* Permission check */
  can(permission) {
    const user = YakkayStore.get('user');
    return user && user.permissions && user.permissions.includes(permission);
  },

  /* Role-based UI guard */
  requirePermission(permission, el) {
    if (!this.can(permission)) {
      el.style.display = 'none';
      el.setAttribute('aria-hidden', 'true');
      return false;
    }
    return true;
  }
};

/* ============================================================
   CLIENT-SIDE ROUTER
   ============================================================ */
const Router = (() => {
  const routes = {};
  let current = null;

  const navigate = (path, data = {}) => {
    if (current === path) return;
    current = path;
    window.history.pushState({ path, data }, '', `#${path}`);
    render(path, data);
  };

  const render = (path, data = {}) => {
    const handler = routes[path] || routes['404'];
    if (!handler) return;
    YakkayStore.set('currentPage', path);
    try { handler(data); } catch (e) { console.error(`[Router] Error rendering ${path}:`, e); }
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Update active nav
    document.querySelectorAll('[data-route]').forEach(el => {
      el.classList.toggle('active', el.dataset.route === path);
    });
  };

  const register = (path, handler) => { routes[path] = handler; };

  window.addEventListener('popstate', (e) => {
    const path = e.state?.path || 'landing';
    render(path, e.state?.data || {});
  });

  // Handle hash links
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || 'landing';
    render(hash);
  });

  return { register, navigate, render, routes };
})();

/* ============================================================
   API CLIENT (Mock + Real-ready)
   ============================================================ */
const API = (() => {
  const BASE_URL = '/api/v1';
  const csrfToken = Security.generateCSRFToken();

  const request = async (method, endpoint, body = null, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
      'X-App-Version': '1.0.0',
      ...options.headers
    };

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    try {
      // In production: replace with real fetch
      // For now: return mock data
      const mock = MockData.getResponse(endpoint, method, body);
      await new Promise(r => setTimeout(r, 200 + Math.random() * 300)); // simulate latency
      return mock;
    } catch (err) {
      console.error(`[API] ${method} ${endpoint} failed:`, err);
      throw err;
    }
  };

  return {
    get:    (ep, opts)    => request('GET', ep, null, opts),
    post:   (ep, body, opts) => request('POST', ep, body, opts),
    put:    (ep, body, opts) => request('PUT', ep, body, opts),
    delete: (ep, opts)    => request('DELETE', ep, null, opts),
    patch:  (ep, body, opts) => request('PATCH', ep, body, opts),
  };
})();

/* ============================================================
   EVENT BUS
   ============================================================ */
const EventBus = (() => {
  const listeners = {};
  return {
    on:   (ev, fn) => { (listeners[ev] = listeners[ev] || []).push(fn); },
    off:  (ev, fn) => { listeners[ev] = (listeners[ev] || []).filter(l => l !== fn); },
    emit: (ev, data) => { (listeners[ev] || []).forEach(fn => fn(data)); },
  };
})();

/* ============================================================
   UTILITY HELPERS
   ============================================================ */
const Utils = {
  /* DOM helpers */
  $(sel, ctx = document)  => ctx.querySelector(sel),
  $$(sel, ctx = document) => [...ctx.querySelectorAll(sel)],
  el(tag, attrs = {}, children = []) {
    const e = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class')     e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k === 'text') e.textContent = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    });
    children.forEach(c => e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
    return e;
  },

  /* Format helpers */
  formatNumber: (n) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(n),
  formatCurrency: (n, currency = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n),
  formatDate: (d) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(d)),
  timeAgo: (d) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60)   return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)    return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  },
  truncate: (str, len = 100) => str.length > len ? str.slice(0, len) + '…' : str,
  slug: (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  debounce(fn, ms = 300) {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  },
  throttle(fn, ms = 100) {
    let last = 0;
    return (...args) => { const now = Date.now(); if (now - last >= ms) { last = now; fn(...args); } };
  },

  /* Animation */
  animate(el, cls, duration = 400) {
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), duration);
  },

  /* Local storage with fallback */
  storage: {
    get: (k, def = null) => { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
    del: (k) => { try { localStorage.removeItem(k); } catch {} },
  },

  /* Generate star rating HTML */
  stars(rating, max = 5) {
    return Array.from({ length: max }, (_, i) =>
      `<span class="star ${i < Math.round(rating) ? '' : 'empty'}">★</span>`
    ).join('');
  },

  /* Copy to clipboard */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      return true;
    }
  },
};

/* ============================================================
   TOAST NOTIFICATION SYSTEM
   ============================================================ */
const Toast = (() => {
  let container;

  const init = () => {
    container = document.getElementById('toast-container');
    if (!container) {
      container = Utils.el('div', { id: 'toast-container', class: 'toast-container' });
      document.body.appendChild(container);
    }
  };

  const show = (message, type = 'default', duration = 4000) => {
    if (!container) init();
    const icons = { success: '✓', error: '✕', warning: '⚠', default: 'ℹ' };
    const toast = Utils.el('div', { class: `toast ${type}`, role: 'alert', 'aria-live': 'assertive' });
    toast.innerHTML = `<span style="font-size:16px">${icons[type] || icons.default}</span><span>${Security.sanitize(message)}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  return {
    init,
    success: (m, d) => show(m, 'success', d),
    error:   (m, d) => show(m, 'error', d),
    warning: (m, d) => show(m, 'warning', d),
    info:    (m, d) => show(m, 'default', d),
  };
})();

/* ============================================================
   THEME MANAGER
   ============================================================ */
const ThemeManager = {
  init() {
    const saved = YakkayStore.get('theme');
    this.apply(saved);
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    YakkayStore.set('theme', theme);
    localStorage.setItem('yakkay-theme', theme);
    EventBus.emit('theme:change', theme);
  },
  toggle() {
    const current = YakkayStore.get('theme');
    this.apply(current === 'dark' ? 'light' : 'dark');
  },
  isDark: () => YakkayStore.get('theme') === 'dark',
};

/* ============================================================
   ACCESSIBILITY MANAGER
   ============================================================ */
const A11y = {
  init() {
    // Skip link
    const skip = Utils.el('a', {
      href: '#main-content', class: 'sr-only',
      style: 'position:fixed;top:0;left:0;z-index:9999;padding:8px 16px;background:var(--color-primary);color:#fff;border-radius:4px;'
    });
    skip.textContent = 'Skip to main content';
    skip.addEventListener('focus', () => skip.style.clip = 'unset');
    skip.addEventListener('blur',  () => skip.style.clip = 'rect(0,0,0,0)');
    document.body.prepend(skip);

    // Focus trap for modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal-overlay.open');
        if (openModal) Modal.close(openModal.id);
      }
    });

    // Reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--transition-base', '0ms');
      document.documentElement.style.setProperty('--transition-slow', '0ms');
    }
  }
};

/* ============================================================
   MODAL MANAGER
   ============================================================ */
const Modal = {
  open(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    overlay.setAttribute('aria-hidden', 'false');
    // Focus first interactive element
    const focusable = overlay.querySelector('button, input, select, textarea, a[href]');
    if (focusable) setTimeout(() => focusable.focus(), 100);
  },
  close(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    overlay.setAttribute('aria-hidden', 'true');
  },
  closeAll() {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
    });
    document.body.style.overflow = '';
  }
};

/* ============================================================
   DROPDOWN MANAGER
   ============================================================ */
const Dropdown = {
  init() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-dropdown]');
      if (trigger) {
        e.stopPropagation();
        const menuId = trigger.dataset.dropdown;
        const menu = document.getElementById(menuId);
        if (menu) {
          const isOpen = menu.classList.contains('open');
          this.closeAll();
          if (!isOpen) menu.classList.add('open');
        }
      } else {
        this.closeAll();
      }
    });
  },
  closeAll() {
    document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
  }
};

/* ============================================================
   TABS MANAGER
   ============================================================ */
const Tabs = {
  init(containerSelector = '[data-tabs]') {
    Utils.$$(containerSelector).forEach(container => {
      const tabList = container.querySelector('.tab-list');
      if (!tabList) return;
      tabList.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;
        const target = btn.dataset.tab;
        // Update buttons
        container.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
        // Update panels
        container.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === target));
        EventBus.emit('tab:change', { container, target });
      });
    });
  }
};

/* ============================================================
   SIDEBAR MANAGER
   ============================================================ */
const Sidebar = {
  toggle() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    if (!sidebar) return;
    const isCollapsed = sidebar.classList.toggle('collapsed');
    if (mainContent) mainContent.classList.toggle('sidebar-collapsed', isCollapsed);
    YakkayStore.set('sidebar', { collapsed: isCollapsed });
  },
  mobileToggle() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.toggle('mobile-open');
  }
};

/* ============================================================
   SEARCH ENGINE (Client-side filtering)
   ============================================================ */
const SearchEngine = {
  index: [],

  buildIndex(products) {
    this.index = products.map(p => ({
      ...p,
      _searchText: [p.name, p.description, p.vendor, p.category, ...(p.tags || [])].join(' ').toLowerCase()
    }));
  },

  search(query, filters = {}) {
    const q = query.toLowerCase().trim();
    let results = q
      ? this.index.filter(p => p._searchText.includes(q))
      : [...this.index];

    if (filters.category) results = results.filter(p => p.category === filters.category);
    if (filters.vendor)   results = results.filter(p => p.vendor === filters.vendor);
    if (filters.minRating) results = results.filter(p => p.rating >= Number(filters.minRating));
    if (filters.deployment) results = results.filter(p => p.deployments?.includes(filters.deployment));
    if (filters.pricing)  results = results.filter(p => p.pricingModel === filters.pricing);
    if (filters.industry) results = results.filter(p => p.industries?.includes(filters.industry));

    return results;
  },

  rank(results, sortBy = 'relevance') {
    return [...results].sort((a, b) => {
      if (sortBy === 'rating')    return b.rating - a.rating;
      if (sortBy === 'newest')    return new Date(b.releaseDate) - new Date(a.releaseDate);
      if (sortBy === 'popular')   return b.downloads - a.downloads;
      if (sortBy === 'price-asc') return a.startingPrice - b.startingPrice;
      return b.relevanceScore - a.relevanceScore;
    });
  }
};

/* ============================================================
   BOOKMARKS MODULE
   ============================================================ */
const Bookmarks = {
  getAll() { return YakkayStore.get('bookmarks'); },
  has(id) { return this.getAll().some(b => b.id === id); },
  toggle(product) {
    let bookmarks = this.getAll();
    if (this.has(product.id)) {
      bookmarks = bookmarks.filter(b => b.id !== product.id);
      Toast.info(`Removed "${product.name}" from bookmarks`);
    } else {
      bookmarks.push({ id: product.id, name: product.name, addedAt: new Date().toISOString() });
      Toast.success(`Bookmarked "${product.name}"`);
    }
    YakkayStore.set('bookmarks', bookmarks);
    YakkayStore.persist('bookmarks');
    EventBus.emit('bookmarks:change', bookmarks);
  }
};

/* ============================================================
   RECENTLY VIEWED
   ============================================================ */
const RecentlyViewed = {
  add(product) {
    let recent = YakkayStore.get('recentlyViewed');
    recent = recent.filter(r => r.id !== product.id);
    recent.unshift({ id: product.id, name: product.name, viewedAt: new Date().toISOString() });
    if (recent.length > 10) recent = recent.slice(0, 10);
    YakkayStore.set('recentlyViewed', recent);
    YakkayStore.persist('recentlyViewed');
  },
  getAll() { return YakkayStore.get('recentlyViewed'); }
};

/* ============================================================
   COMPARE MODULE
   ============================================================ */
const Compare = {
  MAX: 4,
  items: [],
  add(product) {
    if (this.items.length >= this.MAX) {
      Toast.warning(`Compare limit is ${this.MAX} products. Remove one first.`);
      return false;
    }
    if (this.items.some(i => i.id === product.id)) {
      Toast.info('Already in compare list');
      return false;
    }
    this.items.push(product);
    Toast.success(`Added "${product.name}" to compare`);
    EventBus.emit('compare:update', this.items);
    this.updateBadge();
    return true;
  },
  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    EventBus.emit('compare:update', this.items);
    this.updateBadge();
  },
  clear() { this.items = []; EventBus.emit('compare:update', []); this.updateBadge(); },
  updateBadge() {
    const badge = document.getElementById('compare-badge');
    if (badge) {
      badge.textContent = this.items.length;
      badge.style.display = this.items.length ? 'inline' : 'none';
    }
  }
};

/* Make globals available */
window.YakkayStore = YakkayStore;
window.Security    = Security;
window.Router      = Router;
window.API         = API;
window.EventBus    = EventBus;
window.Utils       = Utils;
window.Toast       = Toast;
window.ThemeManager= ThemeManager;
window.A11y        = A11y;
window.Modal       = Modal;
window.Dropdown    = Dropdown;
window.Tabs        = Tabs;
window.Sidebar     = Sidebar;
window.SearchEngine= SearchEngine;
window.Bookmarks   = Bookmarks;
window.RecentlyViewed = RecentlyViewed;
window.Compare     = Compare;
