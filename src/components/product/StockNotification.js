import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import stockNotificationService from '../../services/stockNotification';
import { toast } from 'react-toastify';

const StockNotification = ({ product, variant = null }) => {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const stock = variant?.stock || product?.stock || 0;
  const isOutOfStock = stock === 0;

  if (!isOutOfStock) {
    return null;
  }

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setSubmitting(true);
      const variantWeight = variant?.weight || null;
      const response = await stockNotificationService.subscribe(
        product._id,
        email,
        variantWeight
      );
      
      if (response.success) {
        setSubscribed(true);
        toast.success('You will be notified when this product is back in stock!');
        setEmail('');
      } else {
        toast.error(response.message || 'Failed to subscribe');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to subscribe');
    } finally {
      setSubmitting(false);
    }
  };

  if (subscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-200 rounded-lg p-4"
      >
        <div className="flex items-center gap-2 text-green-700">
          <Check className="w-5 h-5" />
          <p className="font-medium">You're subscribed! We'll notify you when this product is back in stock.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-orange-50 border border-orange-200 rounded-lg p-4"
    >
      <div className="flex items-start gap-3">
        <Bell className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">Out of Stock</h4>
          <p className="text-sm text-gray-600 mb-3">
            Get notified when this product is back in stock
          </p>
          {isAuthenticated ? (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 text-sm font-medium"
              >
                {submitting ? 'Subscribing...' : 'Notify Me'}
              </button>
            </form>
          ) : (
            <p className="text-sm text-gray-600">
              Please <a href="/login" className="text-orange-600 hover:underline">login</a> to get notified
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StockNotification;

