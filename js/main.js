(() => {
 const loader=document.getElementById('loader');
 window.addEventListener('load',()=>setTimeout(()=>loader.classList.add('done'),900));
 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=document.querySelector(a.getAttribute('href'));if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'})}}));
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in-view')}),{threshold:.12});
 document.querySelectorAll('.section-head,.project,.about-statement,.facts,.cap,.timeline article,.awards div,.contact-right,.artifact,.skill-group').forEach(el=>observer.observe(el));
 document.querySelector('footer span:last-child')?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

 document.querySelectorAll('.project-toggle').forEach(button=>{
   button.addEventListener('click',()=>{
     const card=button.closest('.project');
     const details=card?.querySelector('.project-details');
     if(!details) return;
     const open=!details.hasAttribute('hidden');
     if(open){details.setAttribute('hidden','');button.setAttribute('aria-expanded','false');button.firstChild.textContent='View project ';}
     else{details.removeAttribute('hidden');button.setAttribute('aria-expanded','true');button.firstChild.textContent='Hide project ';setTimeout(()=>details.scrollIntoView({behavior:'smooth',block:'nearest'}),80)}
   });
 });

 const skillRail=document.querySelector('.skill-rail');
 if(skillRail){
   skillRail.addEventListener('mouseenter',()=>skillRail.style.animationPlayState='paused');
   skillRail.addEventListener('mouseleave',()=>skillRail.style.animationPlayState='running');
 }

 const sections=[...document.querySelectorAll('main section[id]')];
 const navLinks=[...document.querySelectorAll('.nav nav a')];
 const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));}
 }),{rootMargin:'-35% 0px -55% 0px',threshold:0});
 sections.forEach(s=>navObserver.observe(s));
})();
