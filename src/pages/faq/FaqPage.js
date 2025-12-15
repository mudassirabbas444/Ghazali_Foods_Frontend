import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'What are your delivery charges?',
    answer:
      'Delivery is free on orders above Rs. 2,500. For orders below this amount, a standard delivery fee is applied at checkout.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'We offer a 24-hour return/replacement policy for damaged or incorrect items. Please share order details and pictures with our support team within 24 hours of delivery.',
  },
  {
    question: 'What are your support hours?',
    answer:
      'Our support team is available from 10 am to 6 pm, Monday to Saturday.',
  },
  {
    question: 'How can I place an order on WhatsApp?',
    answer:
      'You can place your order directly on WhatsApp by contacting us at +92 310 1111 659. Share the product name, quantity, and your delivery details.',
  },
  {
    question: 'Do you deliver nationwide?',
    answer:
      'Yes, we deliver across Pakistan using trusted courier partners. Delivery times may vary based on your city.',
  },
];

const FaqPage = () => {
  const [openIndex, setOpenIndex] = React.useState(0);

  const toggleIndex = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

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
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-gold-950 to-gold-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Find quick answers about delivery, returns, support timings, and how
            to order from Ghazali Food.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className="bg-darkGreen-900/50 border border-gold-950/20 rounded-2xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-full bg-gold-950/15 text-gold-950">
                      <HelpCircle className="w-5 h-5" />
                    </span>
                    <span className="font-semibold text-gray-100">
                      {item.question}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-gray-300">
                    {item.answer}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;


