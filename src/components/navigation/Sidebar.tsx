"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Instagram, Youtube, Mail, Menu, X } from 'lucide-react';
import { siteConfig } from '@/lib/config';

interface SiteSettings {
  siteName?: string;
  email?: string;
  phone?: string;
  sidebarLogo?: {
    asset?: {
      url: string;
    };
    alt?: string;
  };
  sidebarLogoText?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
}

interface SidebarProps {
  settings?: SiteSettings;
}

const Sidebar = ({ settings }: SidebarProps) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const navigationLinks = [
    { name: 'home', href: '/' },
    { name: 'gallery', href: '/photography' },
    { name: 'events', href: '/photography/events' },
    { name: 'videos', href: '/videography' },
    { name: 'store', href: '/store' },
    { name: 'about', href: '/about' },
    { name: 'contact', href: '/contact' },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-base font-bold tracking-wide"
          style={{
            color: '#dc2626',
            textShadow: `
              -1px 1px 0 #facc15,
              -2px 2px 0 #facc15,
              -3px 3px 0 #facc15,
              -4px 4px 10px rgba(0,0,0,0.3)
            `
          }}
        >
          novART FILMS
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 hover:text-black transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-48 bg-white border-r border-gray-100 flex-col">
        {/* Brand */}
        <div className="p-6">
        <Link 
          href="/" 
          className="text-lg font-bold tracking-wide relative inline-block"
          style={{
            color: '#dc2626', // red-600
            textShadow: `
              -1px 1px 0 #facc15,
              -2px 2px 0 #facc15,
              -3px 3px 0 #facc15,
              -4px 4px 10px rgba(0,0,0,0.3)
            `
          }}
        >
          novART FILMS
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6">
        <ul className="space-y-1">
          {navigationLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block text-sm hover:text-gray-700 transition-colors py-1 ${
                  isActive(link.href) ? 'text-black font-medium' : 'text-gray-600'
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Content */}
      <div className="p-6 border-t border-gray-100">
        {/* Social Links */}
        <div className="flex space-x-3 mb-4">
          {(settings?.instagramUrl || siteConfig.links.instagram) && (
            <a
              href={settings?.instagramUrl || siteConfig.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={16} />
            </a>
          )}
          {(settings?.youtubeUrl || siteConfig.links.youtube) && (
            <a
              href={settings?.youtubeUrl || siteConfig.links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition-colors"
              aria-label="YouTube"
            >
              <Youtube size={16} />
            </a>
          )}
          <a
            href={`mailto:${settings?.email || siteConfig.links.email}`}
            className="text-gray-600 hover:text-black transition-colors"
            aria-label="Email"
          >
            <Mail size={16} />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-500 leading-relaxed">
          <p className="mb-2">All images © novART FILMS. All rights reserved.</p>
          
          {/* Featured Work Preview / Logo - editable in CMS */}
          <div className="mt-4">
            <div className="w-16 h-20 bg-gray-900 mb-2 relative overflow-hidden">
              {settings?.sidebarLogo?.asset?.url ? (
                <Image
                  src={settings.sidebarLogo.asset.url}
                  alt={settings.sidebarLogo.alt || 'Logo'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {settings?.sidebarLogoText || 'BOSH'}
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs">
              Latest Work | <span className="uppercase">Portfolio</span>
            </p>
          </div>
        </div>
      </div>
    </aside>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={closeMobileMenu}
          />
          
          {/* Drawer */}
          <div className="md:hidden fixed top-0 left-0 bottom-0 w-64 bg-white z-50 flex flex-col shadow-xl">
            {/* Mobile Brand */}
            <div className="p-6 border-b border-gray-100">
              <Link 
                href="/" 
                className="text-lg font-bold tracking-wide"
                style={{
                  color: '#dc2626',
                  textShadow: `
                    -1px 1px 0 #facc15,
                    -2px 2px 0 #facc15,
                    -3px 3px 0 #facc15,
                    -4px 4px 10px rgba(0,0,0,0.3)
                  `
                }}
                onClick={closeMobileMenu}
              >
                novART FILMS
              </Link>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-6 py-4 overflow-y-auto">
              <ul className="space-y-1">
                {navigationLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block text-base py-2 hover:text-gray-700 transition-colors ${
                        isActive(link.href) ? 'text-black font-medium' : 'text-gray-600'
                      }`}
                      onClick={closeMobileMenu}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile Footer */}
            <div className="p-6 border-t border-gray-100">
              <div className="flex space-x-3 mb-4">
                {(settings?.instagramUrl || siteConfig.links.instagram) && (
                  <a
                    href={settings?.instagramUrl || siteConfig.links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                )}
                {(settings?.youtubeUrl || siteConfig.links.youtube) && (
                  <a
                    href={settings?.youtubeUrl || siteConfig.links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube size={20} />
                  </a>
                )}
                <a
                  href={`mailto:${settings?.email || siteConfig.links.email}`}
                  className="text-gray-600 hover:text-black transition-colors"
                  aria-label="Email"
                >
                  <Mail size={20} />
                </a>
              </div>
              <p className="text-xs text-gray-500">
                © novART FILMS
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
