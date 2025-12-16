import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  MapPin,
  Heart,
  ChevronDown,
  ChevronUp,
  Clock,
} from 'lucide-react';
import logo from '../../assets/Logo.png';
import { ROUTES } from '../../constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [expandedSections, setExpandedSections] = useState({});
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Organize existing pages into 3 equal columns
  const footerLinks = {
    column1: [
      { name: 'FAQ', href: ROUTES.FAQ },
      { name: 'Contact Us', href: ROUTES.CONTACT },
      { name: 'Shipping Policy', href: ROUTES.SHIPPING },
    ],
    column2: [
      { name: 'Terms & Conditions', href: ROUTES.TERMS },
      { name: 'Privacy Policy', href: ROUTES.PRIVACY },
      { name: 'Refund Policy', href: ROUTES.REFUND },
    ],
    column3: [
      { name: 'Return Policy', href: ROUTES.RETURNS },
      { name: 'About Us', href: ROUTES.ABOUT },
    ],
  };

  const socialLinks = [
    {
      name: 'Facebook',
      icon: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      href: 'https://www.facebook.com/profile.php?id=100064311781297&mibextid=ZbWKwL',
      bgClass: 'bg-[#1877F2] hover:bg-[#0F5AC6]',
      textClass: 'text-white',
    },
    {
      name: 'LinkedIn',
      icon: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.32 8.16h4.36V24H.32V8.16zM8.34 8.16h4.18v2.15h.06c.58-1.1 2-2.26 4.11-2.26 4.4 0 5.21 2.9 5.21 6.67V24h-4.36v-7.16c0-1.71-.03-3.91-2.39-3.91-2.39 0-2.76 1.86-2.76 3.79V24H8.34V8.16z"/>
        </svg>
      ),
      href: 'https://www.linkedin.com/in/ghazali-food-b50308394?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      bgClass: 'bg-[#0A66C2] hover:bg-[#084C91]',
      textClass: 'text-white',
    },
    {
      name: 'YouTube',
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a2.993 2.993 0 00-2.107-2.12C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.391.566A2.993 2.993 0 00.502 6.186C0 8.09 0 12 0 12s0 3.91.502 5.814a2.993 2.993 0 002.107 2.12C4.495 20.5 12 20.5 12 20.5s7.505 0 9.391-.566a2.993 2.993 0 002.107-2.12C24 15.91 24 12 24 12s0-3.91-.502-5.814zM9.75 15.5v-7l6 3.5-6 3.5z" />
        </svg>
      ),
      href: 'https://youtube.com/@ghazalifood?si=BdrIYDKnV5AGk2mz',
      bgClass: 'bg-[#FF0000] hover:bg-[#CC0000]',
      textClass: 'text-white',
    },
    {
      name: 'TikTok',
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 8.05a5.37 5.37 0 01-3.03-.98 5.5 5.5 0 01-1.6-1.9c-.27-.56-.44-1.16-.52-1.78h-.01A5.63 5.63 0 0114.75 2H11v11.37a2.19 2.19 0 01-1.09 1.9 2.07 2.07 0 01-1.08.3A2.19 2.19 0 016.64 13.4a2.19 2.19 0 012.19-2.19c.23 0 .45.03.66.09V8.07A5.53 5.53 0 008.83 8a5.5 5.5 0 100 11 5.5 5.5 0 005.5-5.5v-6a8.19 8.19 0 003.61 2.18c.35.1.71.18 1.06.22V8.05z" />
        </svg>
      ),
      href: 'https://www.tiktok.com/@ghazalifood?_r=1&_t=ZS-92EwkzTtQFJ',
      bgClass: 'bg-black hover:bg-gray-800',
      textClass: 'text-white',
    },
    {
      name: 'Snapchat',
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.005 2c-2.52 0-4.58 1.93-4.73 4.45-.04.71-.02 1.45-.02 2.18 0 1.18-.2 1.68-.36 2.02-.24.52-.63.86-1.36 1.08-.23.07-.37.3-.33.54.14.82.71 1.27 1.27 1.55.22.11.3.36.2.57-.39.79-1.01 1.33-1.7 1.66-.29.14-.42.48-.3.78.2.47.66.78 1.23.86.32.05.66.04 1.02.02.18-.01.36-.02.54-.02.46 0 .83.1 1.18.2.36.1.7.2 1.08.2.46 0 .82-.13 1.19-.27.32-.12.65-.24 1.03-.24.4 0 .73.12 1.06.24.37.14.73.27 1.19.27.39 0 .72-.1 1.08-.2.35-.1.72-.2 1.18-.2.17 0 .35.01.53.02.36.02.7.03 1.02-.02.57-.08 1.03-.39 1.23-.86.12-.3-.01-.64-.3-.78-.69-.33-1.31-.87-1.7-1.66-.11-.21-.03-.46.2-.57.56-.28 1.13-.73 1.27-1.55.04-.24-.1-.47-.33-.54-.73-.22-1.12-.56-1.36-1.08-.16-.34-.36-.84-.36-2.02 0-.73.02-1.47-.02-2.18C16.585 3.93 14.525 2 12.005 2z" />
        </svg>
      ),
      href: 'https://www.snapchat.com/add/ghazalifood?share_id=2vW7jbXCvOw&locale=en-GB',
      bgClass: 'bg-[#FFFC00] hover:bg-[#F2E800]',
      textClass: 'text-black',
    },
  ];

  return (
    <footer className='bg-darkGreen-950 text-gray-300 border-t border-gold-950/20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12'>
        {/* Mobile Layout */}
        <div className='md:hidden space-y-4'>
          {/* Company Info - Compact */}
          <div>
            <Link to='/' className='flex items-center space-x-2 mb-3'>
              <div className='w-12 h-12 bg-gradient-to-br from-gold-950 to-gold-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden'>
                <img
                  src={logo}
                  alt='Ghazali Food Logo'
                  className='w-full h-full object-cover rounded-full scale-110'
                />
              </div>
              <span className='text-xl font-bold text-gold-950'>
                Ghazali Food
              </span>
            </Link>
            <p className='text-sm text-gray-300 mb-3'>
              Premium quality dry fruits, nuts, and gourmet food products.
            </p>
            {/* Social Links - Compact (exact same as Contact page) */}
            <div className='flex space-x-3'>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={`p-1.5 rounded-lg ${social.bgClass} ${social.textClass} transition-colors`}
                    aria-label={social.name}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Collapsible Sections - 3 columns */}
          {Object.entries(footerLinks).map(([key, links], index) => (
            <div key={key} className='border-b border-gold-950/20 pb-2'>
              <button
                onClick={() => toggleSection(key)}
                className='w-full flex items-center justify-between text-left py-2'
              >
                <h3 className='text-sm font-semibold text-gold-950'>
                  {key === 'column1' ? 'Support' : key === 'column2' ? 'Legal' : 'Information'}
                </h3>
                {expandedSections[key] ? (
                  <ChevronUp className='h-4 w-4 text-gray-400' />
                ) : (
                  <ChevronDown className='h-4 w-4 text-gray-400' />
                )}
              </button>
              {expandedSections[key] && (
                <ul className='space-y-2 pt-2'>
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className='text-sm text-gray-300 hover:text-gold-950 transition-colors block py-1'
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Layout */}
        <div className='hidden md:grid grid-cols-1 md:grid-cols-5 gap-8'>
          {/* Company Info */}
          <div className='md:col-span-2'>
            <Link to='/' className='flex items-center space-x-2 mb-4'>
              <div className='w-14 h-14 bg-gradient-to-br from-gold-950 to-gold-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden'>
                <img
                  src={logo}
                  alt='Ghazali Food Logo'
                  className='w-full h-full object-cover rounded-full scale-110'
                />
              </div>
              <span className='text-2xl font-bold text-gold-950'>
                Ghazali Food
              </span>
            </Link>

            <p className='text-gray-300 mb-6 max-w-md'>
              Your trusted source for premium quality dry fruits, nuts, oils, chocolates, and gourmet food products. Fresh, authentic, and delivered to your doorstep.
            </p>

            {/* Contact Info */}
            <div className='flex flex-wrap items-center gap-4 md:gap-6 mb-6'>
              <div className='flex items-center space-x-2 text-gray-300'>
                <Phone className='h-5 w-5 text-gold-950 flex-shrink-0' />
                <span className='text-sm md:text-base'>+92 310 1111 659</span>
              </div>
              <div className='flex items-center space-x-2 text-gray-300'>
                <MapPin className='h-5 w-5 text-gold-950 flex-shrink-0' />
                <span className='text-sm md:text-base'>Multan, Pakistan</span>
              </div>
              <div className='flex items-center space-x-2 text-gray-300'>
                <Clock className='h-5 w-5 text-gold-950 flex-shrink-0' />
                <span className='text-sm md:text-base'>10 am to 6 pm (Mon - Sat)</span>
              </div>
            </div>

            {/* Social Links - exact same as Contact page */}
            <div className='flex space-x-4'>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={`p-3 rounded-lg ${social.bgClass} ${social.textClass} transition-colors`}
                    aria-label={social.name}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Three Equal Columns for Links */}
          <div>
            <h3 className='text-lg font-semibold mb-4 text-gold-950'>Support</h3>
            <ul className='space-y-3'>
              {footerLinks.column1.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className='text-gray-300 hover:text-gold-950 transition-colors'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-4 text-gold-950'>Legal</h3>
            <ul className='space-y-3'>
              {footerLinks.column2.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className='text-gray-300 hover:text-gold-950 transition-colors'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-4 text-gold-950'>Information</h3>
            <ul className='space-y-3'>
              {footerLinks.column3.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className='text-gray-300 hover:text-gold-950 transition-colors'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className='border-t border-gold-950/20 mt-6 md:mt-12 pt-4 md:pt-8'>
          <div className='max-w-md mx-auto text-center px-4'>
            <h3 className='text-base md:text-lg font-semibold mb-2 text-gold-950'>
              Stay Inspired & Updated
            </h3>
            <p className='text-sm md:text-base text-gray-300 mb-3 md:mb-4'>
              Receive the latest trends and tips on premium food products, healthy living, and exclusive offers.
            </p>
            <div className='flex flex-col sm:flex-row gap-2 sm:space-x-2'>
              <input
                type='email'
                placeholder='Enter your email'
                className='flex-1 px-3 md:px-4 py-2 bg-darkGreen-900 border border-gold-950/30 rounded-lg focus:ring-2 focus:ring-gold-950 focus:border-gold-950 text-sm md:text-base text-gray-300 placeholder-gray-500 min-w-0'
              />
              <button className='px-4 md:px-6 py-2 bg-gold-950 text-darkGreen-950 rounded-lg hover:bg-gold-600 transition-all whitespace-nowrap flex-shrink-0 shadow-lg hover:shadow-xl text-sm md:text-base font-semibold'>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gold-950/20 mt-4 md:mt-8 pt-4 md:pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center text-center md:text-left'>
            <div className='flex items-center justify-center space-x-2 text-xs md:text-sm text-gray-300 mb-2 md:mb-0'>
              <span>&copy; {currentYear} Ghazali Food. All rights reserved.</span>
            </div>

            <div className='flex items-center justify-center space-x-2 text-xs md:text-sm text-gray-300'>
              <span>Made with</span>
              <Heart className='h-3 w-3 md:h-4 md:w-4 text-red-400 fill-red-400' />
              <span>by Ghazali Food</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;