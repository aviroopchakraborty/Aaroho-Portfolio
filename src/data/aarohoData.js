const defaultManifest = {
  name: 'Aaroho',
  tagline: 'MUSIC. ENERGY. SOUL.',
  introduction: "[WRITE AAROHO'S BAND INTRODUCTION HERE]",
  logo: './public/media/logo/aaroho-logo-1.png',
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
  videos: [
    {
      title: 'Live 01',
      year: '',
      src: './public/media/videos/live-01.mp4',
      poster: './public/media/hero/band-group-photo.jpg'
    },
    {
      title: 'Live 02',
      year: '',
      src: './public/media/videos/live-02.mp4',
      poster: './public/media/hero/band-group-photo.jpg'
    },
    {
      title: 'Live 03',
      year: '',
      src: './public/media/videos/live-03.mp4',
      poster: './public/media/hero/band-group-photo.jpg'
    }
  ],
  achievements: [
    {
      year: '2025',
      category: 'Competition',
      title: "1st Runner's up at Vocations'25",
      description: "Secured 1st Runner's up position at the competition organized by MSIT."
    },
    {
      year: '2025',
      category: 'Competition',
      title: "1st Runner's up at Regaia'25",
      description: "Secured 1st Runner's up position at the competition organized by RCCIIT."
    },
    {
      year: '2026',
      category: 'Competition',
      title: "Winner at Ecstasia'26",
      description: "Secured the Winner position at the competition organized by UEM."
    },
    {
      year: '2026',
      category: 'Competition',
      title: "Winner at Sanskriti'26",
      description: "Secured the Winner position at the competition organized by JU."
    }
  ],
  certificates: [
    {
      title: 'Winner Award 2025',
      year: '2025',
      image: './public/media/achievements/winner-award-2025.jpg'
    },
    {
      title: 'Winner Award 2025 (2)',
      year: '2025',
      image: './public/media/achievements/winner-award-2025-1.jpg'
    }
  ],
  gallery: [
    {
      type: 'image',
      image: './public/media/gallery/photo_01.jpg',
      caption: 'Live Performance'
    },
    {
      type: 'image',
      image: './public/media/gallery/photo_02.jpg',
      caption: 'Band Action'
    }
  ],
  socialLinks: {
    instagram: 'https://www.instagram.com/aaroho.official?stkn=enFva2Rxemp4d3dz',
    facebook: 'https://www.facebook.com/share/18uMDtp3M2/',
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
