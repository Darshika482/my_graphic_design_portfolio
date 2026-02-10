import { Category, ProjectImage } from './types';

// Helper to turn Vite glob imports into a gallery array.
function createImageGallery(
  modules: Record<string, { default: string }>,
  options: { idPrefix: string; titlePrefix?: string }
): ProjectImage[] {
  return Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, mod], index) => {
      const fileName = path.split('/').pop() || `image-${index + 1}`;
      const baseName = fileName.replace(/\.[^/.]+$/, '');

      const title =
        options.titlePrefix != null
          ? `${options.titlePrefix} ${index + 1}`
          : baseName.replace(/[-_]/g, ' ');

      return {
        id: `${options.idPrefix}-${index + 1}`,
        title,
        url: mod.default,
      };
    });
}

// Poster & Banner assets (auto-load every image in these folders)
const posterNewModules = import.meta.glob(
  './assets/new poster/*.{png,jpg,jpeg,webp}',
  { eager: true }
) as Record<string, { default: string }>;

const posterOldModules = import.meta.glob(
  './assets/old poster/*.{png,jpg,jpeg,webp}',
  { eager: true }
) as Record<string, { default: string }>;

const posterNewGallery = createImageGallery(posterNewModules, {
  idPrefix: 'pb-new',
  titlePrefix: 'New Poster',
});

const posterOldGallery = createImageGallery(posterOldModules, {
  idPrefix: 'pb-old',
  titlePrefix: 'Old Poster',
});

const posterGallery: ProjectImage[] = [...posterNewGallery, ...posterOldGallery];
const posterHeroImage = posterGallery[0]?.url ?? '';

// Children book design assets (auto-load all pages for Secret of Whispering Woods)
const secretBookModules = import.meta.glob(
  './assets/books/The Secret of Whispering Woods A Meadow Mist Adventure/*.{png,jpg,jpeg,webp}',
  { eager: true }
) as Record<string, { default: string }>;

const secretBookGallery: ProjectImage[] = Object.entries(secretBookModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, mod], index) => {
    const isCover = /images-0\./.test(path);
    const pageNumber = index + 1;

    return {
      id: `cb-secret-${pageNumber}`,
      title: isCover
        ? 'The Secret of Whispering Woods – Cover'
        : `The Secret of Whispering Woods – Page ${pageNumber - 1}`,
      url: mod.default,
    };
  });

const secretBookHeroImage = secretBookGallery[0]?.url ?? '';

// Children book: standalone covers that also have external links
const studentPlannerModules = import.meta.glob(
  './assets/books/student planner/*.{png,jpg,jpeg,webp}',
  { eager: true }
) as Record<string, { default: string }>;

const maxSpaceModules = import.meta.glob(
  "./assets/books/Max’s Space Journey/*.{png,jpg,jpeg,webp}",
  { eager: true }
) as Record<string, { default: string }>;

const studentPlannerCover = Object.values(studentPlannerModules)[0]?.default ?? '';
const maxSpaceCover = Object.values(maxSpaceModules)[0]?.default ?? '';

// Infographics & Presentation assets (auto-load every image in folder)
const infographicModules = import.meta.glob(
  './assets/detailed graphics/*.{png,jpg,jpeg,webp}',
  { eager: true }
) as Record<string, { default: string }>;

const infographicGallery = createImageGallery(infographicModules, {
  idPrefix: 'inf',
  titlePrefix: 'Infographic',
});

const infographicHeroImage = infographicGallery[0]?.url ?? '';

// Letterhead & Branding assets
const letterheadModules = import.meta.glob(
  './assets/letterhead/*.{png,jpg,jpeg,webp}',
  { eager: true }
) as Record<string, { default: string }>;

const letterheadGallery = createImageGallery(letterheadModules, {
  idPrefix: 'lh',
  titlePrefix: 'Letterhead',
});

const letterheadHeroImage = letterheadGallery[0]?.url ?? '';

