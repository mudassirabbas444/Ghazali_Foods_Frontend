import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Clock, Mail, AlertCircle, CheckCircle, Package } from 'lucide-react';

const ReturnsPage = () => {
  const sections = [
    {
      title: 'Exchange Eligibility',
      icon: CheckCircle,
      content: (
        <div className="text-gray-300 leading-relaxed">
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>All exchange requests must be reported within 24 hours of order delivery.</li>
            <li>Products must be unused, unopened, and in original packaging, with all labels intact.</li>
            <li>Any request received after 24 hours of delivery will not be eligible for exchange.</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Exchange Process (Online Orders Only)',
      icon: RefreshCw,
      content: (
        <div className="text-gray-300 leading-relaxed">
          <p className="mb-3">Ghazali Food operates online only and does not have a physical retail shop.</p>
          <p className="mb-3 font-semibold text-gold-950">To request an exchange:</p>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Email our customer support team at <a href="mailto:info@ghazalifood.com" className="text-gold-950 hover:underline">info@ghazalifood.com</a> within 24 hours of delivery.</li>
            <li>Share your order number, reason for exchange, and clear images/videos (if applicable).</li>
            <li>Once approved, our team will guide you through the courier return process.</li>
          </ol>
        </div>
      ),
    },
    {
      title: 'Return Shipping',
      icon: Package,
      content: (
        <div className="text-gray-300 leading-relaxed">
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Customers are responsible for all return courier charges, unless the product is damaged or incorrect.</li>
            <li>We strongly recommend using a trackable courier service.</li>
            <li>Ghazali Food is not responsible for items lost or damaged during return shipping.</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Exchange Processing Time',
      icon: Clock,
      content: (
        <p className="text-gray-300 leading-relaxed">
          After receiving and inspecting the returned product, we will process your exchange within 2–3 business days.
          <br /><br />
          You will be notified via email once the exchange has been completed.
        </p>
      ),
    },
    {
      title: 'Damaged, Defective, or Incorrect Items (Exceptions)',
      icon: AlertCircle,
      content: (
        <p className="text-gray-300 leading-relaxed">
          If you receive a damaged, defective, or incorrect product, please contact us at <a href="mailto:info@ghazalifood.com" className="text-gold-950 hover:underline">info@ghazalifood.com</a> within 24 hours of delivery, along with clear photos or videos.
          <br /><br />
          After verification, Ghazali Food will arrange a replacement or exchange at its discretion.
        </p>
      ),
    },
    {
      title: 'Important Notes',
      icon: AlertCircle,
      content: (
        <div className="text-gray-300 leading-relaxed">
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>No refunds are offered unless explicitly stated.</li>
            <li>Perishable or clearance items may not be eligible for exchange.</li>
            <li>Ghazali Food reserves the right to accept or reject any exchange request based on product condition and policy compliance.</li>
          </ul>
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
            Return & Exchange{' '}
            <span className="bg-gradient-to-r from-gold-950 to-gold-600 bg-clip-text text-transparent">
              Policy
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-4">
            Hassle-Free Exchanges for Your Satisfaction
          </p>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Thank you for shopping with Ghazali Food. We aim to deliver premium-quality dry fruits and food products. If you are not completely satisfied with your purchase, we offer a limited exchange policy as outlined below.
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

export default ReturnsPage;

