import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Heart, Star, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import cartService from '../../services/cart';
import wishlistService from '../../services/wishlist';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { ROUTES } from '../../constants';
import FirebaseImage from '../FirebaseImage';

const QuickView = ({ product, isOpen, onClose }) => {
  const { isAuthenticated } = useAuth();
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  if (!product) return null;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      onClose();
      return;
    }

    try {
      setAddingToCart(true);
      const variantWeight = selectedVariant?.weight || 'default';
      await cartService.addToCart(product._id, variantWeight, quantity);
      toast.success('Added to cart!');
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add to wishlist');
      return;
    }

    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(product._id);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await wishlistService.addToWishlist(product._id);
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update wishlist');
    }
  };

  const getCurrentPrice = () => {
    if (selectedVariant) {
      return selectedVariant.price;
    }
    return product.basePrice || 0;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-gray-900">Quick View</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {/* Product Image */}
                <div>
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                    <FirebaseImage
                      src={product.thumbnail || product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Product Info */}
                <div>
                  <Link
                    to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}
                    onClick={onClose}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 hover:text-green-600">
                      {product.name}
                    </h3>
                  </Link>

                  {product.averageRating > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.averageRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({product.totalReviews} reviews)
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold text-gray-900">
                        Rs. {getCurrentPrice().toLocaleString()}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          Rs. {product.compareAtPrice.toLocaleString()}
                        </span>
                      )}
                      {product.discount > 0 && (
                        <span className="bg-red-100 text-red-700 text-sm font-semibold px-2 py-1 rounded">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6 line-clamp-3">
                    {product.description}
                  </p>

                  {/* Variants */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Weight:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((variant, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedVariant(variant)}
                            className={`px-3 py-2 rounded-lg border-2 transition-colors text-sm ${
                              selectedVariant?.weight === variant.weight
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-300 hover:border-green-300'
                            }`}
                          >
                            {variant.weight} - Rs. {variant.price.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity:
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {addingToCart ? 'Adding...' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={handleToggleWishlist}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        isInWishlist
                          ? 'border-red-500 bg-red-50 text-red-600'
                          : 'border-gray-300 hover:border-red-300'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-500' : ''}`} />
                    </button>
                  </div>

                  <Link
                    to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}
                    onClick={onClose}
                    className="block text-center mt-4 text-green-600 hover:text-green-700 font-medium"
                  >
                    View Full Details →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickView;

