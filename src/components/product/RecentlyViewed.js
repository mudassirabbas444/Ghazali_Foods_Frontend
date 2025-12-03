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
    setProducts(items);
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
    <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recently Viewed</h2>
        <button
          onClick={handleClear}
          className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
        >
          Clear All
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group"
          >
            <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}>
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                <FirebaseImage
                  src={product.thumbnail || product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                {product.name}
              </h3>
              <p className="text-sm font-bold text-orange-600">
                Rs. {(product.basePrice || product.variants?.[0]?.price || 0).toLocaleString()}
              </p>
            </Link>
            <button
              onClick={(e) => handleAddToCart(product, e)}
              className="absolute bottom-0 right-0 p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors opacity-0 group-hover:opacity-100"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;

