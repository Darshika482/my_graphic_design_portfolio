import { Category } from './types';

// Poster & Banner assets
import pbNewP1 from './assets/new poster/p1.jpg';
import pbNewP2 from './assets/new poster/p2.jpg';
import pbNew3 from './assets/new poster/photo_2026-02-10_19-27-11.jpg';
import pbNew4 from './assets/new poster/photo_2026-02-10_19-27-22.jpg';
import pbNew5 from './assets/new poster/photo_2026-02-10_19-28-04.jpg';
import pbNew6 from './assets/new poster/photo_2026-02-10_19-28-37.jpg';

import pbOld1 from './assets/old poster/1.png';
import pbOld2 from './assets/old poster/3.png';
import pbOld3 from './assets/old poster/4.png';
import pbOld4 from './assets/old poster/5.png';
import pbOld5 from './assets/old poster/cllg.png';
import pbOld6 from './assets/old poster/Entrepreneurship.png';
import pbOld7 from './assets/old poster/event.png';
import pbOld8 from './assets/old poster/independence day.png';

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
    // Use one of the new posters as the hero image
    heroImage: pbNewP1,
    gallery: [
      // First two: new posters (p1, p2)
      { id: 'pb-new-1', title: 'New Poster P1', url: pbNewP1 },
      { id: 'pb-new-2', title: 'New Poster P2', url: pbNewP2 },

      // Third: an old poster
      { id: 'pb-old-1', title: 'Old Poster 1', url: pbOld1 },

      // Remaining new posters
      { id: 'pb-new-3', title: 'New Poster 3', url: pbNew3 },
      { id: 'pb-new-4', title: 'New Poster 4', url: pbNew4 },
      { id: 'pb-new-5', title: 'New Poster 5', url: pbNew5 },
      { id: 'pb-new-6', title: 'New Poster 6', url: pbNew6 },

      // Remaining old posters
      { id: 'pb-old-2', title: 'Old Poster 2', url: pbOld2 },
      { id: 'pb-old-3', title: 'Old Poster 3', url: pbOld3 },
      { id: 'pb-old-4', title: 'Old Poster 4', url: pbOld4 },
      { id: 'pb-old-5', title: 'Old Poster 5', url: pbOld5 },
      { id: 'pb-old-6', title: 'Old Poster 6', url: pbOld6 },
      { id: 'pb-old-7', title: 'Old Poster 7', url: pbOld7 },
      { id: 'pb-old-8', title: 'Old Poster 8', url: pbOld8 },
    ]
  },
  {
    id: 'academic-book',
    title: 'Academic & Book Design',
    description: 'Structured layouts and typographic systems for educational publishing.',
    heroImage: 'https://picsum.photos/seed/bookhero/1600/1200',
    gallery: [
      { id: 'ab1', title: 'Math Textbook Layout', url: 'https://picsum.photos/seed/book1/1000/1400' },
      { id: 'ab2', title: 'Science Journal', url: 'https://picsum.photos/seed/book2/1000/1400' },
      { id: 'ab3', title: 'University Prospectus', url: 'https://picsum.photos/seed/book3/1000/1400' },
    ]
  },
  {
    id: 'school-branding',
    title: 'School Branding & Identity',
    description: 'Cohesive visual identities that reflect institutional values and heritage.',
    heroImage: 'https://picsum.photos/seed/schoolhero/1400/1000',
    gallery: [
      { id: 'sb1', title: 'Logo Evolution', url: 'https://picsum.photos/seed/brand1/1200/800' },
      { id: 'sb2', title: 'Wayfinding System', url: 'https://picsum.photos/seed/brand2/1200/800' },
      { id: 'sb3', title: 'Uniform Insignia', url: 'https://picsum.photos/seed/brand3/1200/800' },
    ]
  },
  {
    id: 'stationery',
    title: 'Letterhead & Stationery',
    description: 'Professional print collateral designed for tactile excellence.',
    heroImage: 'https://picsum.photos/seed/stationaryhero/1200/800',
    gallery: [
      { id: 'st1', title: 'Executive Letterhead', url: 'https://picsum.photos/seed/stat1/1000/1000' },
      { id: 'st2', title: 'Business Card Suite', url: 'https://picsum.photos/seed/stat2/1000/1000' },
    ]
  },
  {
    id: 'event-branding',
    title: 'Event & Function Branding',
    description: 'Immersive visual environments for corporate and academic functions.',
    heroImage: 'https://picsum.photos/seed/eventhero/1600/900',
    gallery: [
      { id: 'ev1', title: 'Annual Gala Stage', url: 'https://picsum.photos/seed/event1/1200/800' },
      { id: 'ev2', title: 'Conference Badges', url: 'https://picsum.photos/seed/event2/1200/800' },
    ]
  },
  {
    id: 'digital-social',
    title: 'Digital & Social Media',
    description: 'Engaging content strategies optimized for screens and sharing.',
    heroImage: 'https://picsum.photos/seed/digitalhero/1000/1000',
    gallery: [
      { id: 'ds1', title: 'Instagram Campaign', url: 'https://picsum.photos/seed/social1/1080/1080' },
      { id: 'ds2', title: 'Web Banners', url: 'https://picsum.photos/seed/social2/1080/1080' },
    ]
  },
  {
    id: 'classroom-visual',
    title: 'Classroom Visual Design',
    description: 'Educational aids and environmental graphics that enhance learning.',
    heroImage: 'https://picsum.photos/seed/classroomhero/1400/1000',
    gallery: [
      { id: 'cv1', title: 'Alphabet Wall Chart', url: 'https://picsum.photos/seed/class1/1000/1400' },
      { id: 'cv2', title: 'Periodic Table Redesign', url: 'https://picsum.photos/seed/class2/1000/1400' },
    ]
  },
];