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
        const homeBanners = allBanners.filter(b => b.position === 'home_slider' && b.isActive);
        setBanners(homeBanners);
      }
      if (categoriesRes.success) {
        // Show all categories (main categories only for navigation)
        const allCategories = categoriesRes.data || categoriesRes.categories || [];
        const mainCategories = allCategories.filter(c => !c.parentCategory);
        setCategories(mainCategories);
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
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50">
        {/* Banner Slider */}
        {banners.length > 0 && (
          <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
            {banners.map((banner, index) => (
              <motion.div
                key={banner._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentBannerIndex ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className={`absolute inset-0 ${index === currentBannerIndex ? 'block' : 'hidden'}`}
              >
                {banner.link ? (
                  <Link to={banner.link} className="block h-full">
                    <FirebaseImage
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <div className="text-center text-white px-4">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">{banner.title}</h2>
                        {banner.description && (
                          <p className="text-lg md:text-xl">{banner.description}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="h-full">
                    <FirebaseImage
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <div className="text-center text-white px-4">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">{banner.title}</h2>
                        {banner.description && (
                          <p className="text-lg md:text-xl">{banner.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
            {banners.length > 1 && (
              <>
                <button
                  onClick={prevBanner}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-900" />
                </button>
                <button
                  onClick={nextBanner}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-gray-900" />
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentBannerIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentBannerIndex ? 'bg-white w-8' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {/* Category Navigation */}
        {categories.length > 0 && (
          <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between overflow-x-auto py-4">
                <div className="flex items-center space-x-6 min-w-max">
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      to={ROUTES.CATEGORY.replace(':slug', category.slug)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors whitespace-nowrap group"
                    >
                      {category.image ? (
                        <FirebaseImage
                          src={category.image}
                          alt={category.name}
                          className="w-8 h-8 object-cover rounded-full border-2 border-orange-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                          <ShoppingBag className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                        {category.name}
                      </span>
                    </Link>
                  ))}
                </div>
                <Link
                  to={ROUTES.SHOP}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium whitespace-nowrap ml-4"
                >
                  View All →
                </Link>
              </div>
            </div>
          </section>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
                  <p className="text-gray-600 mt-1">Explore our premium selection</p>
                </div>
                <Link
                  to={ROUTES.SHOP}
                  className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {featuredProducts.slice(0, 10).map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isInWishlist={wishlistItems.has(product._id)}
                    getPrice={getProductPrice}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Best Sellers */}
          {bestSellers.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Best Sellers</h2>
                  <p className="text-gray-600 mt-1">Most popular products</p>
                </div>
                <Link
                  to={ROUTES.SHOP}
                  className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {bestSellers.slice(0, 10).map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isInWishlist={wishlistItems.has(product._id)}
                    getPrice={getProductPrice}
                  />
                ))}
              </div>
            </section>
          )}

          {/* New Arrivals */}
          {newArrivals.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">New Arrivals</h2>
                  <p className="text-gray-600 mt-1">Latest products added to our store</p>
                </div>
                <Link
                  to={ROUTES.SHOP}
                  className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {newArrivals.slice(0, 10).map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isInWishlist={wishlistItems.has(product._id)}
                    getPrice={getProductPrice}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
};

// Product Card Component
const ProductCard = ({ product, onAddToCart, onToggleWishlist, isInWishlist, getPrice }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 group"
    >
      <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}>
        <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-white/50">
          <FirebaseImage
            src={
              (product.images && product.images.length > 0 && product.images[0])
              || product.thumbnail
              || 'https://images8.alphacoders.com/109/1095996.jpg'
            }
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.isBestSeller && (
            <span className="absolute top-3 left-3 bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
              Best Seller
            </span>
          )}
          {product.discount > 0 && !product.isBestSeller && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
              -{product.discount}%
            </span>
          )}
          <button
            onClick={(e) => onToggleWishlist(product._id, e)}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
          >
            <Heart
              className={`w-4 h-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
            />
          </button>
        </div>
      </Link>

      <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-base hover:text-orange-600 transition-colors">
          {product.name}
        </h3>
      </Link>

      <div className="flex items-center justify-between mt-3">
        <div>
          <p className="text-lg font-bold text-gray-900">{getPrice(product)}</p>
          {product.compareAtPrice && (
            <p className="text-sm text-gray-500 line-through">
              Rs. {product.compareAtPrice.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
