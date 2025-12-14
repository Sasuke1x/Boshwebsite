import { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  name: "BOSHAnovART",
  description: "Professional Photography & Videography Portfolio - Capturing moments, creating stories",
  url: "https://boshanovart.com",
  ogImage: "/og-image.jpg",
  links: {
    instagram: "https://instagram.com/boshanovart",
    youtube: "https://youtube.com/@novartfilms",
    email: "hello@boshanovart.com",
    phone: "+1 (555) 123-4567",
  },
};

export const navigationItems = [
  { name: "Home", href: "/" },
  { 
    name: "Photography", 
    href: "/photography",
    children: [
      { name: "Portraits", href: "/photography/portraits" },
      { name: "Events", href: "/photography/events" },
      { name: "Commercial", href: "/photography/commercial" },
      { name: "Street Photography", href: "/photography/street" },
      { name: "Fine Art", href: "/photography/fine-art" },
    ]
  },
  { 
    name: "Videography", 
    href: "/videography",
    children: [
      { name: "Music Videos", href: "/videography/music-videos" },
      { name: "Commercial", href: "/videography/commercial" },
      { name: "Documentary", href: "/videography/documentary" },
      { name: "Personal Projects", href: "/videography/personal" },
    ]
  },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];
