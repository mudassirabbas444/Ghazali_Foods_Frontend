import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertCircle, ExternalLink, Shield } from 'lucide-react';

const TermsPage = () => {
  const sections = [
    {
      title: 'Information Accuracy Disclaimer',
      icon: AlertCircle,
      content: (
        <p className="text-gray-300 leading-relaxed">
          While Ghazali Food strives to ensure that all information on our website is accurate and up to date, we make no warranties or guarantees regarding the reliability, accuracy, timeliness, usefulness, or completeness of any content.
          <br /><br />
          Visitors are encouraged to independently verify any information that is important to their purchase or consumption decisions.
        </p>
      ),
    },
    {
      title: 'Third-Party Links, Advertisers & External Services',
      icon: ExternalLink,
      content: (
        <p className="text-gray-300 leading-relaxed">
          The Ghazali Food website may contain links to third-party websites, advertisers, or service providers. Ghazali Food does not control or endorse these external sites and is not responsible for the performance, quality, or reliability of goods or services provided by them.
          <br /><br />
          Accessing third-party links is done at your own discretion and risk.
        </p>
      ),
    },
    {
      title: 'Product Information, Packaging & Returns',
      icon: FileText,
      content: (
        <p className="text-gray-300 leading-relaxed">
          Product descriptions, images, ingredients, and nutritional details displayed on the Ghazali Food website are provided for informational purposes only. Actual product packaging or specifications may vary due to manufacturer changes.
          <br /><br />
          If a product is found to be not as described, your sole remedy is to return the product in unused condition, in accordance with our return policy. Certain products may not be eligible for return.
        </p>
      ),
    },
    {
      title: 'Health & Nutrition Disclaimer',
      icon: Shield,
      content: (
        <p className="text-gray-300 leading-relaxed">
          Any health, wellness, or nutritional information provided on the Ghazali Food website is for general informational purposes only and is not intended as medical advice.
          <br /><br />
          This information does not cover all possible uses, precautions, side effects, or interactions. Always consult a qualified medical professional before consuming any dry fruits, nuts, or related food products, especially if you have allergies or medical conditions.
        </p>
      ),
    },
    {
      title: 'Intellectual Property Rights',
      icon: FileText,
      content: (
        <p className="text-gray-300 leading-relaxed">
          All content on the Ghazali Food website, including but not limited to text, images, logos, graphics, product designs, layouts, icons, videos, software, and other materials, is the intellectual property of Ghazali Food or its licensed partners.
          <br /><br />
          These materials are protected under applicable copyright, trademark, and intellectual property laws.
        </p>
      ),
    },
    {
      title: 'Permitted Website Use',
      icon: FileText,
      content: (
        <div className="text-gray-300 leading-relaxed">
          <p className="mb-3">You may access, view, download, and print website content only for personal, non-commercial use, provided that you:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Retain all copyright, trademark, and proprietary notices</li>
            <li>Do not modify or alter any content</li>
            <li>Do not distribute or resell content for commercial purposes</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Prohibited Activities',
      icon: AlertCircle,
      content: (
        <p className="text-gray-300 leading-relaxed">
          You may not reproduce, copy, publish, transmit, distribute, modify, create derivative works from, sell, or exploit any part of the Ghazali Food website or its content for commercial purposes without written permission.
        </p>
      ),
    },
    {
      title: 'Software & Website Security',
      icon: Shield,
      content: (
        <p className="text-gray-300 leading-relaxed">
          All software and technical systems used on the Ghazali Food website are owned by Ghazali Food or its suppliers and are protected by copyright laws. The website and its software may be used only as a shopping and informational platform.
          <br /><br />
          Unauthorized use of the website, including attempts to disrupt, hack, or misuse the platform, is strictly prohibited.
        </p>
      ),
    },
    {
      title: 'Changes to Terms & Conditions',
      icon: FileText,
      content: (
        <p className="text-gray-300 leading-relaxed">
          Ghazali Food reserves the right to update or modify these Terms & Conditions at any time without prior notice. Continued use of the website after changes are posted constitutes acceptance of the revised terms.
        </p>
      ),
    },
    {
      title: 'Contact Information',
      icon: FileText,
      content: (
        <p className="text-gray-300 leading-relaxed">
          For any questions regarding these Terms & Conditions, please contact Ghazali Food Customer Support through our official website.
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
            Terms &{' '}
            <span className="bg-gradient-to-r from-gold-950 to-gold-600 bg-clip-text text-transparent">
              Conditions
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Welcome to Ghazali Food. By accessing or using our website, you agree to comply with and be bound by the following Terms & Conditions. Please read them carefully before using our services or purchasing our dry fruits and related products.
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
      </div>
    </div>
  );
};

export default TermsPage;

