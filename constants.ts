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

// Children book design assets
import cbSecret0 from './assets/books/The Secret of Whispering Woods A Meadow Mist Adventure/The Secret of Whispering Woods A Meadow Mist Adventure-images-0.jpg';
import cbSecret1 from './assets/books/The Secret of Whispering Woods A Meadow Mist Adventure/The Secret of Whispering Woods A Meadow Mist Adventure-images-1.jpg';
import cbSecret2 from './assets/books/The Secret of Whispering Woods A Meadow Mist Adventure/The Secret of Whispering Woods A Meadow Mist Adventure-images-2.jpg';
import cbSecret3 from './assets/books/The Secret of Whispering Woods A Meadow Mist Adventure/The Secret of Whispering Woods A Meadow Mist Adventure-images-3.jpg';
import cbSecret4 from './assets/books/The Secret of Whispering Woods A Meadow Mist Adventure/The Secret of Whispering Woods A Meadow Mist Adventure-images-4.jpg';
import cbSecret5 from './assets/books/The Secret of Whispering Woods A Meadow Mist Adventure/The Secret of Whispering Woods A Meadow Mist Adventure-images-5.jpg';
import cbSecret6 from './assets/books/The Secret of Whispering Woods A Meadow Mist Adventure/The Secret of Whispering Woods A Meadow Mist Adventure-images-6.jpg';
import cbSecret7 from './assets/books/The Secret of Whispering Woods A Meadow Mist Adventure/The Secret of Whispering Woods A Meadow Mist Adventure-images-7.jpg';
import cbSecret8 from './assets/books/The Secret of Whispering Woods A Meadow Mist Adventure/The Secret of Whispering Woods A Meadow Mist Adventure-images-8.jpg';
import cbSecret9 from './assets/books/The Secret of Whispering Woods A Meadow Mist Adventure/The Secret of Whispering Woods A Meadow Mist Adventure-images-9.jpg';
import cbSecret10 from './assets/books/The Secret of Whispering Woods A Meadow Mist Adventure/The Secret of Whispering Woods A Meadow Mist Adventure-images-10.jpg';
import cbSecret11 from './assets/books/The Secret of Whispering Woods A Meadow Mist Adventure/The Secret of Whispering Woods A Meadow Mist Adventure-images-11.jpg';
import cbSecret12 from './assets/books/The Secret of Whispering Woods A Meadow Mist Adventure/The Secret of Whispering Woods A Meadow Mist Adventure-images-12.jpg';
import cbSecret13 from './assets/books/The Secret of Whispering Woods A Meadow Mist Adventure/The Secret of Whispering Woods A Meadow Mist Adventure-images-13.jpg';
import cbSecret14 from './assets/books/The Secret of Whispering Woods A Meadow Mist Adventure/The Secret of Whispering Woods A Meadow Mist Adventure-images-14.jpg';
import cbSecret15 from './assets/books/The Secret of Whispering Woods A Meadow Mist Adventure/The Secret of Whispering Woods A Meadow Mist Adventure-images-15.jpg';
import cbSecret16 from './assets/books/The Secret of Whispering Woods A Meadow Mist Adventure/The Secret of Whispering Woods A Meadow Mist Adventure-images-16.jpg';
import cbSecret17 from './assets/books/The Secret of Whispering Woods A Meadow Mist Adventure/The Secret of Whispering Woods A Meadow Mist Adventure-images-17.jpg';

import cbStudentPlanner from './assets/books/student planner/ADHD panner cover.jpg';
import cbMaxSpace from './assets/books/Max’s Space Journey/Max’s Space Journey (1).jpg';

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
    title: 'Children Book Designs',
    description: 'Playful, engaging layouts crafted for young readers and early learners.',
    heroImage: cbSecret0,
    gallery: [
      // First three: different books
      { 
        id: 'cb1',
        title: 'The Secret of Whispering Woods – Cover',
        url: cbSecret0
      },
      { 
        id: 'cb2',
        title: 'ADHD Student Planner – Cover',
        url: cbStudentPlanner,
        link: 'https://drive.google.com/file/d/1DFnwE_HWaMF3SVq-EZoo2w8RdiH2cKET/view?usp=sharing'
      },
      { 
        id: 'cb3',
        title: "Max’s Space Journey – Cover",
        url: cbMaxSpace,
        link: 'https://drive.google.com/file/d/1AYtKEJ0J2y-5t7p9z5QXlcGtosQViDUo/view?usp=sharing'
      },

      // Then full sequence of Secret of Whispering Woods pages
      { id: 'cb4', title: 'The Secret of Whispering Woods – Page 1', url: cbSecret1 },
      { id: 'cb5', title: 'The Secret of Whispering Woods – Page 2', url: cbSecret2 },
      { id: 'cb6', title: 'The Secret of Whispering Woods – Page 3', url: cbSecret3 },
      { id: 'cb7', title: 'The Secret of Whispering Woods – Page 4', url: cbSecret4 },
      { id: 'cb8', title: 'The Secret of Whispering Woods – Page 5', url: cbSecret5 },
      { id: 'cb9', title: 'The Secret of Whispering Woods – Page 6', url: cbSecret6 },
      { id: 'cb10', title: 'The Secret of Whispering Woods – Page 7', url: cbSecret7 },
      { id: 'cb11', title: 'The Secret of Whispering Woods – Page 8', url: cbSecret8 },
      { id: 'cb12', title: 'The Secret of Whispering Woods – Page 9', url: cbSecret9 },
      { id: 'cb13', title: 'The Secret of Whispering Woods – Page 10', url: cbSecret10 },
      { id: 'cb14', title: 'The Secret of Whispering Woods – Page 11', url: cbSecret11 },
      { id: 'cb15', title: 'The Secret of Whispering Woods – Page 12', url: cbSecret12 },
      { id: 'cb16', title: 'The Secret of Whispering Woods – Page 13', url: cbSecret13 },
      { id: 'cb17', title: 'The Secret of Whispering Woods – Page 14', url: cbSecret14 },
      { id: 'cb18', title: 'The Secret of Whispering Woods – Page 15', url: cbSecret15 },
      { id: 'cb19', title: 'The Secret of Whispering Woods – Page 16', url: cbSecret16 },
      { id: 'cb20', title: 'The Secret of Whispering Woods – Page 17', url: cbSecret17 },
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