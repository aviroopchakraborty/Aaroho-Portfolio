import { aarohoData } from './src/data/aarohoData.js';

/* ── DEFAULT MANIFEST ──────────────────────────────────── */
const DEFAULT_MANIFEST = {
  name: 'Aaroho',
  tagline: 'MUSIC. ENERGY. SOUL.',
  introduction: "[WRITE AAROHO'S BAND INTRODUCTION HERE]",
  logo: './public/media/logo/aaroho-logo.png',
  heroImage: './public/media/hero/band-group-photo.jpg',
  performanceDriveLink: 'https://drive.google.com/drive/folders/1v9LyJA_9iLRQiqFeaX_Lmy2EtVbV_pK0?usp=drive_link',
  members: [],
  videos: [],
  achievements: [],
  certificates: [],
  gallery: [],
  socialLinks: { instagram: '', youtube: '', spotify: '' }
};

const safeArray = (value) => Array.isArray(value) ? value : [];
let manifestHash = '';

const resolveManifest = (data = {}) => {
  const manifest = { ...DEFAULT_MANIFEST, ...data };
  const hasMembers = Array.isArray(data.members);

  aarohoData.name = manifest.name || DEFAULT_MANIFEST.name;
  aarohoData.tagline = manifest.tagline || DEFAULT_MANIFEST.tagline;
  aarohoData.introduction = manifest.introduction || DEFAULT_MANIFEST.introduction;
  aarohoData.logo = manifest.logo || DEFAULT_MANIFEST.logo;
  aarohoData.heroImage = manifest.heroImage || DEFAULT_MANIFEST.heroImage;
  aarohoData.performanceDriveLink = manifest.performanceDriveLink || DEFAULT_MANIFEST.performanceDriveLink;
  aarohoData.members = hasMembers ? safeArray(manifest.members) : safeArray(aarohoData.members);
  aarohoData.videos = safeArray(manifest.videos);
  aarohoData.achievements = safeArray(manifest.achievements);
  aarohoData.certificates = safeArray(manifest.certificates);
  aarohoData.gallery = safeArray(manifest.gallery);
  aarohoData.socialLinks = { ...DEFAULT_MANIFEST.socialLinks, ...(manifest.socialLinks || {}) };
};

const refreshManifest = async () => {
  try {
    const response = await fetch(`./public/media/manifest.json?ts=${Date.now()}`);
    if (!response.ok) return;

    const data = await response.json();
    const nextHash = JSON.stringify(data);

    if (nextHash === manifestHash) return;

    manifestHash = nextHash;
    resolveManifest(data);
    renderAll();
  } catch (error) {
    console.warn('Manifest refresh failed:', error);
  }
};

/* ── DOM REFERENCES ────────────────────────────────────── */
const navToggle = document.querySelector('.nav-toggle');
const navPanel = document.querySelector('.nav-panel');
const heroMedia = document.querySelector('.hero-media');
const heroIntro = document.querySelector('.intro');
const heroTagline = document.querySelector('.tagline');
const heroHeading = document.querySelector('.hero-copy h1');
const logoImage = document.querySelector('.brand img');
const footerLogo = document.querySelector('.footer-logo');
const socialLinks = document.querySelector('.social-links');
const topbar = document.querySelector('.topbar');

const clampText = (value, fallback) => value || fallback;

/* ── NAVBAR: SHRINK ON SCROLL ──────────────────────────── */
const initNavbarScroll = () => {
  if (!topbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      topbar.classList.add('scrolled');
    } else {
      topbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
};

/* ── ACTIVE NAV LINK ON SCROLL ─────────────────────────── */
const initActiveNav = () => {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const setActive = () => {
    // Find the section whose top is closest to (but above) 40% of viewport
    const scrollY = window.scrollY;
    const threshold = window.innerHeight * 0.4;
    let current = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 90; // offset for fixed navbar
      const sectionBottom = sectionTop + section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        current = section.id;
      }
    });

    // Fallback to first section if near top
    if (!current && scrollY < window.innerHeight * 0.5) {
      current = sections[0]?.id || '';
    }

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive(); // run on load
};

