import React from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, Phone, Mail, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const ShippingPage = () => {
  const sections = [
    {
      title: 'Nationwide Shipping',
      icon: Truck,
      content: (
        <div className="text-gray-300 leading-relaxed">
          <p className="mb-3">Ghazali Food delivers to almost all cities across Pakistan.</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Standard delivery time: 3 to 5 working days</li>
            <li>Delivery timelines may vary due to location, weather, or courier operations.</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Same-Day Delivery (Multan Only)',
      icon: MapPin,
      content: (
        <div className="text-gray-300 leading-relaxed">
          <p className="mb-2 font-semibold text-gold-950">📍 Multan Customers Special Offer</p>
          <p>Orders placed from Multan are eligible for same-day delivery, subject to order confirmation and availability.</p>
        </div>
      ),
    },
    {
      title: 'Order Confirmation (Mandatory)',
      icon: Phone,
      content: (
        <div className="text-gray-300 leading-relaxed">
          <p className="mb-3">All orders are processed only after on-call confirmation by our customer support team.</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>If the customer does not attend the confirmation call, the order will be put on hold.</li>
            <li>Orders will be dispatched only after successful confirmation.</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Payment Methods',
      icon: CheckCircle,
      content: (
        <div className="text-gray-300 leading-relaxed">
          <p className="mb-3">We offer safe and convenient payment options:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>💰 Cash on Delivery (COD)</li>
            <li>💳 Online Payment</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Accuracy of Information',
      icon: AlertCircle,
      content: (
        <p className="text-gray-300 leading-relaxed">
          Please ensure that your contact number, delivery address, and city details are correct before placing an order.
          <br /><br />
          Ghazali Food is not responsible for delays or non-delivery caused by incorrect information provided by the customer.
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
            Shipping{' '}
            <span className="bg-gradient-to-r from-gold-950 to-gold-600 bg-clip-text text-transparent">
              Policy
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Fast & Reliable Delivery Across Pakistan
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

export default ShippingPage;

