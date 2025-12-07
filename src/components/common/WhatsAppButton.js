import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  // WhatsApp number - update this with your actual WhatsApp business number
  const whatsappNumber = '923001234567'; // Format: country code + number (no + or spaces)
  const defaultMessage = 'Hello! I would like to place an order.';

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(defaultMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.button
      onClick={handleWhatsAppClick}
      className="fixed bottom-20 md:bottom-8 right-4 z-[150] bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-2xl p-3 md:p-4 transition-all duration-300 group flex items-center justify-center"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Shop on WhatsApp"
    >
      <div className="flex items-center gap-2">
        <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
        <span className="hidden sm:block text-sm md:text-base font-semibold whitespace-nowrap">
          Shop on WhatsApp
        </span>
      </div>
      
      {/* Pulse animation ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-75"
        animate={{
          scale: [1, 1.5, 1.5],
          opacity: [0.75, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
    </motion.button>
  );
};

export default WhatsAppButton;
