import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Grid,
  List,
  Loader2,
  ShoppingCart,
  Heart,
} from 'lucide-react';
import productService from '../../services/product';
import categoryService from '../../services/category';
import cartService from '../../services/cart';
import wishlistService from '../../services/wishlist';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { ROUTES } from '../../constants';
import FirebaseImage from '../../components/FirebaseImage';

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  useEffect(() => {
    if (slug) {
      fetchCategory();
    }
  }, [slug]);

  useEffect(() => {
    if (category) {
      fetchProducts();
      if (isAuthenticated) {
        fetchWishlist();
      }
    }
  }, [category, selectedSubCategory, isAuthenticated]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategoryBySlug(slug);
      if (response.success) {
        setCategory(response.category);
        // Fetch subcategories if this is a parent category
        if (!response.category.parentCategory) {
          const categoriesResponse = await categoryService.getCategories(true);
          if (categoriesResponse.success) {
            const subs = categoriesResponse.categories?.filter(
              cat => cat.parentCategory?._id === response.category._id || cat.parentCategory === response.category._id
            ) || [];
            setSubCategories(subs);
          }
        }
      } else {
        navigate(ROUTES.SHOP);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      navigate(ROUTES.SHOP);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const filters = {
        category: category?._id,
        subCategory: selectedSubCategory || undefined,
      };
      const response = await productService.getProducts(filters);
      if (response.success) {
        setProducts(response.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
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
      navigate(ROUTES.LOGIN);
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
      navigate(ROUTES.LOGIN);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold-950" />
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <div className="min-h-screen bg-darkGreen-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-bold text-gold-950 mb-2 md:mb-0">
              {category.name}
            </h1>
            <p className="text-gray-300">
              {category.description || 'Explore our premium selection'}
            </p>
          </div>

          {/* Subcategories */}
          {subCategories.length > 0 && (
            <div className="flex gap-2 mb-6 overflow-x-auto">
              <button
                onClick={() => setSelectedSubCategory('')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  !selectedSubCategory
                    ? 'bg-gold-950 text-darkGreen-950'
                    : 'bg-darkGreen-900/50 text-gray-300 border border-gold-950/30 hover:border-gold-950'
                }`}
              >
                All
              </button>
              {subCategories.map((subCat) => (
                <button
                  key={subCat._id}
                  onClick={() => setSelectedSubCategory(subCat._id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedSubCategory === subCat._id
                      ? 'bg-gold-950 text-darkGreen-950'
                      : 'bg-darkGreen-900/50 text-gray-300 border border-gold-950/30 hover:border-gold-950'
                  }`}
                >
                  {subCat.name}
                </button>
              ))}
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center justify-end gap-2 mb-6">
            <div className="flex items-center border border-gold-950/30 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gold-950 text-darkGreen-950' : 'bg-darkGreen-900/50 text-gray-300'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gold-950 text-darkGreen-950' : 'bg-darkGreen-900/50 text-gray-300'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No products found in this category</p>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {products.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-darkGreen-900/50 border border-gold-950/20 rounded-2xl hover:border-gold-950/50 transition-all duration-300 ${
                  viewMode === 'list' ? 'flex gap-4 p-4' : 'p-4'
                } group`}
              >
                <Link
                  to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}
                  className={viewMode === 'list' ? 'flex-shrink-0' : 'block'}
                >
                  <div className={`relative ${viewMode === 'list' ? 'w-32 h-32' : 'w-full aspect-square'} mb-4 rounded-xl overflow-hidden bg-white/50`}>
                    <FirebaseImage
                      src={
                        (product.images && product.images.length > 0 && product.images[0])
                        || product.thumbnail
                        || 'https://images8.alphacoders.com/109/1095996.jpg'
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isBestSeller ? (
                      <span className="absolute top-3 left-3 bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                        Best Seller
                      </span>
                    ) : product.discount > 0 && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                        -{product.discount}%
                      </span>
                    )}
                    <button
                      onClick={(e) => handleToggleWishlist(product._id, e)}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlistItems.has(product._id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-700'
                        }`}
                      />
                    </button>
                  </div>
                </Link>

                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}>
                    <h3 className="font-semibold text-gray-200 mb-2 line-clamp-2 text-base hover:text-gold-950 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

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
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="p-2 bg-gold-950 text-darkGreen-950 rounded-lg hover:bg-gold-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;