/* ── SCROLL REVEAL ANIMATIONS ──────────────────────────── */
const initScrollReveal = () => {
  // Reveal elements
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // Section headings underline
  const headings = document.querySelectorAll('.section-heading');
  const headingObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          headingObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  headings.forEach((h) => headingObserver.observe(h));

  // Stagger children grids
  const staggerEls = document.querySelectorAll('.stagger-children');
  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          staggerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );
  staggerEls.forEach((el) => staggerObserver.observe(el));

  // Timeline line draw
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    const tObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            tObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    tObserver.observe(timeline);
  }
};

/* ── RE-OBSERVE after dynamic content renders ──────────── */
const reObserveReveal = () => {
  // Re-observe after content is rendered dynamically
  const revealEls = document.querySelectorAll('.reveal:not(.is-visible), .reveal-left:not(.is-visible), .reveal-scale:not(.is-visible)');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => observer.observe(el));

  const staggerEls = document.querySelectorAll('.stagger-children:not(.is-visible)');
  const sObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          sObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  staggerEls.forEach((el) => sObserver.observe(el));
};

/* ── SMOOTH SCROLL ─────────────────────────────────────── */
const attachSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      const target = targetId ? document.querySelector(targetId) : null;

      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
};

/* ── HERO CONTENT ──────────────────────────────────────── */
const setHeroContent = () => {
  const { heroImage, name, tagline, introduction, logo } = aarohoData;

  if (heroMedia) heroMedia.style.backgroundImage = `url('${heroImage}')`;
  if (heroHeading) {
    const nameText = name.toUpperCase();
    heroHeading.textContent = nameText;
    heroHeading.setAttribute('data-text', nameText);
  }
  if (heroTagline) heroTagline.textContent = clampText(tagline, 'MUSIC. ENERGY. SOUL.');
  if (heroIntro) heroIntro.textContent = clampText(introduction, "[WRITE AAROHO'S BAND INTRODUCTION HERE]");
  if (logoImage) logoImage.src = logo;
  if (footerLogo) footerLogo.src = logo;
};

/* ── EMPTY STATE ───────────────────────────────────────── */
const renderEmptyState = (containerId, message) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `<div class="empty-state"><p>${message}</p></div>`;
};

/* ── RENDER MEMBERS ────────────────────────────────────── */
const renderMembers = () => {
  const membersGrid = document.getElementById('membersGrid');
  if (!membersGrid) return;

  const members = safeArray(aarohoData.members);

  if (!members.length) {
    renderEmptyState('membersGrid', 'Member profiles will be added here.');
    return;
  }

  membersGrid.innerHTML = members
    .map((member) => {
      const hasImage = Boolean(member.image);
      const initials = (member.name || '[MEMBER NAME]').replace(/[^A-Z]/gi, '').slice(0, 2).toUpperCase() || 'A';

      return `
        <article class="member-card ${hasImage ? '' : 'placeholder'}">
          <div class="member-visual">
            ${hasImage
          ? `<img src="${member.image}" alt="${member.alt || member.name}" loading="lazy" />`
          : `<div class="placeholder-avatar">${initials}</div>`}
          </div>
          <div class="member-copy">
            <h3>${clampText(member.name, '[MEMBER NAME]')}</h3>
            <p class="member-role">${clampText(member.role, '[ROLE / INSTRUMENT]')}</p>
            <p>${clampText(member.intro, '[MEMBER INTRODUCTION]')}</p>
          </div>
        </article>
      `;
    })
    .join('');
};

/* ── VIDEO MODAL ───────────────────────────────────────── */
const openVideoModal = (src) => {
  const modal = document.getElementById('videoModal');
  const player = document.getElementById('videoPlayer');

  if (!modal || !player) return;

  player.src = src;
  player.load();
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
};

const closeVideoModal = () => {
  const modal = document.getElementById('videoModal');
  const player = document.getElementById('videoPlayer');

  if (!modal || !player) return;

  player.pause();
  player.removeAttribute('src');
  player.load();
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
};

