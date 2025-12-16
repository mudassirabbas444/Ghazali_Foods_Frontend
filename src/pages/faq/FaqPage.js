import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: 'Are Ghazali Food dry fruits organic?',
    answer:
      'Ghazali Food provides a wide selection of premium dry fruits, including organic dry fruits sourced from trusted farms. Each product page clearly states whether the item is organic or conventionally sourced, ensuring transparency and quality assurance.',
  },
  {
    question: 'Can people with allergies consume Ghazali Food dry fruits?',
    answer:
      'Individuals with nut or food allergies should exercise caution when consuming dry fruits. Some Ghazali Food products contain almonds, cashews, pistachios, walnuts, and other nuts that may cause allergic reactions. Always check the product label and consult a healthcare professional if you have allergies.',
  },
  {
    question: 'What is the shelf life of Ghazali Food dry fruits?',
    answer:
      'Ghazali Food dry fruits are hygienically processed and air-tight packed to ensure long-lasting freshness. When stored properly, most dry fruits have a shelf life of several months up to one year.',
  },
  {
    question: 'How should Ghazali Food dry fruits be stored?',
    answer:
      'For best results, store Ghazali Food dry fruits in a cool, dry place away from direct sunlight. After opening, transfer the contents to an airtight container to maintain freshness, taste, and nutritional value.',
  },
  {
    question: 'Are Ghazali Food dry fruits good for daily consumption?',
    answer:
      'Yes. Ghazali Food dry fruits are rich in nutrients, healthy fats, and natural energy, making them suitable for daily consumption when eaten in moderation as part of a balanced diet.',
  },
  {
    question: 'Are Ghazali Food dry fruits suitable for gifting?',
    answer:
      'Yes. Ghazali Food offers premium packaging designed for festive gifting, weddings, corporate events, and special occasions, making our dry fruits an ideal gift choice.',
  },
  {
    question: 'Where can I buy Ghazali Food dry fruits?',
    answer:
      'You can purchase Ghazali Food dry fruits through our official website, authorized retailers, and selected online marketplaces. Visit our product pages to explore the complete range.',
  },
  {
    question: 'Why choose Ghazali Food for dry fruits?',
    answer:
      'Ghazali Food is trusted for its premium quality, hygienic packaging, authentic taste, and customer satisfaction, making it a preferred choice for dry fruits across Pakistan.',
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
            Discover everything you need to know about Ghazali Food premium dry fruits, including quality, storage, allergies, and organic options.
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

        {/* Need More Assistance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center bg-darkGreen-900/50 border border-gold-950/20 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-semibold text-gold-950 mb-4">
            Need more assistance?
          </h2>
          <p className="text-gray-300 mb-6">
            For additional questions, visit our Contact Us page or reach out to our customer support team.
          </p>
          <Link
            to="/contact"
            className="inline-block px-6 py-3 bg-gold-950 text-darkGreen-950 rounded-lg hover:bg-gold-600 transition-all font-semibold"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default FaqPage;


