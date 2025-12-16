import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Clock, Mail, CheckCircle, Package } from 'lucide-react';

const RefundPage = () => {
  const sections = [
    {
      title: 'Refund Eligibility',
      icon: CheckCircle,
      content: (
        <p className="text-gray-300 leading-relaxed">
          Once we receive and inspect the returned item, we will notify you via email regarding the approval or rejection of your refund or replacement.
        </p>
      ),
    },
    {
      title: 'Refund Processing',
      icon: RefreshCw,
      content: (
        <div className="text-gray-300 leading-relaxed">
          <p className="mb-3">If approved, the refund will be initiated to the original payment method within 3 working days.</p>
          <p>Refund timelines may vary depending on the payment provider.</p>
        </div>
      ),
    },
    {
      title: 'Replacement Policy',
      icon: Package,
      content: (
        <div className="text-gray-300 leading-relaxed">
          <p className="mb-3">In case of a replacement, the new item will be dispatched at the earliest possible time after approval.</p>
          <p>Shipping timelines will follow our standard delivery policy.</p>
        </div>
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
            Refund{' '}
            <span className="bg-gradient-to-r from-gold-950 to-gold-600 bg-clip-text text-transparent">
              Policy
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Simple & Transparent Refund Process
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
              Contact Information
            </h2>
          </div>
          <p className="text-gray-300 mb-2">
            For all policy-related queries, please contact us at:
          </p>
          <p className="text-gray-300">
            <a href="mailto:info@ghazalifood.com" className="text-gold-950 hover:underline text-lg font-semibold">
              📧 info@ghazalifood.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundPage;

