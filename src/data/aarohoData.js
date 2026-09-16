const defaultManifest = {
  name: 'Aaroho',
  tagline: 'MUSIC. ENERGY. SOUL.',
  introduction: "[WRITE AAROHO'S BAND INTRODUCTION HERE]",
  logo: './public/media/logo/aaroho-logo.png',
  heroImage: './public/media/hero/band-group-photo.jpg',
  performanceDriveLink: 'https://drive.google.com/drive/folders/1v9LyJA_9iLRQiqFeaX_Lmy2EtVbV_pK0?usp=drive_link',
  members: [
    {
      name: 'Nigam Mukherjee',
      role: 'Lead Vocalist',
      intro: 'Bringing the voice and emotion that connect Aaroho\'s music with the audience.',
      image: '',
      alt: 'Aaroho Nigam Mukherjee'
    },
    {
      name: 'Abhigyan Pal',
      role: 'Guitarist',
      intro: 'Shaping Aaroho\'s melodic identity through riffs, textures and expressive arrangements.',
      image: '',
      alt: 'Aaroho Abhigyan Pal'
    },
    {
      name: 'Aviroop Chakraborty',
      role: 'Drummer',
      intro: 'Driving the band\'s energy with acoustic grooves, dynamics and raw live intensity.',
      image: './public/media/members/drummer.jpg',
      alt: 'Aaroho Aviroop Chakraborty'
    },
    {
      name: 'Ankan Das',
      role: 'Guitarist',
      intro: 'Exploring the space between rhythm, melody and atmosphere.',
      image: '',
      alt: 'Aaroho Ankan Das'
    },
    {
      name: 'Anuroop Chakraborty',
      role: 'Bassist',
      intro: 'Holding the groove together while adding movement, depth and character to the band\'s sound.',
      image: '',
      alt: 'Aaroho Anuroop Chakraborty'
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

const manifest = await fetch('./public/media/manifest.json').then((res) => res.json()).catch(() => defaultManifest);

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
