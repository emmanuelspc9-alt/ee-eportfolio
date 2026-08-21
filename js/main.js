(() => {
  "use strict";
  const windows=[...document.querySelectorAll(".window")], icons=[...document.querySelectorAll(".icon")];
  const taskbar=document.getElementById("taskbar-apps");
  const state={}; let z=20,active=null,drag=null;
  const labels={ "about-win":"About","skills-win":"Toolset","projects-win":"Projects","experience-win":"Experience","contact-win":"Contact" };

  windows.forEach((w,i)=>{state[w.id]={open:false,min:false,pill:null};w.style.left=`${Math.max(50,window.innerWidth/2-w.offsetWidth/2+i*18)}px`;w.style.top=`${Math.max(70,window.innerHeight/2-w.offsetHeight/2+i*12)}px`;});

  function front(w){w.style.zIndex=++z;active=w.id;windows.forEach(x=>x.classList.toggle("is-active",x===w));document.querySelectorAll(".pill").forEach(p=>p.classList.toggle("is-active",p.dataset.app===w.id&&!state[w.id].min))}
  function addPill(id){if(window.innerWidth<=760||state[id].pill)return;const p=document.createElement("button");p.className="pill";p.dataset.app=id;p.textContent=labels[id];p.onclick=()=>toggleMin(id);taskbar.appendChild(p);state[id].pill=p}
  function removePill(id){state[id].pill?.remove();state[id].pill=null}
  function clamp(w){if(window.innerWidth<=760)return;const r=w.getBoundingClientRect(), maxX=window.innerWidth-r.width-12,maxY=window.innerHeight-75-r.height;w.style.left=Math.max(12,Math.min(parseInt(w.style.left)||12,maxX))+"px";w.style.top=Math.max(12,Math.min(parseInt(w.style.top)||12,maxY))+"px"}
  function open(id,origin){const w=document.getElementById(id),s=state[id];if(!w)return;if(origin){const r=origin.getBoundingClientRect();w.style.setProperty("--origin-x",`${r.left+r.width/2}px`);w.style.setProperty("--origin-y",`${r.top+r.height/2}px`)}if(!s.open){s.open=true;w.classList.remove("is-closing");w.classList.add("is-open");addPill(id);document.querySelector(`[data-target="${id}"]`)?.classList.add("is-running")}s.min=false;w.classList.remove("is-minimized");clamp(w);front(w)}
  function close(id){const w=document.getElementById(id),s=state[id];if(!s.open)return;s.open=false;s.min=false;w.classList.add("is-closing");setTimeout(()=>w.classList.remove("is-open","is-closing"),190);removePill(id);document.querySelector(`[data-target="${id}"]`)?.classList.remove("is-running");if(active===id)active=null}
  function toggleMin(id){const w=document.getElementById(id),s=state[id];if(!s.open)return open(id);s.min=!s.min;w.classList.toggle("is-minimized",s.min);if(!s.min)front(w)}
  icons.forEach(i=>{i.onclick=()=>open(i.dataset.target,i);i.ondblclick=()=>open(i.dataset.target,i)});
  document.querySelectorAll("[data-target]").forEach(b=>{if(!b.classList.contains("icon"))b.addEventListener("click",()=>open(b.dataset.target,b))});
  windows.forEach(w=>{w.addEventListener("mousedown",()=>front(w));const h=w.querySelector(".window-header");h.addEventListener("mousedown",e=>{if(e.target.closest("button")||window.innerWidth<=760)return;front(w);drag={w,ox:e.clientX-w.offsetLeft,oy:e.clientY-w.offsetTop}});w.querySelector(".close-btn").onclick=e=>{e.stopPropagation();close(w.id)};w.querySelector(".min-btn").onclick=e=>{e.stopPropagation();toggleMin(w.id)}})
  document.addEventListener("mousemove",e=>{if(!drag)return;drag.w.style.left=Math.max(8,Math.min(e.clientX-drag.ox,window.innerWidth-drag.w.offsetWidth-8))+"px";drag.w.style.top=Math.max(8,Math.min(e.clientY-drag.oy,window.innerHeight-drag.w.offsetHeight-70))+"px"});
  document.addEventListener("mouseup",()=>drag=null);
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&active)close(active)});
  document.getElementById("start-btn").onclick=()=>open("about-win");
  window.addEventListener("resize",()=>windows.forEach(w=>state[w.id]?.open&&clamp(w)));

  const clock=document.getElementById("clock"),uptime=document.getElementById("uptime"),start=Date.now(),pad=n=>String(n).padStart(2,"0");
  function tick(){const d=new Date();clock.textContent=d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});let s=Math.floor((Date.now()-start)/1000);uptime.textContent=`SYS_UPTIME ${pad(s/3600|0)}:${pad(s/60%60|0)}:${pad(s%60)}`}
  tick();setInterval(tick,1000);

  const boot=document.getElementById("boot"),lines=document.getElementById("boot-lines"),fill=document.getElementById("boot-fill");
  const bootLines=[["INITIALISING ENGINEERING WORKSPACE",""],["loading interface modules","ok"],["mounting portfolio /projects","ok"],["calibrating interaction layer","ok"],["loading profile: E. BASUA","dim"],["workspace ready","ok"]];
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){boot.classList.add("hidden");open("about-win",icons[0])}
  else{let i=0;const next=()=>{if(i>=bootLines.length){fill.style.width="100%";setTimeout(()=>{boot.classList.add("hidden");open("about-win",icons[0])},250);return}const [t,c]=bootLines[i++],r=document.createElement("div");r.className=c;r.textContent=(c==="ok"?"  [ok] ":"  ")+t;lines.appendChild(r);fill.style.width=`${i/bootLines.length*100}%`;setTimeout(next,150+Math.random()*120)};setTimeout(next,180)}
})();
