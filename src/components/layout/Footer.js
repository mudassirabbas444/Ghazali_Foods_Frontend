import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Heart,
  ChevronDown,
  ChevronUp,
  Clock,
} from 'lucide-react';
import logo from '../../assets/Logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [expandedSections, setExpandedSections] = useState({});
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const footerLinks = {
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
    ],
    legal: [
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Refund Policy', href: '/refund' },
      { name: 'Shipping Policy', href: '/shipping-policy' },
    ],
    account: [
      { name: 'My Account', href: '/profile' },
      { name: 'Order History', href: '/orders' },
      { name: 'Wishlist', href: '/wishlist' },
      { name: 'Track Order', href: '/orders' },
    ],
  };

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://facebook.com/ghazalifoods',
    },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/ghazalifoods' },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com/ghazalifoods',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://linkedin.com/company/ghazalifoods',
    },
    {
      name: 'Snapchat',
      icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4 md:w-5 md:h-5">
          <path d="M12.005 2c-2.52 0-4.58 1.93-4.73 4.45-.04.71-.02 1.45-.02 2.18 0 1.18-.2 1.68-.36 2.02-.24.52-.63.86-1.36 1.08-.23.07-.37.3-.33.54.14.82.71 1.27 1.27 1.55.22.11.3.36.2.57-.39.79-1.01 1.33-1.7 1.66-.29.14-.42.48-.3.78.2.47.66.78 1.23.86.32.05.66.04 1.02.02.18-.01.36-.02.54-.02.46 0 .83.1 1.18.2.36.1.7.2 1.08.2.46 0 .82-.13 1.19-.27.32-.12.65-.24 1.03-.24.4 0 .73.12 1.06.24.37.14.73.27 1.19.27.39 0 .72-.1 1.08-.2.35-.1.72-.2 1.18-.2.17 0 .35.01.53.02.36.02.7.03 1.02-.02.57-.08 1.03-.39 1.23-.86.12-.3-.01-.64-.3-.78-.69-.33-1.31-.87-1.7-1.66-.11-.21-.03-.46.2-.57.56-.28 1.13-.73 1.27-1.55.04-.24-.1-.47-.33-.54-.73-.22-1.12-.56-1.36-1.08-.16-.34-.36-.84-.36-2.02 0-.73.02-1.47-.02-2.18C16.585 3.93 14.525 2 12.005 2z" />
        </svg>
      ),
      href: 'https://www.snapchat.com/add/ghazalifood?share_id=2vW7jbXCvOw&locale=en-GB',
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
              <div className='w-10 h-10 bg-gradient-to-br from-gold-950 to-gold-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden'>
                {logo ? (
                  <img
                    src={logo}
                    alt='Ghazali Food Logo'
                    className='w-full h-full object-cover rounded-full'
                  />
                ) : (
                  <span className='text-darkGreen-950 font-bold text-base'>GF</span>
                )}
              </div>
              <span className='text-lg font-bold text-gold-950'>
                Ghazali Food
              </span>
            </Link>
            <p className='text-sm text-gray-300 mb-3'>
              Premium quality dry fruits, nuts, and gourmet food products.
            </p>
            {/* Social Links - Compact (brand colors like Contact page) */}
            <div className='flex space-x-3'>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                let classes =
                  'p-1.5 rounded-lg border border-gold-950/30 transition-colors';

                if (social.name === 'Facebook') {
                  classes += ' bg-[#1877F2] text-white hover:bg-[#0F5AC6]';
                } else if (social.name === 'Instagram') {
                  classes += ' bg-[#E1306C] text-white hover:bg-[#C3225B]';
                } else if (social.name === 'Twitter') {
                  classes += ' bg-[#1DA1F2] text-white hover:bg-[#0D8BD9]';
                } else if (social.name === 'LinkedIn') {
                  classes += ' bg-[#0A66C2] text-white hover:bg-[#084C91]';
                } else {
                  classes += ' bg-gold-950/20 text-gold-950 hover:bg-gold-950 hover:text-darkGreen-950';
                }

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={classes}
                    aria-label={social.name}
                  >
                    <Icon className='h-4 w-4' />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Collapsible Sections */}
          {/* Shipping Info */}
          <div className='border-b border-gold-950/20 pb-2'>
            <button
              onClick={() => toggleSection('shipping')}
              className='w-full flex items-center justify-between text-left py-2'
            >
              <h3 className='text-sm font-semibold text-gray-300'>Shipping Info</h3>
              {expandedSections.shipping ? (
                <ChevronUp className='h-4 w-4 text-gray-400' />
              ) : (
                <ChevronDown className='h-4 w-4 text-gray-400' />
              )}
            </button>
            {expandedSections.shipping && (
              <ul className='space-y-2 pt-2'>
                {footerLinks.support.slice(3, 5).map((link) => (
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

          {/* Legal */}
          <div className='border-b border-gold-950/20 pb-2'>
            <button
              onClick={() => toggleSection('legal')}
              className='w-full flex items-center justify-between text-left py-2'
            >
              <h3 className='text-sm font-semibold text-gold-950'>Legal</h3>
              {expandedSections.legal ? (
                <ChevronUp className='h-4 w-4 text-gray-400' />
              ) : (
                <ChevronDown className='h-4 w-4 text-gray-400' />
              )}
            </button>
            {expandedSections.legal && (
              <ul className='space-y-2 pt-2'>
                {footerLinks.legal.map((link) => (
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

          {/* Account */}
          <div className='border-b border-gold-950/20 pb-2'>
            <button
              onClick={() => toggleSection('account')}
              className='w-full flex items-center justify-between text-left py-2'
            >
              <h3 className='text-sm font-semibold text-gold-950'>Account</h3>
              {expandedSections.account ? (
                <ChevronUp className='h-4 w-4 text-gray-400' />
              ) : (
                <ChevronDown className='h-4 w-4 text-gray-400' />
              )}
            </button>
            {expandedSections.account && (
              <ul className='space-y-2 pt-2'>
                {footerLinks.account.map((link) => (
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
        </div>

        {/* Desktop Layout */}
        <div className='hidden md:grid grid-cols-1 md:grid-cols-5 gap-8'>
          {/* Company Info */}
          <div className='md:col-span-2'>
            <Link to='/' className='flex items-center space-x-2 mb-4'>
              <div className='w-12 h-12 bg-gradient-to-br from-gold-950 to-gold-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden'>
                {logo ? (
                  <img
                    src={logo}
                    alt='Ghazali Food Logo'
                    className='w-full h-full object-cover rounded-full'
                  />
                ) : (
                  <span className='text-darkGreen-950 font-bold text-xl'>GF</span>
                )}
              </div>
              <span className='text-xl font-bold text-gold-950'>
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

            {/* Social Links - brand colors like Contact page */}
            <div className='flex space-x-4'>
              {socialLinks.map((social) => {
                const Icon = social.icon;

                let classes =
                  'p-2 rounded-lg border border-gold-950/30 transition-colors';
                if (social.name === 'Facebook') {
                  classes += ' bg-[#1877F2] text-white hover:bg-[#0F5AC6]';
                } else if (social.name === 'Instagram') {
                  classes += ' bg-[#E1306C] text-white hover:bg-[#C3225B]';
                } else if (social.name === 'Twitter') {
                  classes += ' bg-[#1DA1F2] text-white hover:bg-[#0D8BD9]';
                } else if (social.name === 'LinkedIn') {
                  classes += ' bg-[#0A66C2] text-white hover:bg-[#084C91]';
                } else {
                  classes += ' bg-gold-950/20 text-gold-950 hover:bg-gold-950 hover:text-darkGreen-950';
                }

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={classes}
                    aria-label={social.name}
                  >
                    <Icon className='h-5 w-5' />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Support Links */}
          <div>
            <h3 className='text-lg font-semibold mb-4 text-gold-950'>Support</h3>
            <ul className='space-y-3'>
              {footerLinks.support.map((link) => (
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

          {/* Legal Links */}
          <div>
            <h3 className='text-lg font-semibold mb-4 text-gold-950'>Legal</h3>
            <ul className='space-y-3'>
              {footerLinks.legal.map((link) => (
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

          {/* Account Links */}
          <div>
            <h3 className='text-lg font-semibold mb-4 text-gold-950'>Account</h3>
            <ul className='space-y-3'>
              {footerLinks.account.map((link) => (
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