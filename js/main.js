(() => {
 const loader=document.getElementById('loader');
 window.addEventListener('load',()=>setTimeout(()=>loader.classList.add('done'),900));
 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=document.querySelector(a.getAttribute('href'));if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'})}}));
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in-view')}),{threshold:.12});
 document.querySelectorAll('.section-head,.project,.about-statement,.facts,.cap,.timeline article,.awards div,.contact-right').forEach(el=>observer.observe(el));
 const ticker=document.querySelector('.ticker'); let x=0; setInterval(()=>{if(innerWidth>700){x-=.35;if(Math.abs(x)>220)x=0;ticker.style.transform=`translateX(${x}px)`}},16);
 document.querySelector('footer span:last-child')?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
})();
