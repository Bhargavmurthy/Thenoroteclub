// ============================================
// THE NO-ROTE CLUB — interactions
// ============================================

document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- NAV: scrolled state + mobile menu ---------- */
const nav = document.getElementById('nav');
const navBurger = document.getElementById('navBurger');
const navMobile = document.getElementById('navMobile');

function updateNavState() {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
}
updateNavState();
window.addEventListener('scroll', updateNavState, { passive: true });

navBurger.addEventListener('click', () => {
  const isOpen = navMobile.classList.toggle('open');
  navBurger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  navBurger.classList.toggle('open');
});

navMobile.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navMobile.classList.remove('open');
    navBurger.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- HERO: scroll wipes the "rote noise" away ---------- */
const heroNoise = document.getElementById('heroNoise');
const hero = document.querySelector('.hero');
const logoWrap = document.getElementById('logoWrap');

function updateHeroScrub() {
  const heroHeight = hero.offsetHeight;
  const scrollY = window.scrollY;
  // progress 0 -> 1 across the hero's height
  const progress = Math.min(Math.max(scrollY / (heroHeight * 0.9), 0), 1);

  if (heroNoise) {
    heroNoise.style.opacity = String(1 - progress);
    heroNoise.style.transform = `scale(${1 + progress * 0.15}) translateY(${progress * -40}px)`;
  }
  if (logoWrap) {
    const scale = 1 + progress * 0.08;
    logoWrap.style.transform = `scale(${scale})`;
    logoWrap.style.filter = `drop-shadow(0 ${18 + progress * 20}px ${30 + progress * 20}px rgba(214,51,108,${0.18 + progress * 0.12}))`;
  }
}
updateHeroScrub();
window.addEventListener('scroll', updateHeroScrub, { passive: true });

/* ---------- Canvas: drifting chalk scribbles behind hero text ---------- */
const canvas = document.getElementById('scribbleCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = hero.offsetHeight;
}

function makeParticles() {
  particles = [];
  const count = window.innerWidth < 700 ? 16 : 30;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.25 + 0.05
    });
  }
}

let heroScrollProgress = 0;
function trackHeroProgress() {
  const heroHeight = hero.offsetHeight;
  heroScrollProgress = Math.min(Math.max(window.scrollY / (heroHeight * 0.9), 0), 1);
}
window.addEventListener('scroll', trackHeroProgress, { passive: true });

function drawParticles() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const fade = 1 - heroScrollProgress;
  particles.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(214, 51, 108, ${p.opacity * fade})`;
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}

if (canvas && !prefersReducedMotion) {
  resizeCanvas();
  makeParticles();
  drawParticles();
  window.addEventListener('resize', () => {
    resizeCanvas();
    makeParticles();
  });
} else if (canvas) {
  resizeCanvas();
}

/* ---------- Scroll reveal for sections ---------- */
const revealEls = document.querySelectorAll('.reveal');

revealEls.forEach((el, i) => {
  // stagger cards within the same grid group
  const group = el.closest('.mission-grid, .solution-flow, .support-grid, .problem-list');
  if (group) {
    const siblings = Array.from(group.children).filter(c => c.classList.contains('reveal'));
    const idx = siblings.indexOf(el);
    el.style.setProperty('--delay', `${Math.min(idx * 0.12, 0.5)}s`);
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');

      // trigger syllabus bar fill when its row appears
      const fillBar = entry.target.querySelector('.syllabus-fill');
      if (fillBar) {
        requestAnimationFrame(() => fillBar.classList.add('filled'));
      }

      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ---------- Scribble drift (subtle parallax on hero text fragments) ---------- */
if (!prefersReducedMotion) {
  const scribbles = document.querySelectorAll('.scribble');
  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    scribbles.forEach((s, i) => {
      const depth = (i % 4) + 1;
      s.style.translate = `${dx * depth * 2}px ${dy * depth * 2}px`;
    });
  }, { passive: true });
}

/* ---------- Smooth-scroll offset correction for fixed nav ---------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 86;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
});
