const defaultManifest = {
  name: 'Aaroho',
  tagline: 'MUSIC. ENERGY. SOUL.',
  introduction: "[WRITE AAROHO'S BAND INTRODUCTION HERE]",
  logo: 'media/logo/aaroho-logo.png',
  heroImage: 'media/hero/band-group-photo.jpg',
  performanceDriveLink: 'https://drive.google.com/drive/folders/1v9LyJA_9iLRQiqFeaX_Lmy2EtVbV_pK0?usp=drive_link',
  members: [
    {
      name: 'DRUMMER',
      role: 'Drummer',
      intro: '[Short drummer introduction]',
      image: 'media/members/drummer.jpg',
      alt: 'Aaroho drummer'
    },
    {
      name: '[MEMBER NAME]',
      role: '[ROLE / INSTRUMENT]',
      intro: '[MEMBER INTRODUCTION]',
      image: '',
      alt: '[MEMBER NAME]'
    },
    {
      name: '[MEMBER NAME]',
      role: '[ROLE / INSTRUMENT]',
      intro: '[MEMBER INTRODUCTION]',
      image: '',
      alt: '[MEMBER NAME]'
    },
    {
      name: '[MEMBER NAME]',
      role: '[ROLE / INSTRUMENT]',
      intro: '[MEMBER INTRODUCTION]',
      image: '',
      alt: '[MEMBER NAME]'
    }
  ],
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

const manifest = await fetch('media/manifest.json').then((res) => res.json()).catch(() => defaultManifest);

export const aarohoData = {
  ...defaultManifest,
  ...manifest,
  members: manifest.members || defaultManifest.members,
  videos: manifest.videos || defaultManifest.videos,
  achievements: manifest.achievements || defaultManifest.achievements,
  certificates: manifest.certificates || defaultManifest.certificates,
  gallery: manifest.gallery || defaultManifest.gallery,
  socialLinks: { ...defaultManifest.socialLinks, ...(manifest.socialLinks || {}) },
  logo: manifest.logo || defaultManifest.logo,
  heroImage: manifest.heroImage || defaultManifest.heroImage,
  performanceDriveLink: manifest.performanceDriveLink || defaultManifest.performanceDriveLink
};
