(() => {
  const loader = document.getElementById('loader');
  const layer = document.getElementById('windowLayer');
  const desktop = document.getElementById('desktop');
  const menuTime = document.getElementById('menuTime');
  let z = 20;
  const windows = new Map();
  const defs = {
    home: {title:'Welcome', icon:'⌂', source:'hero'},
    work: {title:'Projects', icon:'▦', source:'work'},
    about: {title:'About Emmanuel', icon:'◎', source:'about'},
    experience: {title:'Experience', icon:'◫', source:'experience'},
    contact: {title:'Contact', icon:'✉', source:'contact'},
    cv: {title:'CV', icon:'PDF', href:'assets/emmanuel-basua-cv.pdf'}
  };

  window.addEventListener('load', () => setTimeout(() => loader?.classList.add('done'), 700));

  // Move the existing portfolio sections into desktop windows.
  const hero = document.querySelector('.hero');
  const work = document.getElementById('work');
  const about = document.getElementById('about');
  const experience = document.getElementById('experience');
  const contact = document.getElementById('contact');
  const sources = {hero, work, about, experience, contact};
  Object.values(sources).forEach(el => { if (el) el.remove(); });

  function openApp(app, opts={}) {
    const def = defs[app];
    if (!def) return;
    if (def.href) { window.open(def.href, '_blank'); return; }
    if (windows.has(app)) {
      const w = windows.get(app); w.classList.remove('minimized'); focus(w); return;
    }
    const w = document.createElement('section');
    w.className = 'app-window';
    w.dataset.app = app;
    w.innerHTML = `
      <div class="window-titlebar">
        <div class="traffic"><button class="close" aria-label="Close"></button><button class="min" aria-label="Minimize"></button><button class="max" aria-label="Maximize"></button></div>
        <div class="window-title"><span>${def.icon}</span>${def.title}</div><div class="window-spacer"></div>
      </div>
      <div class="window-body"></div>`;
    layer.appendChild(w);
    const body = w.querySelector('.window-body');
    const src = sources[def.source];
    if (src) body.appendChild(src.cloneNode(true));
    if (app === 'home') {
      body.innerHTML = `<div class="home-window">
        <div class="home-kicker">ELECTRICAL & COMPUTER ENGINEERING · CAPE TOWN</div>
        <h1>I build systems<br>that <em>move.</em></h1>
        <p>Embedded hardware, signal processing and control systems — from block diagram to working prototype.</p>
        <div class="home-actions"><button class="desktop-button primary" data-open="work">Explore Projects <span>↗</span></button><button class="desktop-button" data-open="contact">Start a Conversation <span>↗</span></button></div>
        <div class="home-stats"><div><b>04+</b><span>engineering domains</span></div><div><b>UCT</b><span>Electrical & Computer Engineering</span></div><div><b>∞</b><span>things still to build</span></div></div>
      </div>`;
    }
    if (app === 'contact') body.querySelector('.contact')?.classList.add('window-contact');
    if (app === 'work') body.querySelector('.work')?.classList.add('window-section');
    if (app === 'about') body.querySelector('.about')?.classList.add('window-section');
    if (app === 'experience') body.querySelector('.experience')?.classList.add('window-section');
    place(w, opts.x, opts.y); layer.appendChild(w); focus(w); windows.set(app,w);
    bindWindow(w);
  }

  function place(w, x, y) {
    const isSmall = innerWidth < 760;
    w.style.left = `${x ?? (isSmall ? 18 : 90 + Math.random()*120)}px`;
    w.style.top = `${y ?? (isSmall ? 72 : 92 + Math.random()*45)}px`;
    if (isSmall) { w.style.width='calc(100vw - 36px)'; w.style.height='calc(100vh - 150px)'; }
  }
  function focus(w) { z++; w.style.zIndex=z; document.querySelectorAll('.app-window').forEach(x=>x.classList.remove('focused')); w.classList.add('focused'); }
  function close(w) { windows.delete(w.dataset.app); w.remove(); }
  function minimize(w) { w.classList.add('minimized'); }
  function maximize(w) { w.classList.toggle('maximized'); focus(w); }

  function bindWindow(w) {
    const bar=w.querySelector('.window-titlebar');
    w.addEventListener('mousedown',()=>focus(w));
    w.querySelector('.close').onclick=e=>{e.stopPropagation();close(w)};
    w.querySelector('.min').onclick=e=>{e.stopPropagation();minimize(w)};
    w.querySelector('.max').onclick=e=>{e.stopPropagation();maximize(w)};
    let dragging=false,sx=0,sy=0,ox=0,oy=0;
    bar.addEventListener('pointerdown',e=>{ if(e.target.closest('button') || w.classList.contains('maximized')) return; dragging=true;sx=e.clientX;sy=e.clientY;ox=w.offsetLeft;oy=w.offsetTop;bar.setPointerCapture(e.pointerId);w.classList.add('dragging'); });
    bar.addEventListener('pointermove',e=>{ if(!dragging)return; w.style.left=`${Math.max(8,ox+e.clientX-sx)}px`;w.style.top=`${Math.max(34,oy+e.clientY-sy)}px`; });
    bar.addEventListener('pointerup',()=>{dragging=false;w.classList.remove('dragging')});
    w.querySelectorAll('[data-open]').forEach(btn=>btn.addEventListener('click',()=>openApp(btn.dataset.open)));
  }

  document.querySelectorAll('.dock-app,.desktop-icon').forEach(btn=>{
    const event = btn.classList.contains('desktop-icon') ? 'dblclick' : 'click';
    btn.addEventListener(event,()=>openApp(btn.dataset.app));
  });
  document.querySelectorAll('.desktop-icon').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.desktop-icon').forEach(x=>x.classList.remove('selected'));btn.classList.add('selected')}));
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'){const active=[...document.querySelectorAll('.app-window')].sort((a,b)=>+b.style.zIndex-+a.style.zIndex)[0];if(active)close(active)} });

  function tick(){const d=new Date();menuTime.textContent=d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});requestAnimationFrame(()=>setTimeout(tick,1000));} tick();
  openApp('home',{x:70,y:70});
})();
