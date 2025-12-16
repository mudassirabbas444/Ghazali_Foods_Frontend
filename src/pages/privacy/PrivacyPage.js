import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Database, Eye, Lock, ExternalLink, Mail, Cookie } from 'lucide-react';

const PrivacyPage = () => {
  const sections = [
    {
      title: 'Information We Collect',
      icon: Database,
      content: (
        <div className="text-gray-300 leading-relaxed">
          <p className="mb-3">We may collect the following information when you use our website or contact us:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Address (for orders or inquiries)</li>
            <li>Any information you voluntarily provide through forms or email</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'How We Use Your Information',
      icon: Eye,
      content: (
        <div className="text-gray-300 leading-relaxed">
          <p className="mb-3">The information we collect is used to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Process orders and inquiries</li>
            <li>Improve our products and services</li>
            <li>Respond to customer support requests</li>
            <li>Send important updates related to your order or inquiry</li>
          </ul>
          <p className="mt-3 font-semibold text-gold-950">
            We do not sell, trade, or rent your personal information to third parties.
          </p>
        </div>
      ),
    },
    {
      title: 'Cookies',
      icon: Cookie,
      content: (
        <p className="text-gray-300 leading-relaxed">
          Our website may use cookies to enhance user experience and analyze website traffic. Cookies help us understand how visitors use our site so we can improve it. You can choose to disable cookies in your browser settings.
        </p>
      ),
    },
    {
      title: 'Data Security',
      icon: Lock,
      content: (
        <p className="text-gray-300 leading-relaxed">
          We take reasonable security measures to protect your personal information from unauthorized access, misuse, or disclosure.
        </p>
      ),
    },
    {
      title: 'Third-Party Links',
      icon: ExternalLink,
      content: (
        <p className="text-gray-300 leading-relaxed">
          Our website may contain links to third-party websites. Ghazali Food is not responsible for the privacy practices or content of those websites.
        </p>
      ),
    },
    {
      title: 'Your Consent',
      icon: Shield,
      content: (
        <p className="text-gray-300 leading-relaxed">
          By using our website, you agree to this Privacy Policy and consent to the collection and use of information as described.
        </p>
      ),
    },
    {
      title: 'Updates to This Policy',
      icon: Shield,
      content: (
        <p className="text-gray-300 leading-relaxed">
          Ghazali Food may update this Privacy Policy from time to time. Any changes will be posted on this page.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-darkGreen-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gold-950 mb-4">
            Privacy{' '}
            <span className="bg-gradient-to-r from-gold-950 to-gold-600 bg-clip-text text-transparent">
              Policy
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-4">
            At Ghazali Food, we respect your privacy and are committed to protecting your personal information.
          </p>
          <p className="text-gray-300 max-w-2xl mx-auto">
            This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or contact us.
          </p>
        </motion.div>

        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className="bg-darkGreen-900/50 border border-gold-950/20 rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-gold-950/15 text-gold-950 flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gold-950 mb-3">
                      {section.title}
                    </h2>
                    <div className="text-gray-300">
                      {section.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center bg-darkGreen-900/50 border border-gold-950/20 rounded-2xl p-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-gold-950" />
            <h2 className="text-2xl font-semibold text-gold-950">
              Contact Us
            </h2>
          </div>
          <p className="text-gray-300 mb-2">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="text-gray-300">
            <a href="mailto:info@ghazalifood.com" className="text-gold-950 hover:underline text-lg font-semibold">
              📧 Email: info@ghazalifood.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPage;

