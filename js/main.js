import { SERVICES } from './services-data.js';

const WHATSAPP_NUMBER = '919514553322';
const WHATSAPP_MESSAGE = "Hi, I'd like to book an appointment at Naturals Kumarapuram";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initWhatsAppFab();
  highlightActiveNav();
  initMediaCarousel();
  document.querySelectorAll('[data-services-tabs]').forEach(initServicesTabs);
});

function initMobileNav() {
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  const closeBtn = document.querySelector('.nav-close');
  if (!toggle || !mobileNav) return;

  const open = () => {
    mobileNav.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    mobileNav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
}

function initWhatsAppFab() {
  const fab = document.querySelector('.whatsapp-fab');
  if (!fab) return;
  fab.href = WHATSAPP_URL;
  fab.setAttribute('aria-label', 'Book appointment on WhatsApp');
  fab.setAttribute('target', '_blank');
  fab.setAttribute('rel', 'noopener noreferrer');
}

function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-desktop a, .nav-mobile a').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http')) return;
    const linkPage = href.split('/').pop() || 'index.html';
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function initServicesTabs(root) {
  const genderTabs = root.querySelectorAll('.gender-tab');
  const categoryTabs = root.querySelectorAll('.category-tab');
  const panels = root.querySelectorAll('.service-panel');
  let gender = 'women';
  let category = 'hair';

  function render() {
    panels.forEach((panel) => {
      const match = panel.dataset.gender === gender && panel.dataset.category === category;
      panel.classList.toggle('active', match);
    });
    genderTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.gender === gender));
    categoryTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.category === category));
  }

  genderTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      gender = tab.dataset.gender;
      render();
    });
  });

  categoryTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      category = tab.dataset.category;
      render();
    });
  });

  render();
}

function initMediaCarousel() {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  const dotsContainer = carousel.querySelector('.carousel-dots');
  let current = 0;
  let timer = null;
  const INTERVAL = 5000;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = [...dotsContainer.querySelectorAll('.carousel-dot')];

  function pauseAllVideos() {
    slides.forEach((slide) => {
      const video = slide.querySelector('video');
      if (video) { video.pause(); video.currentTime = 0; }
    });
  }

  function playCurrentVideo() {
    slides[current].querySelector('video')?.play().catch(() => {});
  }

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    pauseAllVideos();
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    playCurrentVideo();
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', resetTimer);

  playCurrentVideo();
  resetTimer();
}

export { WHATSAPP_URL, SERVICES };
