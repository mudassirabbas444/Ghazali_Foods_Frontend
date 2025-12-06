import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid,
  List,
  ChevronDown,
  Star,
  ShoppingCart,
  Heart,
  Loader2,
  X,
  ShoppingBag,
} from 'lucide-react';
import productService from '../../services/product';
import categoryService from '../../services/category';
import cartService from '../../services/cart';
import wishlistService from '../../services/wishlist';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { ROUTES } from '../../constants';
import FirebaseImage from '../../components/FirebaseImage';
import QuickView from '../../components/product/QuickView';
import AdvancedFilters from '../../components/filters/AdvancedFilters';
import { Eye } from 'lucide-react';

const ShopPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('default');
  const [sortOrder, setSortOrder] = useState('asc');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Debounce search query for real-time search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Update selected category from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('');
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [selectedCategory, sortBy, sortOrder, priceRange, debouncedSearch, advancedFilters, isAuthenticated]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories(true);
      if (response.success) {
        // Backend returns data in response.data
        const categoriesData = response.data || response.categories || [];
        // Show all categories, not just main ones
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Map sortBy to backend format
      let backendSortBy = 'default';
      if (sortBy === 'price' && sortOrder === 'asc') {
        backendSortBy = 'price_low';
      } else if (sortBy === 'price' && sortOrder === 'desc') {
        backendSortBy = 'price_high';
      } else if (sortBy === 'createdAt') {
        backendSortBy = 'newest';
      } else if (sortBy === 'averageRating') {
        backendSortBy = 'popularity';
      }
      
      const filters = {
        category: selectedCategory || undefined,
        search: debouncedSearch || undefined,
        sortBy: backendSortBy,
        minPrice: advancedFilters.minPrice || priceRange.min || undefined,
        maxPrice: advancedFilters.maxPrice || priceRange.max || undefined,
        page: 1,
        limit: 1000, // Show all products
      };

      // Add advanced filter categories if selected (support multiple categories)
      if (advancedFilters.categories && advancedFilters.categories.length > 0) {
        filters.categories = advancedFilters.categories; // Support multiple categories
        // Don't override category if advanced filter has categories
        delete filters.category;
      }

      // Add other advanced filters
      if (advancedFilters.brands && advancedFilters.brands.length > 0) {
        filters.brands = advancedFilters.brands;
      }
      if (advancedFilters.inStock) {
        filters.inStock = true;
      }
      if (advancedFilters.onSale) {
        filters.onSale = true;
      }
      if (advancedFilters.rating && advancedFilters.rating > 0) {
        filters.minRating = advancedFilters.rating;
      }

      const response = await productService.getProducts(filters);
      if (response.success) {
        // Backend returns products in response.products
        const productsList = response.products || response.data?.products || response.data || [];
        setProducts(productsList);
      } else {
        console.error('Failed to fetch products:', response.message);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await wishlistService.getWishlist();
      if (response.success) {
        // Backend returns wishlist in response.data
        const wishlistData = response.data || response.wishlist;
        const productIds = new Set(
          wishlistData?.products?.map(product => product?._id || product) || []
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

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by debouncedSearch useEffect
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

  const isProductOutOfStock = (product) => {
    // Check if product has variants
    if (product.variants && product.variants.length > 0) {
      // Check if all variants are out of stock
      const allOutOfStock = product.variants.every(variant => 
        (variant.stock || 0) <= 0
      );
      return allOutOfStock;
    }
    // Check base stock
    return (product.stock || 0) <= 0;
  };

  const mainCategories = categories.filter(cat => !cat.parentCategory);
  
  const getSubcategories = (parentId) => {
    return categories.filter(cat => cat.parentCategory && 
      (cat.parentCategory._id?.toString() === parentId?.toString() || 
       cat.parentCategory?.toString() === parentId?.toString()));
  };

  const handleCategoryClick = (categoryId, e) => {
    e?.stopPropagation();
    const subcategories = getSubcategories(categoryId);
    if (subcategories.length > 0) {
      if (expandedCategory === categoryId) {
        setExpandedCategory(null);
      } else {
        setExpandedCategory(categoryId);
      }
    } else {
      setSelectedCategory(categoryId);
      setExpandedCategory(null);
      navigate(`${ROUTES.SHOP}?category=${categoryId}`);
    }
  };

  const handleSubcategoryClick = (subcategoryId, e) => {
    e?.stopPropagation();
    setSelectedCategory(subcategoryId);
    setExpandedCategory(null);
    navigate(`${ROUTES.SHOP}?category=${subcategoryId}`);
  };

  // Close expanded category when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expandedCategory && !event.target.closest('.category-item')) {
        setExpandedCategory(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [expandedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50" style={{ overflow: 'visible' }}>
      {/* Categories Section - Simple List Design */}
      {mainCategories.length > 0 && (
        <section className="bg-white border-b border-gray-200 sticky top-0 z-[100]" style={{ overflow: 'visible', position: 'sticky', isolation: 'auto' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ overflow: 'visible' }}>
            <div className="flex items-center justify-between py-4" style={{ overflowX: 'auto', overflowY: 'visible', overflow: 'visible' }}>
              <div className="flex items-center space-x-6 min-w-max relative" style={{ position: 'relative', zIndex: 10001 }}>
                {/* All Products */}
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setExpandedCategory(null);
                    navigate(ROUTES.SHOP);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap group ${
                    !selectedCategory
                      ? 'bg-orange-500 text-white'
                      : 'hover:bg-orange-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    !selectedCategory ? 'bg-white/20' : 'bg-orange-50'
                  }`}>
                    <ShoppingBag className={`w-4 h-4 ${!selectedCategory ? 'text-white' : 'text-orange-500'}`} />
                  </div>
                  <span className={`text-sm font-medium ${
                    !selectedCategory ? 'text-white' : 'text-gray-700 group-hover:text-orange-600'
                  }`}>
                    All Products
                  </span>
                </button>

                {/* Main Categories */}
                {mainCategories.map((category) => {
                  const subcategories = getSubcategories(category._id);
                  const hasSubcategories = subcategories.length > 0;
                  const isExpanded = expandedCategory === category._id;
                  const isSelected = selectedCategory === category._id;

                  return (
                    <div 
                      key={category._id} 
                      className="relative category-item"
                      style={{ 
                        zIndex: isExpanded ? 10002 : 'auto',
                        position: 'relative'
                      }}
                    >
                      <button
                        onClick={(e) => handleCategoryClick(category._id, e)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap group relative ${
                          isSelected
                            ? 'bg-orange-500 text-white'
                            : 'hover:bg-orange-50'
                        }`}
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
                        <span className={`text-sm font-medium ${
                          isSelected ? 'text-white' : 'text-gray-700 group-hover:text-orange-600'
                        }`}>
                          {category.name}
                        </span>
                        {hasSubcategories && (
                          <ChevronDown className={`w-4 h-4 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          } ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                        )}
                      </button>

                      {/* Subcategories Dropdown */}
                      {hasSubcategories && isExpanded && (
                        <div 
                          className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-2xl border border-gray-200 min-w-[200px] max-w-[250px] py-2"
                          style={{ 
                            zIndex: 10003,
                            position: 'absolute',
                            marginTop: '4px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            overflow: 'visible'
                          }}
                        >
                          {subcategories.map((subcategory) => (
                            <button
                              key={subcategory._id}
                              onClick={(e) => handleSubcategoryClick(subcategory._id, e)}
                              className={`w-full flex items-center space-x-2 px-4 py-2 hover:bg-orange-50 transition-colors whitespace-nowrap text-left ${
                                selectedCategory === subcategory._id ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700'
                              }`}
                            >
                              {subcategory.image ? (
                                <FirebaseImage
                                  src={subcategory.image}
                                  alt={subcategory.name}
                                  className="w-6 h-6 object-cover rounded-full border border-orange-200 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                  <ShoppingBag className="w-3 h-3 text-orange-500" />
                                </div>
                              )}
                              <span className="text-sm truncate">{subcategory.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative" style={{ zIndex: 1, overflow: 'visible' }}>
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 md:mb-0">
              {selectedCategory 
                ? categories.find(c => c._id === selectedCategory)?.name || 'Shop'
                : 'Shop'
              }
            </h1>
            <p className="text-gray-600">
              {selectedCategory ? 'Explore our premium selection' : 'Discover amazing products'}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products... (real-time search)"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <AdvancedFilters
                filters={advancedFilters}
                onFilterChange={setAdvancedFilters}
                categories={categories}
                brands={[...new Set(products.map(p => p.brand).filter(Boolean))]}
              />
              
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="default">Default</option>
                    <option value="price">Price</option>
                    <option value="createdAt">Newest</option>
                    <option value="averageRating">Rating</option>
                  </select>
                </div>
                
                {sortBy === 'price' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="asc">Low to High</option>
                      <option value="desc">High to Low</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6'
                : 'space-y-4'
            }
          >
            {products.map((product) => (
              <div
                key={product._id}
                className={`bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ${
                  viewMode === 'list' ? 'flex gap-4 p-4' : 'p-2 md:p-4'
                } group`}
              >
                <Link
                  to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}
                  className={viewMode === 'list' ? 'flex-shrink-0' : 'block'}
                >
                  <div className={`relative ${viewMode === 'list' ? 'w-32 h-32' : 'w-full aspect-square'} mb-2 md:mb-4 rounded-lg md:rounded-xl overflow-hidden bg-white/50`}>
                    <FirebaseImage
                      src={
                        (product.images && product.images.length > 0 && product.images[0])
                        || product.thumbnail
                        || 'https://images8.alphacoders.com/109/1095996.jpg'
                      }
                      alt={product.name}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${isProductOutOfStock(product) ? 'opacity-60' : ''}`}
                    />
                    {isProductOutOfStock(product) ? (
                      <span className="absolute top-1 left-1 md:top-3 md:left-3 bg-gray-800 text-white text-[10px] md:text-xs font-semibold px-1.5 md:px-3 py-0.5 md:py-1.5 rounded md:rounded-lg z-10">
                        Out of Stock
                      </span>
                    ) : product.isBestSeller ? (
                      <span className="absolute top-1 left-1 md:top-3 md:left-3 bg-gray-800 text-white text-[10px] md:text-xs font-semibold px-1.5 md:px-3 py-0.5 md:py-1.5 rounded md:rounded-lg">
                        Best Seller
                      </span>
                    ) : product.discount > 0 && (
                      <span className="absolute top-1 left-1 md:top-3 md:left-3 bg-red-500 text-white text-[10px] md:text-xs font-semibold px-1.5 md:px-3 py-0.5 md:py-1.5 rounded md:rounded-lg">
                        -{product.discount}%
                      </span>
                    )}
                    <div className="absolute top-1 right-1 md:top-3 md:right-3 flex flex-col gap-1 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setQuickViewProduct(product);
                        }}
                        className="p-1 md:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                        title="Quick View"
                      >
                        <Eye className="w-3 h-3 md:w-4 md:h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={(e) => handleToggleWishlist(product._id, e)}
                        className="p-1 md:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                        title="Add to Wishlist"
                      >
                        <Heart
                          className={`w-3 h-3 md:w-4 md:h-4 ${
                            wishlistItems.has(product._id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-700'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </Link>

                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}>
                    <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 line-clamp-2 text-xs md:text-base hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between mt-1 md:mt-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm md:text-lg font-bold text-gray-900 truncate">
                        {getProductPrice(product)}
                      </p>
                      {product.compareAtPrice && (
                        <p className="text-xs md:text-sm text-gray-500 line-through">
                          Rs. {product.compareAtPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isProductOutOfStock(product)}
                      className={`p-1.5 md:p-2 rounded-lg transition-colors flex-shrink-0 ${
                        isProductOutOfStock(product)
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                          : 'bg-orange-500 text-white hover:bg-orange-600 opacity-100'
                      }`}
                      title={isProductOutOfStock(product) ? 'Out of Stock' : 'Add to Cart'}
                    >
                      <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};

export default ShopPage;

