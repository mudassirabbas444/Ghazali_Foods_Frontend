import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Loader2,
  X,
  ChevronRight,
} from 'lucide-react';
import categoryService from '../../services/category';
import productService from '../../services/product';
import { ROUTES } from '../../constants';
import FirebaseImage from '../../components/FirebaseImage';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, featuredRes, bestSellersRes, newArrivalsRes] = await Promise.all([
        categoryService.getCategories(true),
        productService.getFeaturedProducts(),
        productService.getBestSellers(),
        productService.getNewArrivals(),
      ]);

      if (categoriesRes.success) {
        const allCategories = categoriesRes.data || categoriesRes.categories || [];
        // Filter to show only main categories (no parent) or organize by parent
        const mainCategories = allCategories.filter(c => !c.parentCategory);
        setCategories(mainCategories);
      }

      if (featuredRes.success) {
        setFeaturedProducts(featuredRes.products?.slice(0, 1) || []);
      }

      if (bestSellersRes.success) {
        setBestSellers(bestSellersRes.products?.slice(0, 1) || []);
      }

      if (newArrivalsRes.success) {
        setNewArrivals(newArrivalsRes.products?.slice(0, 1) || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-darkGreen-950">
        <Loader2 className="w-8 h-8 animate-spin text-gold-950" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkGreen-950">
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-darkGreen-950 border-b border-gold-950/20 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gold-950">Categories</h2>
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-darkGreen-900 transition-colors"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        <div className="px-4 py-4 space-y-6">
          {/* Categories Section */}
          {categories.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gold-950">
                  {categories[0]?.name || 'All Categories'}
                </h3>
                <Link
                  to={ROUTES.SHOP}
                  className="text-sm text-gray-300 hover:text-gold-950 transition-colors"
                >
                  View more
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {categories.slice(0, 18).map((category) => (
                  <Link
                    key={category._id}
                    to={ROUTES.CATEGORY.replace(':slug', category.slug)}
                    className="flex flex-col items-center"
                  >
                    <motion.div
                      className="w-full aspect-square bg-darkGreen-900/50 border border-gold-950/20 rounded-lg overflow-hidden mb-2"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {category.image ? (
                        <FirebaseImage
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-950/20 to-gold-600/20">
                          <span className="text-2xl font-bold text-gold-950">
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </motion.div>
                    <span className="text-xs text-center text-gray-300 font-medium leading-tight">
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* New Products Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gold-950">NAYE NAYE PRODUCTS</h3>
              <Link
                to={ROUTES.SHOP}
                className="text-sm text-gray-300 hover:text-gold-950 transition-colors"
              >
                View more
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {/* Featured Products */}
              <Link
                to={`${ROUTES.SHOP}?featured=true`}
                className="flex flex-col items-center"
              >
                <motion.div
                  className="w-full aspect-square bg-darkGreen-900/50 border border-gold-950/20 rounded-lg overflow-hidden mb-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {featuredProducts[0] ? (
                    <FirebaseImage
                      src={
                        (featuredProducts[0].images && featuredProducts[0].images.length > 0 && featuredProducts[0].images[0])
                        || featuredProducts[0].thumbnail
                        || 'https://images8.alphacoders.com/109/1095996.jpg'
                      }
                      alt="Featured Products"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-950/20 to-gold-600/20">
                      <span className="text-2xl">⭐</span>
                    </div>
                  )}
                </motion.div>
                <span className="text-xs text-center text-gray-300 font-medium">
                  Featured Products
                </span>
              </Link>

              {/* Hot Products (Best Sellers) */}
              <Link
                to={`${ROUTES.SHOP}?bestsellers=true`}
                className="flex flex-col items-center"
              >
                <motion.div
                  className="w-full aspect-square bg-darkGreen-900/50 border border-gold-950/20 rounded-lg overflow-hidden mb-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {bestSellers[0] ? (
                    <FirebaseImage
                      src={
                        (bestSellers[0].images && bestSellers[0].images.length > 0 && bestSellers[0].images[0])
                        || bestSellers[0].thumbnail
                        || 'https://images8.alphacoders.com/109/1095996.jpg'
                      }
                      alt="Hot Products"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-950/20 to-gold-600/20">
                      <span className="text-2xl">🔥</span>
                    </div>
                  )}
                </motion.div>
                <span className="text-xs text-center text-gray-300 font-medium">
                  Hot Products
                </span>
              </Link>

              {/* Trending Products (New Arrivals) */}
              <Link
                to={`${ROUTES.SHOP}?new=true`}
                className="flex flex-col items-center"
              >
                <motion.div
                  className="w-full aspect-square bg-darkGreen-900/50 border border-gold-950/20 rounded-lg overflow-hidden mb-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {newArrivals[0] ? (
                    <FirebaseImage
                      src={
                        (newArrivals[0].images && newArrivals[0].images.length > 0 && newArrivals[0].images[0])
                        || newArrivals[0].thumbnail
                        || 'https://images8.alphacoders.com/109/1095996.jpg'
                      }
                      alt="Trending Products"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-950/20 to-gold-600/20">
                      <span className="text-2xl">📈</span>
                    </div>
                  )}
                </motion.div>
                <span className="text-xs text-center text-gray-300 font-medium">
                  Trending Products
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gold-950 mb-2">All Categories</h1>
          <p className="text-gray-300">Browse our complete collection of products</p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gold-950">Shop by Category</h2>
              <Link
                to={ROUTES.SHOP}
                className="text-gold-950 hover:text-gold-600 font-medium flex items-center gap-1 transition-colors"
              >
                View all
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={ROUTES.CATEGORY.replace(':slug', category.slug)}
                  className="group"
                >
                  <motion.div
                    className="bg-darkGreen-900/50 border border-gold-950/20 rounded-xl hover:border-gold-950/50 transition-all duration-300 p-4"
                    whileHover={{ y: -4 }}
                  >
                    <div className="aspect-square bg-darkGreen-950 rounded-lg overflow-hidden mb-3">
                      {category.image ? (
                        <FirebaseImage
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-950/20 to-gold-600/20">
                          <span className="text-4xl font-bold text-gold-950">
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-200 text-center group-hover:text-gold-950 transition-colors">
                      {category.name}
                    </h3>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* New Products Section - Desktop */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gold-950">New & Featured Products</h2>
            <Link
              to={ROUTES.SHOP}
              className="text-gold-950 hover:text-gold-600 font-medium flex items-center gap-1 transition-colors"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Featured Products */}
            <Link
              to={`${ROUTES.SHOP}?featured=true`}
              className="group"
            >
              <motion.div
                className="bg-darkGreen-900/50 border border-gold-950/20 rounded-xl hover:border-gold-950/50 transition-all duration-300 p-6"
                whileHover={{ y: -4 }}
              >
                <div className="aspect-square bg-darkGreen-950 rounded-lg overflow-hidden mb-4">
                  {featuredProducts[0] ? (
                    <FirebaseImage
                      src={
                        (featuredProducts[0].images && featuredProducts[0].images.length > 0 && featuredProducts[0].images[0])
                        || featuredProducts[0].thumbnail
                        || 'https://images8.alphacoders.com/109/1095996.jpg'
                      }
                      alt="Featured Products"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">⭐</span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gold-950 text-center group-hover:text-gold-600 transition-colors">
                  Featured Products
                </h3>
                <p className="text-sm text-gray-300 text-center mt-2">
                  Handpicked favorites
                </p>
              </motion.div>
            </Link>

            {/* Hot Products (Best Sellers) */}
            <Link
              to={`${ROUTES.SHOP}?bestsellers=true`}
              className="group"
            >
              <motion.div
                className="bg-darkGreen-900/50 border border-gold-950/20 rounded-xl hover:border-gold-950/50 transition-all duration-300 p-6"
                whileHover={{ y: -4 }}
              >
                <div className="aspect-square bg-darkGreen-950 rounded-lg overflow-hidden mb-4">
                  {bestSellers[0] ? (
                    <FirebaseImage
                      src={
                        (bestSellers[0].images && bestSellers[0].images.length > 0 && bestSellers[0].images[0])
                        || bestSellers[0].thumbnail
                        || 'https://images8.alphacoders.com/109/1095996.jpg'
                      }
                      alt="Hot Products"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">🔥</span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gold-950 text-center group-hover:text-gold-600 transition-colors">
                  Hot Products
                </h3>
                <p className="text-sm text-gray-300 text-center mt-2">
                  Best sellers
                </p>
              </motion.div>
            </Link>

            {/* Trending Products (New Arrivals) */}
            <Link
              to={`${ROUTES.SHOP}?new=true`}
              className="group"
            >
              <motion.div
                className="bg-darkGreen-900/50 border border-gold-950/20 rounded-xl hover:border-gold-950/50 transition-all duration-300 p-6"
                whileHover={{ y: -4 }}
              >
                <div className="aspect-square bg-darkGreen-950 rounded-lg overflow-hidden mb-4">
                  {newArrivals[0] ? (
                    <FirebaseImage
                      src={
                        (newArrivals[0].images && newArrivals[0].images.length > 0 && newArrivals[0].images[0])
                        || newArrivals[0].thumbnail
                        || 'https://images8.alphacoders.com/109/1095996.jpg'
                      }
                      alt="Trending Products"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">📈</span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gold-950 text-center group-hover:text-gold-600 transition-colors">
                  Trending Products
                </h3>
                <p className="text-sm text-gray-300 text-center mt-2">
                  New arrivals
                </p>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;

