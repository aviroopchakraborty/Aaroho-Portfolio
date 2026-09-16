import { aarohoData } from './src/data/aarohoData.js';

/* ── DEFAULT MANIFEST ──────────────────────────────────── */
const DEFAULT_MANIFEST = {
  name: 'Aaroho',
  tagline: 'MUSIC. ENERGY. SOUL.',
  introduction: `Aaroho is a Kolkata-based band driven by the spirit of live music, bringing together rock, folk and experimental sounds into an evolving musical experience.`,
  logo: './public/media/logo/aaroho-logo.png',
  heroImage: './public/media/hero/band-group-photo.jpg',
  performanceDriveLink: 'https://drive.google.com/drive/folders/1v9LyJA_9iLRQiqFeaX_Lmy2EtVbV_pK0?usp=drive_link',
  members: [],
  videos: [],
  achievements: [],
  certificates: [],
  gallery: [],
  socialLinks: { facebook: '', instagram: '', youtube: '', spotify: '' }
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

  if (!timeline) return;

  const achievements = safeArray(aarohoData.achievements);

  if (!achievements.length) {
    timeline.innerHTML = '<div class="empty-state"><p>Achievements and milestones will be updated here.</p></div>';
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

  timeline.innerHTML = yearItems;

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
const svgs = {
  Facebook: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg>`,
  Instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.036 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/></svg>`,
  YouTube: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.052-.072 1.972l-.008.104-.022.261-.01.104c-.048.519-.119 1.023-.22 1.402a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/></svg>`,
  Spotify: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686zm.979-2.264a.625.625 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.196c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.86zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.202z"/></svg>`
};

const renderSocialLinks = () => {
  if (!socialLinks) return;

  const { facebook, instagram, youtube, spotify } = { ...DEFAULT_MANIFEST.socialLinks, ...aarohoData.socialLinks };
  const items = [
    { label: 'Facebook', href: facebook },
    { label: 'Instagram', href: instagram },
    { label: 'YouTube', href: youtube },
    { label: 'Spotify', href: spotify }
  ].filter((item) => item.href);

  if (!items.length) {
    socialLinks.innerHTML = '';
    return;
  }

  socialLinks.innerHTML = items
    .map((item) => `<a href="${item.href}" target="_blank" rel="noreferrer" aria-label="${item.label}">${svgs[item.label] || ''} ${item.label}</a>`)
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

/* ── GALLERY SCROLL ────────────────────────────────────── */
const initGalleryScroll = () => {
  const galleryGrid = document.getElementById('galleryGrid');
  const leftArrow = document.querySelector('.gallery-arrow-left');
  const rightArrow = document.querySelector('.gallery-arrow-right');

  if (!galleryGrid || !leftArrow || !rightArrow) return;

  leftArrow.addEventListener('click', () => {
    galleryGrid.scrollBy({ left: -400, behavior: 'smooth' });
  });

  rightArrow.addEventListener('click', () => {
    galleryGrid.scrollBy({ left: 400, behavior: 'smooth' });
  });
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
  initGalleryScroll();

  setInterval(() => { refreshManifest(); }, 3000);
};

init();