/* ── RENDER VIDEOS (landscape 16:10, click-to-play modal) ─ */
const renderVideos = () => {
  const videoGrid = document.getElementById('videoGrid');
  if (!videoGrid) return;

  const videos = safeArray(aarohoData.videos);

  if (!videos.length) {
    renderEmptyState('videoGrid', 'Performance clips will be added soon.');
    return;
  }

  videoGrid.innerHTML = videos
    .map(
      (video) => `
        <article class="video-card" data-src="${video.src}">
          <div class="video-poster">
            <img src="${video.poster || aarohoData.heroImage}" alt="${video.title || 'Live performance'}" loading="lazy" />
            <button class="play-button" aria-label="Play ${video.title || 'video'}">&#9654;</button>
            <span class="live-badge" aria-hidden="true">
              <span class="live-badge-dot"></span>LIVE
            </span>
          </div>
          <div class="video-meta">
            <h3>${clampText(video.title, '[LIVE PERFORMANCE]')}</h3>
            <small>${clampText(video.year, 'LIVE')}</small>
          </div>
        </article>
      `
    )
    .join('');

  videoGrid.querySelectorAll('.video-card').forEach((card) => {
    card.addEventListener('click', () => openVideoModal(card.dataset.src));
  });

  document.querySelector('.modal-close')?.addEventListener('click', closeVideoModal);
  document.querySelector('[data-close="true"]')?.addEventListener('click', closeVideoModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeVideoModal();
  });
};

/* ── RENDER UPCOMING SHOWS ─────────────────────────────── */
const SAMPLE_SHOWS = [
  {
    day: '08',
    month: 'OCT',
    year: '2026',
    title: 'Genesis',
    venue: 'The Bhawanipore Educational Society, Kolkata',
    tag: 'Live Show'
  },
  {
    day: '10',
    month: 'OCT',
    year: '2026',
    title: 'Band E Biplob',
    venue: 'Kalna Recreational Ground, Kalna',
    tag: 'Band Competition'
  },
  {
    day: '20',
    month: 'OCT',
    year: '2026',
    title: 'Navami Night',
    venue: 'Siddha Town, Rajarhat, Kolkata',
    tag: 'Puja Special'
  }
];

const renderUpcomingShows = () => {
  const showsGrid = document.getElementById('showsGrid');
  if (!showsGrid) return;

  // Use data from aarohoData if available, else fall back to sample shows
  const shows = safeArray(aarohoData.shows).length
    ? safeArray(aarohoData.shows)
    : SAMPLE_SHOWS;

  if (!shows.length) {
    showsGrid.innerHTML = `
      <div class="no-shows">
        <p>No upcoming shows announced yet. Stay tuned!</p>
      </div>
    `;
    return;
  }

  showsGrid.innerHTML = shows
    .map(
      (show) => `
        <div class="show-card reveal">
          <div class="show-date">
            <span class="show-day">${show.day || '?'}</span>
            <span class="show-month">${show.month || ''}</span>
            <span class="show-year">${show.year || ''}</span>
          </div>
          <div class="show-details">
            <h3 class="show-title">${show.title || 'TBA'}</h3>
            <p class="show-venue">${show.venue || 'Venue TBA'}</p>
            ${show.tag ? `<span class="show-tag">${show.tag}</span>` : ''}
          </div>
        </div>
      `
    )
    .join('');

  // Re-observe reveal for dynamically added cards
  reObserveReveal();
};

/* ── RENDER ACHIEVEMENTS ───────────────────────────────── */
const renderAchievements = () => {
  const timeline = document.getElementById('achievementTimeline');
  const prizeGrid = document.getElementById('prizeGrid');

  if (!timeline || !prizeGrid) return;

  const achievements = safeArray(aarohoData.achievements);

  if (!achievements.length) {
    timeline.innerHTML = '<div class="empty-state"><p>Achievements and milestones will be updated here.</p></div>';
    prizeGrid.innerHTML = '<div class="empty-state"><p>Prizes and awards will be added here.</p></div>';
    return;
  }

  const yearItems = achievements
    .slice()
    .reverse()
    .map(
      (achievement) => `
        <div class="timeline-item reveal-left">
          <div class="timeline-year">${achievement.year || 'YEAR'}</div>
          <div class="timeline-card">
            <span>${achievement.category || 'ACHIEVEMENT'}</span>
            <h3>${achievement.title || '[Achievement Title]'}</h3>
            <p>${achievement.description || '[Description]'}</p>
          </div>
        </div>
      `
    )
    .join('');

  const prizes = achievements
    .map(
      (achievement) => `
        <div class="prize-card">
          <span class="prize-rank">#1</span>
          <h3>${achievement.title || '[PRIZE TITLE]'}</h3>
          <p>${achievement.category || 'AWARD'}</p>
        </div>
      `
    )
    .join('');

  timeline.innerHTML = yearItems;
  prizeGrid.innerHTML = prizes || '<div class="empty-state"><p>Prizes and awards will be added here.</p></div>';

  // Re-observe newly added timeline items
  reObserveReveal();
};

