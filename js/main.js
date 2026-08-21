/* ============================================================
   Emmanuel Basua — EE Portfolio
   Tiny window manager for the drafting-table desktop.
   ============================================================ */

(() => {
  'use strict';

  const desktop   = document.getElementById('desktop');
  const taskbarApps = document.getElementById('taskbar-apps');
  const windows   = Array.from(document.querySelectorAll('.window'));
  const icons     = Array.from(document.querySelectorAll('.icon'));
  const topNav    = Array.from(document.querySelectorAll('.topbar__nav button'));
  const topClock  = document.getElementById('topbar-clock');

  let highestZ = 10;
  let activeId = null;

  const APP_LABELS = {
    'about-win': 'About.txt',
    'skills-win': 'Toolset.sh',
    'projects-win': 'Projects',
    'experience-win': 'Record.log',
    'contact-win': 'Contact',
  };

  const OPEN_OFFSET = { x: 40, y: 34 }; // cascade so windows don't stack exactly

  const state = {}; // id -> { open, minimized, pill }
  const APP_ICONS = {
    'about-win': 'user-round',
    'skills-win': 'cpu',
    'projects-win': 'folder',
    'experience-win': 'briefcase-business',
    'contact-win': 'mail',
  };

  windows.forEach((w, i) => {
    state[w.id] = { open: false, minimized: false, pill: null };
    // Cascade default position a little per window so they don't fully overlap
    w.style.left = (150 + i * 26) + 'px';
    w.style.top = (66 + i * 22) + 'px';
  });

  /* ---------------- Boot sequence ---------------- */
  function boot() {
    const bootEl = document.getElementById('boot');
    const linesEl = document.getElementById('boot-lines');
    const fill = document.getElementById('boot-fill');
    const lines = [
      ['WORKBENCH_OS v2.4 — booting…', ''],
      ['loading font tables', 'ok'],
      ['calibrating window manager', 'ok'],
      ['mounting /portfolio', 'ok'],
      ['user: E. BASUA — ELECTRICAL & COMPUTER ENG', 'dim'],
      ['ready.', 'ok'],
    ];

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      bootEl.classList.add('hidden');
      return;
    }

    let i = 0;
    function printNext() {
      if (i >= lines.length) {
        fill.style.width = '100%';
        setTimeout(() => bootEl.classList.add('hidden'), 220);
        return;
      }
      const [text, cls] = lines[i];
      const row = document.createElement('div');
      if (cls) row.className = cls;
      row.textContent = (cls === 'ok' ? '  [ok] ' : cls === 'dim' ? '  ' : '') + text;
      linesEl.appendChild(row);
      fill.style.width = Math.round(((i + 1) / lines.length) * 100) + '%';
      i++;
      setTimeout(printNext, 180 + Math.random() * 120);
    }
    setTimeout(printNext, 200);
  }

  /* ---------------- Window lifecycle ---------------- */
  function bringToFront(win) {
    highestZ += 1;
    win.style.zIndex = highestZ;
    setActive(win.id);
  }

  function setActive(id) {
    activeId = id;
    windows.forEach(w => w.classList.toggle('is-active', w.id === id));
    document.querySelectorAll('.taskbar__apps .pill').forEach(p => {
      p.classList.toggle('is-active', p.dataset.app === id && !state[id].minimized);
    });
  }

  function openWindow(id, originEl) {
    const win = document.getElementById(id);
    if (!win) return;
    const s = state[id];

    if (originEl) {
      const r = originEl.getBoundingClientRect();
      win.style.setProperty('--origin-x', (r.left + r.width / 2) + 'px');
      win.style.setProperty('--origin-y', (r.top + r.height / 2) + 'px');
    }

    if (!s.open) {
      s.open = true;
      win.classList.remove('is-closing');
      win.classList.add('is-open');
      addTaskbarPill(id);
      const icon = icons.find(ic => ic.dataset.target === id);
      if (icon) icon.classList.add('is-running');
    }
    s.minimized = false;
    win.classList.remove('is-minimized');
    win.classList.add('is-open');
    clampToViewport(win);
    bringToFront(win);
  }

  function closeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    const s = state[id];
    if (!s.open) return;
    s.open = false;
    s.minimized = false;
    win.classList.add('is-closing');
    const done = () => {
      win.classList.remove('is-open', 'is-closing');
      win.removeEventListener('animationend', done);
    };
    win.addEventListener('animationend', done);
    removeTaskbarPill(id);
    const icon = icons.find(ic => ic.dataset.target === id);
    if (icon) icon.classList.remove('is-running');
    if (activeId === id) activeId = null;
  }

  function toggleMaximize(id) {
    const win = document.getElementById(id);
    if (!win) return;
    const isMax = win.classList.toggle('is-maximized');
    if (isMax) {
      win.dataset.prevLeft = win.style.left; win.dataset.prevTop = win.style.top;
      win.dataset.prevWidth = win.style.width; win.dataset.prevHeight = win.style.height;
      win.style.left = '14px'; win.style.top = '72px'; win.style.width = 'calc(100vw - 28px)'; win.style.height = 'calc(100vh - 130px)';
    } else {
      win.style.left = win.dataset.prevLeft || ''; win.style.top = win.dataset.prevTop || '';
      win.style.width = win.dataset.prevWidth || ''; win.style.height = win.dataset.prevHeight || '';
      clampToViewport(win);
    }
    bringToFront(win);
  }

  function toggleMinimize(id) {
    const win = document.getElementById(id);
    const s = state[id];
    if (!s.open) { openWindow(id); return; }
    if (s.minimized) {
      s.minimized = false;
      win.classList.remove('is-minimized');
      bringToFront(win);
    } else {
      s.minimized = true;
      win.classList.add('is-minimized');
      if (activeId === id) activeId = null;
      document.querySelectorAll('.taskbar__apps .pill').forEach(p => p.classList.remove('is-active'));
    }
  }

  function clampToViewport(win) {
    const rect = win.getBoundingClientRect();
    const maxLeft = window.innerWidth - Math.min(rect.width, window.innerWidth) - 4;
    const maxTop = window.innerHeight - 60 - 40;
    let left = parseInt(win.style.left, 10) || 0;
    let top = parseInt(win.style.top, 10) || 0;
    left = Math.max(4, Math.min(left, Math.max(4, maxLeft)));
    top = Math.max(4, Math.min(top, Math.max(4, maxTop)));
    win.style.left = left + 'px';
    win.style.top = top + 'px';
  }

  /* ---------------- Taskbar pills ---------------- */
  function addTaskbarPill(id) {
    if (state[id].pill) return;
    const pill = document.createElement('button');
    pill.className = 'pill';
    pill.dataset.app = id;
    pill.type = 'button';
    pill.title = APP_LABELS[id] || id;
    pill.setAttribute('aria-label', `Open ${APP_LABELS[id] || id}`);
    pill.innerHTML = `<span class="dock-icon"><i data-lucide="${APP_ICONS[id] || 'app-window'}"></i></span><span class="dock-label">${APP_LABELS[id] || id}</span><span class="led"></span>`;
    pill.addEventListener('click', () => {
      if (!state[id].open) openWindow(id);
      else if (state[id].minimized) toggleMinimize(id);
      else if (activeId === id) toggleMinimize(id);
      else bringToFront(document.getElementById(id));
    });
    taskbarApps.appendChild(pill);
    state[id].pill = pill;
    if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
  }

  function buildDock() {
    windows.forEach(win => addTaskbarPill(win.id));
  }

  function removeTaskbarPill(id) {
    const s = state[id];
    if (s.pill) {
      s.pill.remove();
      s.pill = null;
    }
  }

  /* ---------------- Dragging ---------------- */
  let dragWin = null, offsetX = 0, offsetY = 0;

  function dragStart(e, win) {
    if (window.innerWidth <= 760) return; // full-screen sheets on mobile: no dragging
    if (e.target.closest('.window-controls, button, a, input, textarea, select')) return;
    bringToFront(win);
    dragWin = win;
    const point = e.touches ? e.touches[0] : e;
    offsetX = point.clientX - win.offsetLeft;
    offsetY = point.clientY - win.offsetTop;
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchmove', dragMove, { passive: false });
    document.addEventListener('touchend', dragEnd);
  }

  function dragMove(e) {
    if (!dragWin) return;
    if (e.cancelable) e.preventDefault();
    const point = e.touches ? e.touches[0] : e;
    let left = point.clientX - offsetX;
    let top = point.clientY - offsetY;
    left = Math.max(-40, Math.min(left, window.innerWidth - 60));
    top = Math.max(0, Math.min(top, window.innerHeight - 60));
    dragWin.style.left = left + 'px';
    dragWin.style.top = top + 'px';
  }

  function dragEnd() {
    dragWin = null;
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', dragEnd);
    document.removeEventListener('touchmove', dragMove);
    document.removeEventListener('touchend', dragEnd);
  }

  /* ---------------- Wire up events ---------------- */
  topNav.forEach(btn => btn.addEventListener('click', () => openWindow(btn.dataset.target, btn)));

  document.querySelectorAll('[data-target]').forEach(btn => {
    if (btn.closest('.topbar__nav') || btn.classList.contains('icon')) return;
    btn.addEventListener('click', () => openWindow(btn.dataset.target, btn));
  });

  icons.forEach(icon => {
    icon.addEventListener('click', () => {
      icons.forEach(i => i.classList.remove('is-selected'));
      icon.classList.add('is-selected');
      openWindow(icon.dataset.target, icon);
    });
    icon.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        icon.click();
      }
    });
  });

  desktop.addEventListener('click', e => {
    if (e.target === desktop || e.target.closest('.hero-panel') || e.target.closest('.workspace-label')) {
      icons.forEach(i => i.classList.remove('is-selected'));
    }
  });

  windows.forEach(win => {
    win.addEventListener('mousedown', () => bringToFront(win));
    const header = win.querySelector('.window-header');
    header.addEventListener('mousedown', e => dragStart(e, win));
    header.addEventListener('touchstart', e => dragStart(e, win), { passive: true });
    win.querySelector('.minimize-btn').addEventListener('click', e => { e.stopPropagation(); toggleMinimize(win.id); });
    win.querySelector('.maximize-btn').addEventListener('click', e => { e.stopPropagation(); toggleMaximize(win.id); });
    win.querySelector('.close-btn').addEventListener('click', e => {
      e.stopPropagation();
      closeWindow(win.id);
    });
  });

  document.getElementById('start-btn').addEventListener('click', () => {
    openWindow('about-win');
  });

  buildDock();

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && activeId) closeWindow(activeId);
  });

  window.addEventListener('resize', () => {
    windows.forEach(w => { if (state[w.id].open) clampToViewport(w); });
  });

  /* ---------------- Clock & uptime ---------------- */
  const clockEl = document.getElementById('clock');
  const uptimeEl = document.getElementById('uptime');
  const bootTime = Date.now();

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now = new Date();
    const formatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    clockEl.textContent = formatted;
    if (topClock) topClock.textContent = formatted;
    const secs = Math.floor((Date.now() - bootTime) / 1000);
    const h = pad(Math.floor(secs / 3600));
    const m = pad(Math.floor((secs % 3600) / 60));
    const s = pad(secs % 60);
    uptimeEl.textContent = `SYS_UPTIME ${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);

  /* ---------------- Boot on load, open About by default ---------------- */
  boot();
  setTimeout(() => {
    openWindow('about-win', icons[0]);
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 100 : 1500);

})();
