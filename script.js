import { aarohoData } from './src/data/aarohoData.js';

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
  socialLinks: {
    instagram: '',
    youtube: '',
    spotify: ''
  }
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

const navToggle = document.querySelector('.nav-toggle');
const navPanel = document.querySelector('.nav-panel');
const heroMedia = document.querySelector('.hero-media');
const heroIntro = document.querySelector('.intro');
const heroTagline = document.querySelector('.tagline');
const heroHeading = document.querySelector('.hero-copy h1');
const logoImage = document.querySelector('.brand img');
const footerLogo = document.querySelector('.footer-logo');
const socialLinks = document.querySelector('.social-links');

const clampText = (value, fallback) => value || fallback;

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

const setHeroContent = () => {
  const { heroImage, name, tagline, introduction, logo } = aarohoData;

  if (heroMedia) heroMedia.style.backgroundImage = `url('${heroImage}')`;
  if (heroHeading) heroHeading.textContent = name.toUpperCase();
  if (heroTagline) heroTagline.textContent = clampText(tagline, 'MUSIC. ENERGY. SOUL.');
  if (heroIntro) heroIntro.textContent = clampText(introduction, "[WRITE AAROHO'S BAND INTRODUCTION HERE]");
  if (logoImage) logoImage.src = logo;
  if (footerLogo) footerLogo.src = logo;
};

const renderEmptyState = (containerId, message) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `<div class="empty-state"><p>${message}</p></div>`;
};

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
            ${hasImage ? `<img src="${member.image}" alt="${member.alt || member.name}" loading="lazy" />` : `<div class="placeholder-avatar">${initials}</div>`}
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
            <img src="${video.poster || aarohoData.heroImage}" alt="${video.title}" loading="lazy" />
            <button class="play-button" aria-label="Play video">▶</button>
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
    if (event.key === 'Escape') {
      closeVideoModal();
    }
  });
};

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
        <div class="timeline-item">
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
};

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

const setPerformanceDriveLink = () => {
  const archiveLink = document.querySelector('.archive-link');
  if (!archiveLink || !aarohoData.performanceDriveLink) return;

  archiveLink.href = aarohoData.performanceDriveLink;
};

const init = () => {
  resolveManifest(aarohoData);
  renderAll();
  refreshManifest();
  setupNavToggle();
  attachSmoothScroll();
  setInterval(() => {
    refreshManifest();
  }, 3000);
};

const renderAll = () => {
  setHeroContent();
  setPerformanceDriveLink();
  renderMembers();
  renderVideos();
  renderAchievements();
  renderCertificates();
  renderGallery();
  renderSocialLinks();
};

init();
