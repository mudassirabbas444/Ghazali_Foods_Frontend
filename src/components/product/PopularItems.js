import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import productService from '../../services/product';
import cartService from '../../services/cart';
import wishlistService from '../../services/wishlist';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { ROUTES } from '../../constants';
import FirebaseImage from '../FirebaseImage';

const PopularItems = ({ excludeProductIds = [], limit = 6 }) => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 2; // Show 2 items at a time on mobile

  useEffect(() => {
    fetchPopularProducts();
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const fetchPopularProducts = async () => {
    try {
      setLoading(true);
      // Fetch best sellers as popular items
      const response = await productService.getBestSellers();
      if (response.success) {
        let filtered = (response.products || []).filter(
          p => !excludeProductIds.includes(p._id)
        );
        setProducts(filtered.slice(0, limit));
      }
    } catch (error) {
      console.error('Error fetching popular products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await wishlistService.getWishlist();
      if (response.success && response.wishlist) {
        const productIds = new Set(
          response.wishlist.items?.map(item => item.product?._id || item.product) || []
        );
        setWishlistItems(productIds);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
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

  const handleToggleWishlist = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.info('Please login to add to wishlist');
      return;
    }

    try {
      const isInWishlist = wishlistItems.has(productId);
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(productId);
        setWishlistItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        toast.success('Removed from wishlist');
      } else {
        await wishlistService.addToWishlist(productId);
        setWishlistItems(prev => new Set([...prev, productId]));
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update wishlist');
    }
  };

  const calculateDiscount = (product) => {
    if (product.compareAtPrice && product.basePrice) {
      const discount = Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100);
      return discount;
    }
    return product.discount || 0;
  };

  const getProductPrice = (product) => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map(v => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return {
        current: minPrice === maxPrice ? minPrice : minPrice,
        original: product.compareAtPrice || maxPrice
      };
    }
    return {
      current: product.basePrice || 0,
      original: product.compareAtPrice || product.basePrice || 0
    };
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      Math.min(prev + itemsPerView, Math.max(0, products.length - itemsPerView))
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(0, prev - itemsPerView));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerView);
  const canGoNext = currentIndex + itemsPerView < products.length;
  const canGoPrev = currentIndex > 0;

  return (
    <div className="mt-8">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4 px-4">
          <h2 className="text-lg font-bold text-gray-900">Popular Items</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              disabled={!canGoPrev}
              className={`p-1 rounded-full ${canGoPrev ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 opacity-50'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              disabled={!canGoNext}
              className={`p-1 rounded-full ${canGoNext ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 opacity-50'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide">
          {visibleProducts.map((product) => {
            const discount = calculateDiscount(product);
            const price = getProductPrice(product);
            const isHot = product.isBestSeller;
            const isNew = product.isNewArrival;

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-shrink-0 w-[calc(50%-0.5rem)] bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}>
                  <div className="relative aspect-square bg-gray-100">
                    <FirebaseImage
                      src={product.thumbnail || product.images?.[0] || ''}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      fallbackIcon={
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-2xl">📦</span>
                        </div>
                      }
                    />
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {discount}% OFF
                      </span>
                    )}
                    {isHot && (
                      <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                        Hot 🔥
                      </span>
                    )}
                    {isNew && !isHot && (
                      <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                        New
                      </span>
                    )}
                    <button
                      onClick={(e) => handleToggleWishlist(product._id, e)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${wishlistItems.has(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                      />
                    </button>
                  </div>
                </Link>
                <div className="p-3">
                  <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                    {product.shortDescription || product.description?.substring(0, 50) + '...'}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base font-bold text-gray-900">
                      Rs. {price.current.toLocaleString()}
                    </span>
                    {price.original > price.current && (
                      <span className="text-xs text-gray-500 line-through">
                        {price.original.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                  >
                    Add To Cart
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Popular Items</h2>
          <Link
            to={`${ROUTES.SHOP}?bestsellers=true`}
            className="text-orange-500 hover:text-orange-600 font-medium text-sm"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {products.map((product) => {
            const discount = calculateDiscount(product);
            const price = getProductPrice(product);
            const isHot = product.isBestSeller;
            const isNew = product.isNewArrival;

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
              >
                <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}>
                  <div className="relative aspect-square bg-gray-100">
                    <FirebaseImage
                      src={product.thumbnail || product.images?.[0] || ''}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      fallbackIcon={
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-2xl">📦</span>
                        </div>
                      }
                    />
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {discount}% OFF
                      </span>
                    )}
                    {isHot && (
                      <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                        Hot 🔥
                      </span>
                    )}
                    {isNew && !isHot && (
                      <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                        New
                      </span>
                    )}
                    <button
                      onClick={(e) => handleToggleWishlist(product._id, e)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Heart
                        className={`w-4 h-4 ${wishlistItems.has(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                      />
                    </button>
                  </div>
                </Link>
                <div className="p-3">
                  <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm hover:text-orange-600">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                    {product.shortDescription || product.description?.substring(0, 50) + '...'}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base font-bold text-gray-900">
                      Rs. {price.current.toLocaleString()}
                    </span>
                    {price.original > price.current && (
                      <span className="text-xs text-gray-500 line-through">
                        {price.original.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Add To Cart
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopularItems;

