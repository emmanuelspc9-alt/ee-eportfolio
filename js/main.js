(() => {
  const reveal = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in-view'); }), {threshold:.12});
  document.querySelectorAll('.section-head,.project,.about-statement,.facts,.timeline article,.awards div,.skill-card,.artifact,.contact-right').forEach(el => { el.classList.add('reveal'); reveal.observe(el); });

  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href')); if(!target) return;
    e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'});
    document.querySelectorAll('.nav nav a').forEach(x => x.classList.toggle('active', x.getAttribute('href') === a.getAttribute('href')));
  }));

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if(entry.isIntersecting){ const id='#'+entry.target.id; document.querySelectorAll('.nav nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href')===id)); }
  }), {rootMargin:'-35% 0px -55% 0px', threshold:0});
  ['about','work','experience','skills','artifacts','contact'].forEach(id => {const el=document.getElementById(id); if(el) observer.observe(el);});

  document.querySelectorAll('.expand-project').forEach(button => button.addEventListener('click', () => {
    const details = button.nextElementSibling; if(!details) return;
    const open = details.classList.toggle('open'); button.setAttribute('aria-expanded', open); button.firstChild.textContent = open ? 'Hide project ' : 'View project ';
  }));

  document.querySelectorAll('.detail-tabs button').forEach(tab => tab.addEventListener('click', () => {
    const tabs = tab.closest('.detail-tabs'); const details = tabs.closest('.project-details');
    tabs.querySelectorAll('button').forEach(x=>x.classList.remove('active')); tab.classList.add('active');
    details.querySelectorAll('.detail-pane').forEach(p=>p.classList.toggle('active', p.dataset.pane===tab.dataset.tab));
  }));


})();
