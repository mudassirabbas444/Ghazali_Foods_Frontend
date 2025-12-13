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
  ];

  return (
    <footer className='bg-darkGreen-950 text-gray-300 border-t border-gold-950/20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12'>
        {/* Mobile Layout */}
        <div className='md:hidden space-y-4'>
          {/* Company Info - Compact */}
          <div>
            <Link to='/' className='flex items-center space-x-2 mb-3'>
              <div className='w-8 h-8 bg-gradient-to-br from-gold-950 to-gold-600 rounded-full flex items-center justify-center shadow-lg'>
                <span className='text-darkGreen-950 font-bold text-sm'>GF</span>
              </div>
              <span className='text-lg font-bold text-gold-950'>
                Ghazali Food
              </span>
            </Link>
            <p className='text-sm text-gray-300 mb-3'>
              Premium quality dry fruits, nuts, and gourmet food products.
            </p>
            {/* Social Links - Compact */}
            <div className='flex space-x-3'>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-1.5 bg-gold-950/20 border border-gold-950/30 rounded-lg hover:bg-gold-950 hover:text-darkGreen-950 transition-colors text-gold-950'
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
              <div className='w-10 h-10 bg-gradient-to-br from-gold-950 to-gold-600 rounded-full flex items-center justify-center shadow-lg'>
                <span className='text-darkGreen-950 font-bold text-lg'>GF</span>
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
                <span className='text-sm md:text-base'>+923101111659</span>
              </div>
              <div className='flex items-center space-x-2 text-gray-300'>
                <MapPin className='h-5 w-5 text-gold-950 flex-shrink-0' />
                <span className='text-sm md:text-base'>Multan, Pakistan</span>
              </div>
              <div className='flex items-center space-x-2 text-gray-300'>
                <Clock className='h-5 w-5 text-gold-950 flex-shrink-0' />
                <span className='text-sm md:text-base'>10am to 6pm</span>
              </div>
            </div>

            {/* Social Links */}
            <div className='flex space-x-4'>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='p-2 bg-gold-950/20 border border-gold-950/30 rounded-lg hover:bg-gold-950 hover:text-darkGreen-950 transition-colors text-gold-950'
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