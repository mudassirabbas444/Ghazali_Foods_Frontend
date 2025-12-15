import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, ShoppingCart, Heart } from 'lucide-react';
import { getRecentlyViewed, clearRecentlyViewed } from '../../utils/recentlyViewed';
import cartService from '../../services/cart';
import wishlistService from '../../services/wishlist';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { ROUTES } from '../../constants';
import FirebaseImage from '../FirebaseImage';

const RecentlyViewed = () => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadRecentlyViewed();
  }, []);

  const loadRecentlyViewed = () => {
    const items = getRecentlyViewed();
    // Only keep the last 5 (most recent first in storage)
    setProducts(items.slice(0, 5));
  };

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      return;
    }

    try {
      const variantWeight = product.variants?.[0]?.weight || 'default';
      await cartService.addToCart(product._id, variantWeight, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const handleClear = () => {
    clearRecentlyViewed();
    setProducts([]);
    toast.success('Recently viewed cleared');
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 bg-darkGreen-900/40 border border-gold-950/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gold-950">Recently Viewed</h2>
        <button
          onClick={handleClear}
          className="text-sm text-gray-300 hover:text-gold-950 transition-colors"
        >
          Clear All
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-darkGreen-900/50 border border-gold-950/20 rounded-lg overflow-hidden hover:border-gold-950/50 transition-all duration-300 group"
          >
            <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}>
              <div className="relative aspect-square bg-darkGreen-950">
                <FirebaseImage
                  src={
                    (product.images && product.images.length > 0 && product.images[0]) ||
                    product.thumbnail ||
                    'https://images8.alphacoders.com/109/1095996.jpg'
                  }
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </Link>

            <div className="p-3">
              <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}>
                <h3 className="text-sm font-semibold text-gray-200 line-clamp-2 mb-1 hover:text-gold-950 transition-colors">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm font-bold text-gold-950">
                  Rs. {(product.basePrice || product.variants?.[0]?.price || 0).toLocaleString()}
                </p>
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  className="p-2 bg-gold-950 text-darkGreen-950 rounded-lg hover:bg-gold-600 transition-colors"
                  title="Add to Cart"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;

