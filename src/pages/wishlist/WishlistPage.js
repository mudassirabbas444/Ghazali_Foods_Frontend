import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Trash2,
  Loader2,
} from 'lucide-react';
import wishlistService from '../../services/wishlist';
import cartService from '../../services/cart';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { ROUTES } from '../../constants';
import FirebaseImage from '../../components/FirebaseImage';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    fetchWishlist();
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistService.getWishlist();
      if (response.success) {
        // Backend returns data in response.data
        const wishlistData = response.data || response.wishlist;
        console.log('Wishlist data:', wishlistData);
        console.log('Wishlist products:', wishlistData?.products);
        setWishlist(wishlistData);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      toast.success('Removed from wishlist');
      fetchWishlist();
    } catch (error) {
      toast.error(error.message || 'Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (product, variant = null) => {
    try {
      const selectedVariant = variant || product.variants?.[0];
      const variantWeight = selectedVariant?.weight || 'default';
      
      await cartService.addToCart(product._id, variantWeight, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const getProductPrice = (product) => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map(v => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return minPrice === maxPrice 
        ? `Rs. ${minPrice.toLocaleString()}`
        : `Rs. ${minPrice.toLocaleString()} - Rs. ${maxPrice.toLocaleString()}`;
    }
    return `Rs. ${(product.basePrice || 0).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold-950" />
      </div>
    );
  }

  // Wishlist has products array, not items
  const products = wishlist?.products || [];

  return (
    <div className="min-h-screen bg-darkGreen-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gold-950 mb-8">My Wishlist</h1>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-darkGreen-900/50 border border-gold-950/20 rounded-2xl">
            <Heart className="w-24 h-24 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gold-950 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-300 mb-6">Add products you love to your wishlist</p>
            <Link
              to={ROUTES.SHOP}
              className="inline-block bg-gold-950 text-darkGreen-950 px-6 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              if (!product) return null;

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-darkGreen-900/50 border border-gold-950/20 rounded-2xl hover:border-gold-950/50 transition-all duration-300 p-4"
                >
                  <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug || product._id)}>
                    <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden bg-darkGreen-950">
                      <FirebaseImage
                        src={
                          (product.images && product.images.length > 0 && product.images[0])
                          || product.thumbnail
                          || 'https://images8.alphacoders.com/109/1095996.jpg'
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                  </Link>

                  <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug || product._id)}>
                    <h3 className="font-semibold text-gray-200 mb-1 line-clamp-2 hover:text-gold-950">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                    {product.shortDescription || product.description}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className="text-lg font-bold text-gold-950">
                        {getProductPrice(product)}
                      </p>
                      {product.compareAtPrice && (
                        <p className="text-sm text-gray-400 line-through">
                          Rs. {product.compareAtPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gold-950 text-darkGreen-950 py-2 px-4 rounded-lg hover:bg-gold-600 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;

