import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Truck,
  Shield,
  RefreshCw,
  Headphones,
} from 'lucide-react';
import { ROUTES } from '../constants';
import productService from '../services/product';
import categoryService from '../services/category';
import bannerService from '../services/banner';
import cartService from '../services/cart';
import wishlistService from '../services/wishlist';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import FirebaseImage from '../components/FirebaseImage';
import Layout from '../components/layout/Layout';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [wishlistItems, setWishlistItems] = useState(new Set());

  useEffect(() => {
    fetchHomeData();
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [bannersRes, categoriesRes, featuredRes, bestSellersRes, newArrivalsRes] = await Promise.all([
        bannerService.getBanners(),
        categoryService.getCategories(true),
        productService.getFeaturedProducts(),
        productService.getBestSellers(),
        productService.getNewArrivals(),
      ]);

      if (bannersRes.success) {
        const allBanners = bannersRes.banners || bannersRes.data || [];
        // Show all active banners (isActive is true or undefined)
        // Prioritize by position: home_slider > home_banner > others
        const activeBanners = allBanners.filter(b => b.isActive !== false);
        
        // Sort by position priority
        const sortedBanners = activeBanners.sort((a, b) => {
          const positionOrder = { 'home_slider': 1, 'home_banner': 2 };
          const aOrder = positionOrder[a.position] || 3;
          const bOrder = positionOrder[b.position] || 3;
          return aOrder - bOrder;
        });
        
        setBanners(sortedBanners);
      }
      if (categoriesRes.success) {
        // Show all categories (main categories only for navigation)
        const allCategories = categoriesRes.data || categoriesRes.categories || [];
        const mainCategories = allCategories.filter(c => !c.parentCategory);
        setCategories(mainCategories);
        
        // Fetch products for top 5 categories
        const topCategories = mainCategories.slice(0, 5);
        fetchCategoryProducts(topCategories);
      }
      if (featuredRes.success) {
        setFeaturedProducts(featuredRes.products || []);
      }
      if (bestSellersRes.success) {
        setBestSellers(bestSellersRes.products || []);
      }
      if (newArrivalsRes.success) {
        setNewArrivals(newArrivalsRes.products || []);
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryProducts = async (categories) => {
    try {
      const productsMap = {};
      await Promise.all(
        categories.map(async (category) => {
          try {
            const response = await productService.getProducts({
              category: category._id,
              limit: 10,
              isActive: true,
            });
            if (response.success) {
              productsMap[category._id] = response.products || [];
            }
          } catch (error) {
            console.error(`Error fetching products for category ${category.name}:`, error);
            productsMap[category._id] = [];
          }
        })
      );
      setCategoryProducts(productsMap);
    } catch (error) {
      console.error('Error fetching category products:', error);
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

  const handleAddToCart = async (product, variant = null) => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      return;
    }

    try {
      const selectedVariant = variant || product.variants?.[0];
      const variantWeight = selectedVariant?.weight || 'default';
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

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Banner Carousel Section - First */}
        {banners.length > 0 && (
          <section className="relative w-full bg-white">
            <div className="relative w-full h-[250px] md:h-[400px] lg:h-[500px] overflow-hidden bg-gray-100">
              {banners.map((banner, index) => (
                <motion.div
                  key={banner._id || index}
                  initial={false}
                  animate={{
                    opacity: index === currentBannerIndex ? 1 : 0,
                    x: index === currentBannerIndex ? 0 : index < currentBannerIndex ? '-100%' : '100%',
                    scale: index === currentBannerIndex ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className={`absolute inset-0 ${index === currentBannerIndex ? 'z-10' : 'z-0 pointer-events-none'}`}
                  style={{ display: index === currentBannerIndex ? 'block' : 'block' }}
                >
                  <Link to={banner.link || '#'} className="block h-full w-full">
                    <FirebaseImage
                      src={banner.image}
                      alt={banner.title || `Banner ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                </motion.div>
              ))}
              
              {/* Navigation Arrows */}
              {banners.length > 1 && (
                <>
                  <button
                    onClick={prevBanner}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                    aria-label="Previous banner"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextBanner}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                    aria-label="Next banner"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </>
              )}
              
              {/* Dots Indicator */}
              {banners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentBannerIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentBannerIndex
                          ? 'bg-white w-8'
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to banner ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="bg-gray-50 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-4 gap-2 md:gap-6">
              {/* Free Shipping */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-lg p-2 md:p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center mb-2 md:mb-3">
                  <div className="bg-green-100 rounded-full p-1.5 md:p-3">
                    <Truck className="w-4 h-4 md:w-8 md:h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-0.5 md:mb-1 text-[10px] md:text-base leading-tight">Free Shipping</h3>
                <p className="text-[8px] md:text-sm text-gray-600 leading-tight">On orders over Rs. 5,000</p>
              </motion.div>

              {/* Secure Payments */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-lg p-2 md:p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center mb-2 md:mb-3">
                  <div className="bg-green-100 rounded-full p-1.5 md:p-3">
                    <Shield className="w-4 h-4 md:w-8 md:h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-0.5 md:mb-1 text-[10px] md:text-base leading-tight">Secure Payments</h3>
                <p className="text-[8px] md:text-sm text-gray-600 leading-tight">JazzCash, EasyPaisa & more</p>
              </motion.div>

              {/* Easy Returns */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white rounded-lg p-2 md:p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center mb-2 md:mb-3">
                  <div className="bg-green-100 rounded-full p-1.5 md:p-3">
                    <RefreshCw className="w-4 h-4 md:w-8 md:h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-0.5 md:mb-1 text-[10px] md:text-base leading-tight">Easy Returns</h3>
                <p className="text-[8px] md:text-sm text-gray-600 leading-tight">7-day return policy</p>
              </motion.div>

              {/* 24/7 Support */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white rounded-lg p-2 md:p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center mb-2 md:mb-3">
                  <div className="bg-green-100 rounded-full p-1.5 md:p-3">
                    <Headphones className="w-4 h-4 md:w-8 md:h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-0.5 md:mb-1 text-[10px] md:text-base leading-tight">24/7 Support</h3>
                <p className="text-[8px] md:text-sm text-gray-600 leading-tight">Dedicated support team</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Shop by Category Section - Second */}
        {categories.length > 0 && (
          <section className="bg-white py-6 px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4 px-2">Shop by Category</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {categories.slice(0, 4).map((category) => (
                    <Link
                      key={category._id}
                      to={ROUTES.CATEGORY.replace(':slug', category.slug)}
                  className="flex-shrink-0 w-[140px] bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                  <div className="w-full aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {category.image ? (
                        <FirebaseImage
                          src={category.image}
                          alt={category.name}
                        className="w-full h-full object-cover"
                        />
                      ) : (
                      <ShoppingBag className="w-12 h-12 text-gray-400" />
                    )}
                        </div>
                  <p className="text-sm font-medium text-gray-900 text-center line-clamp-2">
                        {category.name}
                  </p>
                    </Link>
                  ))}
            </div>
          </section>
        )}

        {/* Categories with Products - Top 5 Categories */}
        {categories.slice(0, 5).map((category) => {
          const products = categoryProducts[category._id] || [];
          if (products.length === 0) return null;

          return (
            <section key={category._id} className="px-4 py-6">
              {/* Category Header with Image */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-gray-900">{category.name}</h2>
                <Link
                    to={ROUTES.CATEGORY.replace(':slug', category.slug)}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    View more →
                  </Link>
                </div>
                {/* Category Image Banner */}
                {category.image && (
                  <div className="relative w-full h-[150px] md:h-[200px] rounded-lg overflow-hidden mb-4">
                    <Link to={ROUTES.CATEGORY.replace(':slug', category.slug)} className="block h-full">
                      <FirebaseImage
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                </Link>
              </div>
                )}
              </div>
              {/* Products Scroll */}
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="flex-shrink-0 w-[140px] bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}>
                      <div className="relative aspect-square bg-gray-50">
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
                          <span className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {product.discount}% OFF
                          </span>
                        )}
              </div>
                    </Link>
                    <div className="p-2">
                      <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}>
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-xs leading-tight">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="mb-2">
                        <p className="text-xs font-bold text-gray-900">
                          {getProductPrice(product)}
                        </p>
                        {product.compareAtPrice && (
                          <p className="text-[10px] text-gray-500 line-through">
                            Rs. {product.compareAtPrice.toLocaleString()}
                          </p>
                        )}
                </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white text-[10px] font-semibold py-1.5 rounded transition-colors"
                >
                        Add To Cart
                      </button>
                    </div>
              </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </Layout>
  );
};

// Product Card Component
const ProductCard = ({ product, onAddToCart, onToggleWishlist, isInWishlist, getPrice }) => {
  const discount = product.discount || (product.compareAtPrice && product.basePrice 
    ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
    : 0);
  
  const displayPrice = product.basePrice || (product.variants && product.variants.length > 0 
    ? product.variants[0].price 
    : 0);
  const originalPrice = product.compareAtPrice || displayPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}>
        <div className="relative aspect-square bg-gray-50">
          <FirebaseImage
            src={
              (product.images && product.images.length > 0 && product.images[0])
              || product.thumbnail
              || 'https://images8.alphacoders.com/109/1095996.jpg'
            }
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              {discount}% OFF
            </span>
          )}
        </div>
      </Link>

      <div className="p-2">
      <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}>
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-xs leading-tight">
          {product.name}
        </h3>
      </Link>

        <div className="mb-2">
          {discount > 0 && originalPrice > displayPrice ? (
            <>
              <p className="text-xs text-gray-500 line-through">Rs. {originalPrice.toLocaleString()}</p>
              <p className="text-sm font-bold text-gray-900">Rs. {displayPrice.toLocaleString()}</p>
            </>
          ) : (
            <p className="text-sm font-bold text-gray-900">Rs. {displayPrice.toLocaleString()}</p>
          )}
        </div>

        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2 rounded transition-colors"
        >
          Add To Cart
        </button>
      </div>
    </motion.div>
  );
};

export default Home;
