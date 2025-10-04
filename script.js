/* ============================
   Simple, robust interactivity
   ============================ */

/* DOM helpers */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ===== Mobile Menu Toggle ===== */
const menuToggle = $('#menuToggle');
const navLinks = $('#navLinks');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // simple aria
    const expanded = navLinks.classList.contains('open');
    menuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  });
}

/* ===== Smooth scroll for links ===== */
const navAnchors = $$('.nav-link');
navAnchors.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (target) {
      // close mobile nav if open
      navLinks.classList.remove('open');
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===== HERO SLIDER ===== */
const slides = $$('.slide');
const dotsWrap = $('#dots');
const prevBtn = $('#prevSlide') || document.createElement('button');
const nextBtn = $('#nextSlide') || document.createElement('button');
let current = 0;
let autoTimer = null;

// Build dots
slides.forEach((s, i) => {
  const d = document.createElement('div');
  d.className = 'dot' + (i === 0 ? ' active' : '');
  d.addEventListener('click', () => goToSlide(i));
  dotsWrap.appendChild(d);
});
const dots = $$('.dot', dotsWrap);

function showSlide(idx){
  slides.forEach((s, i) => s.classList.toggle('active', i === idx));
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  current = idx;
}

// Prev / Next handlers
const prev = document.getElementById('prevSlide') || prevBtn;
const next = document.getElementById('nextSlide') || nextBtn;
prev.addEventListener('click', () => goToSlide((current - 1 + slides.length) % slides.length));
next.addEventListener('click', () => goToSlide((current + 1) % slides.length));

function goToSlide(i){
  showSlide(i);
  resetAuto();
}

function autoPlay(){
  autoTimer = setInterval(() => {
    goToSlide((current + 1) % slides.length);
  }, 5000);
}
function resetAuto(){
  if (autoTimer) clearInterval(autoTimer);
  autoPlay();
}

// Start
showSlide(0);
autoPlay();

/* ===== FAQ Accordion ===== */
$$('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const parent = btn.parentElement;
    const answer = parent.querySelector('.faq-a');
    const open = answer.style.display === 'block';
    // close all
    $$('.faq-a').forEach(a => a.style.display = 'none');
    if (!open) answer.style.display = 'block';
  });
});

/* ===== Contact form validation ===== */
const contactForm = $('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#name', contactForm).value.trim();
    const email = $('#email', contactForm).value.trim();
    const message = $('#message', contactForm).value.trim();
    const msgEl = $('#formMessage');
    if (!name || !email || !message) {
      msgEl.style.color = 'crimson';
      msgEl.textContent = 'Please fill all fields.';
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      msgEl.style.color = 'crimson';
      msgEl.textContent = 'Enter a valid email address.';
      return;
    }
    // simulate send
    msgEl.style.color = 'green';
    msgEl.textContent = 'Message sent. We will contact you soon. ✅';
    contactForm.reset();
    setTimeout(()=> msgEl.textContent = '', 5000);
  });
}

/* ===== Highlight nav on scroll ===== */
const sections = $$('main section[id], main section'); // many sections
window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 120;
  navAnchors.forEach(link => link.classList.remove('active'));
  sections.forEach(sec => {
    const id = sec.id;
    if (!id) return;
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    if (scrollPos >= top && scrollPos < bottom) {
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
});

/* ===== Ensure top on reload ===== */
window.onbeforeunload = () => window.scrollTo(0,0);