// Casual designs & doodles assets
const casualModules = import.meta.glob(
  './assets/only graphics/*.{png,jpg,jpeg,webp}',
  { eager: true }
) as Record<string, { default: string }>;

const casualGallery = createImageGallery(casualModules, {
  idPrefix: 'casual',
  titlePrefix: 'Casual Design',
});

const casualHeroImage = casualGallery[0]?.url ?? '';

// UI/UX & Website development assets (images + videos)
const websiteModules = import.meta.glob(
  './assets/websites/*.{png,jpg,jpeg,webp,mp4}',
  { eager: true }
) as Record<string, { default: string }>;

const websiteGallery: ProjectImage[] = Object.entries(websiteModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, mod], index) => {
    const fileName = path.split('/').pop() || `media-${index + 1}`;
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    const isVideo = /\.mp4$/i.test(path);

    return {
      id: `web-${index + 1}`,
      title: baseName.replace(/[-_]/g, ' '),
      url: mod.default,
      mediaType: isVideo ? 'video' : 'image',
    };
  });

const websiteHeroImage = websiteGallery[0]?.url ?? '';

// Logo Design assets
const logoModules = import.meta.glob(
  './assets/logos/*.{png,jpg,jpeg,webp}',
  { eager: true }
) as Record<string, { default: string }>;

const logoGallery = createImageGallery(logoModules, {
  idPrefix: 'logo',
  titlePrefix: 'Logo Design',
});

const logoHeroImage = logoGallery[0]?.url ?? '';

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const CATEGORIES: Category[] = [
  {
    id: 'poster-banner',
    title: 'Poster & Banner Design',
    description: 'High-impact visual communication for events, announcements, and campaigns.',
    heroImage: posterHeroImage,
    gallery: posterGallery,
  },
  {
    id: 'academic-book',
    title: 'Children Book Designs',
    description: 'Playful, engaging layouts crafted for young readers and early learners.',
    heroImage: secretBookHeroImage,
    gallery: [
      // First three: different books with special links
      {
        id: 'cb1',
        title: 'The Secret of Whispering Woods – Cover',
        url: secretBookHeroImage
      },
      {
        id: 'cb2',
        title: 'ADHD Student Planner – Cover',
        url: studentPlannerCover,
        link: 'https://drive.google.com/file/d/1DFnwE_HWaMF3SVq-EZoo2w8RdiH2cKET/view?usp=sharing'
      },
      {
        id: 'cb3',
        title: "Max’s Space Journey – Cover",
        url: maxSpaceCover,
        link: 'https://drive.google.com/file/d/1AYtKEJ0J2y-5t7p9z5QXlcGtosQViDUo/view?usp=sharing'
      },
      // Then full sequence of Secret of Whispering Woods pages (auto-loaded)
      ...secretBookGallery.slice(1),
    ]
  },
  {
    id: 'school-branding',
    title: 'Infographics & Presentation',
    description: 'Data-rich visuals, story-driven slides, and detailed graphics for impactful presentations.',
    heroImage: infographicHeroImage,
    gallery: infographicGallery,
  },
  {
    id: 'stationery',
    title: 'Letterhead & Branding',
    description: 'Custom stationery systems that extend and reinforce brand identity.',
    heroImage: letterheadHeroImage,
    gallery: letterheadGallery,
  },
  {
    id: 'event-branding',
    title: 'UI/UX & Website Development',
    description: 'Interactive interfaces and responsive web experiences for modern users.',
    heroImage: websiteHeroImage,
    gallery: websiteGallery,
  },
  {
    id: 'logo-design',
    title: 'Logo Design',
    description: 'Memorable brand identities that leave a lasting impression.',
    heroImage: logoHeroImage,
    gallery: logoGallery,
  },
  {
    id: 'classroom-visual',
    title: 'Casual Designs & Doodles',
    description: 'Playful illustrations, sketches, and experimental compositions.',
    heroImage: casualHeroImage,
    gallery: casualGallery,
  },
];