/* ── RENDER CERTIFICATES ───────────────────────────────── */
const renderCertificates = () => {
  const certificateGrid = document.getElementById('certificateGrid');
  if (!certificateGrid) return;

  const certificates = safeArray(aarohoData.certificates);

  if (!certificates.length) {
    renderEmptyState('certificateGrid', 'Certificates and recognitions will be added here.');
    return;
  }

  certificateGrid.innerHTML = certificates
    .map(
      (certificate) => `
        <article class="certificate-card">
          <img src="${certificate.image}" alt="${certificate.title || 'Certificate'}" loading="lazy" />
          <div>
            <h3>${certificate.title || 'CERTIFICATE'}</h3>
            <p>${certificate.year || ''}</p>
          </div>
        </article>
      `
    )
    .join('');
};

/* ── RENDER GALLERY ────────────────────────────────────── */
const renderGallery = () => {
  const galleryGrid = document.getElementById('galleryGrid');
  if (!galleryGrid) return;

  const gallery = safeArray(aarohoData.gallery);

  if (!gallery.length) {
    renderEmptyState('galleryGrid', "Aaroho's visual journey will appear here.");
    return;
  }

  galleryGrid.innerHTML = gallery
    .map((item, index) => {
      if (item.type === 'video') {
        return `
          <figure class="gallery-item gallery-video ${index % 3 === 0 ? 'feature' : ''}">
            <video
              src="${item.video}"
              controls
              preload="metadata"
              poster="${item.poster || aarohoData.heroImage}"
              aria-label="${item.caption || 'Aaroho performance video'}"
            ></video>
            <figcaption>${item.caption || 'Aaroho'}</figcaption>
          </figure>
        `;
      }

      return `
        <figure class="gallery-item ${index % 3 === 0 ? 'feature' : ''}">
          <img src="${item.image}" alt="${item.caption || 'Aaroho photo'}" loading="lazy" />
          <figcaption>${item.caption || 'Aaroho'}</figcaption>
        </figure>
      `;
    })
    .join('');
};

/* ── RENDER SOCIAL LINKS ───────────────────────────────── */
const renderSocialLinks = () => {
  if (!socialLinks) return;

  const { instagram, youtube, spotify } = { ...DEFAULT_MANIFEST.socialLinks, ...aarohoData.socialLinks };
  const items = [
    { label: 'Instagram', href: instagram },
    { label: 'YouTube', href: youtube },
    { label: 'Spotify', href: spotify }
  ].filter((item) => item.href);

  if (!items.length) {
    socialLinks.innerHTML = '';
    return;
  }

  socialLinks.innerHTML = items
    .map((item) => `<a href="${item.href}" target="_blank" rel="noreferrer">${item.label}</a>`)
    .join('');
};

/* ── NAV TOGGLE ────────────────────────────────────────── */
const setupNavToggle = () => {
  if (!navToggle || !navPanel) return;

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navPanel.classList.toggle('is-open');
  });

  navPanel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navPanel.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
};

/* ── PERFORMANCE DRIVE LINK ────────────────────────────── */
const setPerformanceDriveLink = () => {
  const archiveLink = document.querySelector('.archive-link');
  if (!archiveLink || !aarohoData.performanceDriveLink) return;
  archiveLink.href = aarohoData.performanceDriveLink;
};

/* ── RENDER ALL ────────────────────────────────────────── */
const renderAll = () => {
  setHeroContent();
  setPerformanceDriveLink();
  renderMembers();
  renderVideos();
  renderUpcomingShows();
  renderAchievements();
  renderCertificates();
  renderGallery();
  renderSocialLinks();
  // Re-run scroll observers after dynamic render
  setTimeout(reObserveReveal, 50);
};

/* ── INIT ──────────────────────────────────────────────── */
const init = () => {
  resolveManifest(aarohoData);
  renderAll();
  refreshManifest();
  setupNavToggle();
  attachSmoothScroll();
  initNavbarScroll();
  initActiveNav();
  initScrollReveal();

  setInterval(() => { refreshManifest(); }, 3000);
};

init();
