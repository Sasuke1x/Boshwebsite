import Link from 'next/link';
import { Instagram, Youtube, Mail } from 'lucide-react';
import { siteConfig } from '@/lib/config';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-playfair font-semibold text-black">
              BOSHAnovART
            </Link>
            <p className="mt-2 text-sm text-gray-600 max-w-xs">
              Professional Photography & Videography. Capturing moments, creating stories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/photography" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Photography
                </Link>
              </li>
              <li>
                <Link href="/videography" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Videography
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-black transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-4">Connect</h3>
            <div className="space-y-3">
              <a
                href={`mailto:${siteConfig.links.email}`}
                className="flex items-center text-sm text-gray-600 hover:text-black transition-colors"
              >
                <Mail size={16} className="mr-2" />
                {siteConfig.links.email}
              </a>
              
              <div className="flex space-x-4">
                {siteConfig.links.instagram && (
                  <a
                    href={siteConfig.links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                )}
                
                {siteConfig.links.youtube && (
                  <a
                    href={siteConfig.links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} BOSHAnovART. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
