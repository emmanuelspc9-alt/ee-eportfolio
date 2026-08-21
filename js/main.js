/* ==========================================================================
   MOBILE NAV TOGGLE
   ========================================================================== */
const navToggle = document.getElementById('navToggle');
const rail = document.getElementById('rail');

if (navToggle && rail) {
  navToggle.addEventListener('click', () => {
    const isOpen = rail.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close mobile nav after a link is tapped
  rail.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      rail.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   ACTIVE LINK HIGHLIGHTING ON SCROLL
   ========================================================================== */
const sections = document.querySelectorAll('main section[id]');
const railLinks = document.querySelectorAll('.rail__list a');

const highlightNav = () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 140;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  railLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};
window.addEventListener('scroll', highlightNav, { passive: true });
highlightNav();

/* ==========================================================================
   HERO TERMINAL TYPE EFFECT
   ========================================================================== */
const terminalEl = document.getElementById('terminalLine');
const terminalMessages = [
  '> compiling professional identity...',
  '> loading projects [OK]',
  '> loading artefacts [OK]',
  '> ready.'
];

function typeSequence(el, lines, charDelay = 28, holdDelay = 900) {
  if (!el) return;
  let lineIndex = 0;

  function typeLine() {
    let i = 0;
    el.textContent = '';
    const line = lines[lineIndex];
    const interval = setInterval(() => {
      el.textContent = line.slice(0, i + 1);
      i++;
      if (i === line.length) {
        clearInterval(interval);
        setTimeout(() => {
          lineIndex = (lineIndex + 1) % lines.length;
          typeLine();
        }, holdDelay);
      }
    }, charDelay);
  }
  typeLine();
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (terminalEl) {
  if (prefersReducedMotion) {
    terminalEl.textContent = terminalMessages[terminalMessages.length - 1];
  } else {
    typeSequence(terminalEl, terminalMessages);
  }
}

/* ==========================================================================
   SKILLS — rendered as resistor cards
   Standard resistor colour code used for the value band (1–10 scale).
   Swap the "skills" array below with your own — that's the only edit needed.
   ========================================================================== */
const RESISTOR_COLORS = [
  '#3B3B3B', // 0 black
  '#8B5A2B', // 1 brown
  '#D64545', // 2 red
  '#E07B39', // 3 orange
  '#E8C94B', // 4 yellow
  '#4FAE5C', // 5 green
  '#4B7BE8', // 6 blue
  '#8B5FE8', // 7 violet
  '#9AA0A6', // 8 grey
  '#F2F2F2'  // 9 white
];

const skills = [
  { name: 'Circuit Design (KiCad)', level: 8 },
  { name: 'Embedded C / C++',       level: 7 },
  { name: 'MATLAB & Simulink',      level: 8 },
  { name: 'Power Systems Analysis', level: 6 },
  { name: 'Python',                 level: 7 },
  { name: 'PCB Prototyping',        level: 6 },
  { name: 'Signal Processing',      level: 5 },
  { name: 'Technical Writing',      level: 8 },
];

function resistorSVG(level) {
  const bandColor = RESISTOR_COLORS[Math.min(9, Math.max(0, level))];
  const toleranceColor = '#E8A24B'; // gold tolerance band, fixed
  return `
    <svg viewBox="0 0 220 46" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="23" x2="55" y2="23" stroke="var(--line-bright)" stroke-width="2"/>
      <line x1="165" y1="23" x2="220" y2="23" stroke="var(--line-bright)" stroke-width="2"/>
      <rect x="55" y="6" width="110" height="34" rx="10" fill="#2A2A2A" stroke="var(--line-bright)" stroke-width="1"/>
      <rect x="75" y="6" width="8" height="34" fill="${bandColor}"/>
      <rect x="95" y="6" width="8" height="34" fill="${RESISTOR_COLORS[Math.max(0, level - 2)]}"/>
      <rect x="115" y="6" width="8" height="34" fill="${RESISTOR_COLORS[Math.min(9, level + 1)]}"/>
      <rect x="145" y="6" width="8" height="34" fill="${toleranceColor}"/>
    </svg>
  `;
}

const skillsGrid = document.getElementById('skillsGrid');
if (skillsGrid) {
  skillsGrid.innerHTML = skills.map(skill => `
    <div class="skill-card">
      ${resistorSVG(skill.level)}
      <p class="skill-card__name">${skill.name}</p>
      <p class="skill-card__value mono">PROFICIENCY ${skill.level}/10</p>
    </div>
  `).join('');
}
