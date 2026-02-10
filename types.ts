export interface ProjectImage {
  id: string;
  url: string;
  title: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  heroImage: string;
  gallery: ProjectImage[];
}

export enum SectionId {
  Home = 'home',
  Work = 'work',
  About = 'about',
  Contact = 'contact'
}