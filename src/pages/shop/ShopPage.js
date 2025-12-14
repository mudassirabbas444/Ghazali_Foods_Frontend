import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid,
  List,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingCart,
  Heart,
  Loader2,
  X,
  ShoppingBag,
  SlidersHorizontal,
  Check,
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
import { Eye } from 'lucide-react';

const ShopPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showSidebar, setShowSidebar] = useState(true);
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('default');
  const [sortOrder, setSortOrder] = useState('asc');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const pageParam = searchParams.get('page');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('');
    }
    if (pageParam) {
      setCurrentPage(parseInt(pageParam) || 1);
    } else {
      setCurrentPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, sortOrder, priceRange, debouncedSearch, selectedOrigins, selectedGrades]);

  // Update URL when search or filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (debouncedSearch) params.append('search', debouncedSearch);
    if (currentPage > 1) params.append('page', currentPage);
    const newURL = `${ROUTES.SHOP}${params.toString() ? `?${params.toString()}` : ''}`;
    if (window.location.pathname + window.location.search !== newURL) {
      navigate(newURL, { replace: true });
    }
  }, [selectedCategory, debouncedSearch, currentPage, navigate]);

  useEffect(() => {
    fetchProducts();
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [selectedCategory, sortBy, sortOrder, priceRange, debouncedSearch, selectedOrigins, selectedGrades, isAuthenticated, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories(true);
      if (response.success) {
        const categoriesData = response.data || response.categories || [];
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
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
        minPrice: priceRange.min || undefined,
        maxPrice: priceRange.max || undefined,
        page: currentPage,
        limit: productsPerPage,
      };

      const response = await productService.getProducts(filters);
      if (response.success) {
        const productsList = response.products || response.data?.products || response.data || [];
        setProducts(productsList);
        
        if (response.pagination) {
          setTotalPages(response.pagination.pages || 1);
          setTotalProducts(response.pagination.total || 0);
        }
      } else {
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
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
    // Use backend isOutOfStock field if available, otherwise calculate
    if (product.isOutOfStock !== undefined) {
      return product.isOutOfStock;
    }
    if (product.variants && product.variants.length > 0) {
      const allOutOfStock = product.variants.every(variant => 
        (variant.stock || 0) <= 0
      );
      return allOutOfStock;
    }
    return (product.stock || 0) <= 0;
  };

  const getProductStock = (product) => {
    if (product.variants && product.variants.length > 0) {
      const totalStock = product.variants.reduce((sum, variant) => sum + (variant.stock || 0), 0);
      return totalStock;
    }
    return product.stock || 0;
  };

  const mainCategories = categories.filter(cat => !cat.parentCategory);
  
  const getSubcategories = (parentId) => {
    return categories.filter(cat => cat.parentCategory && 
      (cat.parentCategory._id?.toString() === parentId?.toString() || 
       cat.parentCategory?.toString() === parentId?.toString()));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (debouncedSearch) params.append('search', debouncedSearch);
    if (newPage > 1) params.append('page', newPage);
    navigate(`${ROUTES.SHOP}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get unique origins and brands from products
  const uniqueOrigins = [...new Set(products.map(p => p.origin).filter(Boolean))];
  const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];

  return (
    <div className="min-h-screen bg-darkGreen-950">
      {/* Hero Banner Section */}
      <div className="relative bg-gradient-to-br from-darkGreen-900 via-darkGreen-950 to-darkGreen-950 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDMuMzE0LTIuNjg2IDYtNiA2cy02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNnoiIGZpbGw9IiNEM0FGMzciLz48L2c+PC9zdmc+')]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-1.5 bg-gold-950/20 border border-gold-950/30 rounded-full text-gold-950 text-sm font-semibold">
              PREMIUM QUALITY
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gold-950 via-gold-600 to-gold-950 bg-clip-text text-transparent">
            Premium Dry Fruits Collection
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
            Hand-selected premium dry fruits, nuts, and gourmet products. Fresh, authentic, and delivered to your doorstep.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-gold-950 transition-colors">Home</Link>
          <span>/</span>
          <Link to={ROUTES.SHOP} className="hover:text-gold-950 transition-colors">Shop</Link>
          {selectedCategory && (
            <>
              <span>/</span>
              <span className="text-gold-950">
                {categories.find(c => c._id === selectedCategory)?.name || 'Premium Selection'}
              </span>
            </>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-darkGreen-900/50 border border-gold-950/30 rounded-lg text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-gold-950 focus:border-gold-950 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold-950 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Top Bar - Product Count & Sort */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="text-gray-300 mb-4 md:mb-0">
            Showing {((currentPage - 1) * productsPerPage) + 1}-{Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} products
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-darkGreen-900 border border-gold-950/30 rounded-lg text-gold-950 hover:bg-darkGreen-800 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-darkGreen-900 border border-gold-950/30 rounded-lg text-gold-950 focus:ring-2 focus:ring-gold-950 focus:border-gold-950"
            >
              <option value="default">Sort by: Featured</option>
              <option value="price">Price: Low to High</option>
              <option value="createdAt">Newest</option>
              <option value="averageRating">Rating</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <aside className={`hidden md:block w-64 flex-shrink-0 ${showSidebar ? 'md:block' : 'md:hidden'}`}>
            <div className="bg-darkGreen-900/50 border border-gold-950/20 rounded-lg p-6 space-y-6 sticky top-4">
              {/* Categories */}
              <div>
                <h3 className="text-gold-950 font-semibold mb-4 text-lg">Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={!selectedCategory}
                      onChange={() => {
                        setSelectedCategory('');
                        setCurrentPage(1);
                        navigate(ROUTES.SHOP);
                      }}
                      className="w-4 h-4 text-gold-950 focus:ring-gold-950 rounded"
                    />
                    <span className="text-gray-300 group-hover:text-gold-950 transition-colors">
                      All Products
                    </span>
                    <span className="ml-auto text-gray-500 text-sm">({totalProducts})</span>
                  </label>
                  {mainCategories.map((category) => {
                    const subcategories = getSubcategories(category._id);
                    const categoryProducts = products.filter(p => 
                      p.category?._id === category._id || p.category === category._id
                    );
                    return (
                      <div key={category._id}>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedCategory === category._id}
                            onChange={() => {
                              setSelectedCategory(category._id);
                              setCurrentPage(1);
                              navigate(`${ROUTES.SHOP}?category=${category._id}&page=1`);
                            }}
                            className="w-4 h-4 text-gold-950 focus:ring-gold-950 rounded"
                          />
                          <span className="text-gray-300 group-hover:text-gold-950 transition-colors">
                            {category.name}
                          </span>
                          <span className="ml-auto text-gray-500 text-sm">({categoryProducts.length})</span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Origin */}
              {uniqueOrigins.length > 0 && (
                <div>
                  <h3 className="text-gold-950 font-semibold mb-4 text-lg">Origin</h3>
                  <div className="space-y-2">
                    {uniqueOrigins.map((origin) => (
                      <label key={origin} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedOrigins.includes(origin)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOrigins([...selectedOrigins, origin]);
                            } else {
                              setSelectedOrigins(selectedOrigins.filter(o => o !== origin));
                            }
                          }}
                          className="w-4 h-4 text-gold-950 focus:ring-gold-950 rounded"
                        />
                        <span className="text-gray-300 group-hover:text-gold-950 transition-colors">
                          {origin}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div>
                <h3 className="text-gold-950 font-semibold mb-4 text-lg">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="w-full px-3 py-2 bg-darkGreen-950 border border-gold-950/30 rounded-lg text-gray-300 focus:ring-2 focus:ring-gold-950 focus:border-gold-950"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="w-full px-3 py-2 bg-darkGreen-950 border border-gold-950/30 rounded-lg text-gray-300 focus:ring-2 focus:ring-gold-950 focus:border-gold-950"
                    />
                  </div>
                </div>
              </div>

              {/* Grade */}
              <div>
                <h3 className="text-gold-950 font-semibold mb-4 text-lg">Grade</h3>
                <div className="flex flex-wrap gap-2">
                  {['Premium', 'Standard', 'Gift Pack'].map((grade) => (
                    <button
                      key={grade}
                      onClick={() => {
                        if (selectedGrades.includes(grade)) {
                          setSelectedGrades(selectedGrades.filter(g => g !== grade));
                        } else {
                          setSelectedGrades([...selectedGrades, grade]);
                        }
                      }}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedGrades.includes(grade)
                          ? 'bg-gold-950 text-darkGreen-950 border-gold-950'
                          : 'bg-darkGreen-950 text-gray-300 border-gold-950/30 hover:border-gold-950'
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Sidebar */}
          {showSidebar && (
            <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowSidebar(false)}>
              <div className="absolute right-0 top-0 bottom-0 w-64 bg-darkGreen-900 border-l border-gold-950/20 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-gold-950 font-bold text-xl">Filters</h2>
                    <button onClick={() => setShowSidebar(false)} className="text-gray-300 hover:text-gold-950">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  {/* Categories */}
                  <div>
                    <h3 className="text-gold-950 font-semibold mb-4 text-lg">Categories</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={!selectedCategory}
                          onChange={() => {
                            setSelectedCategory('');
                            setCurrentPage(1);
                            navigate(ROUTES.SHOP);
                            setShowSidebar(false);
                          }}
                          className="w-4 h-4 text-gold-950 focus:ring-gold-950 rounded"
                        />
                        <span className="text-gray-300 group-hover:text-gold-950 transition-colors">
                          All Products
                        </span>
                      </label>
                      {mainCategories.map((category) => (
                        <label key={category._id} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedCategory === category._id}
                            onChange={() => {
                              setSelectedCategory(category._id);
                              setCurrentPage(1);
                              navigate(`${ROUTES.SHOP}?category=${category._id}&page=1`);
                              setShowSidebar(false);
                            }}
                            className="w-4 h-4 text-gold-950 focus:ring-gold-950 rounded"
                          />
                          <span className="text-gray-300 group-hover:text-gold-950 transition-colors">
                            {category.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Origin */}
                  {uniqueOrigins.length > 0 && (
                    <div>
                      <h3 className="text-gold-950 font-semibold mb-4 text-lg">Origin</h3>
                      <div className="space-y-2">
                        {uniqueOrigins.map((origin) => (
                          <label key={origin} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={selectedOrigins.includes(origin)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedOrigins([...selectedOrigins, origin]);
                                } else {
                                  setSelectedOrigins(selectedOrigins.filter(o => o !== origin));
                                }
                              }}
                              className="w-4 h-4 text-gold-950 focus:ring-gold-950 rounded"
                            />
                            <span className="text-gray-300 group-hover:text-gold-950 transition-colors">
                              {origin}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price Range */}
                  <div>
                    <h3 className="text-gold-950 font-semibold mb-4 text-lg">Price Range</h3>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                          className="w-full px-3 py-2 bg-darkGreen-950 border border-gold-950/30 rounded-lg text-gray-300 focus:ring-2 focus:ring-gold-950 focus:border-gold-950"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                          className="w-full px-3 py-2 bg-darkGreen-950 border border-gold-950/30 rounded-lg text-gray-300 focus:ring-2 focus:ring-gold-950 focus:border-gold-950"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Grade */}
                  <div>
                    <h3 className="text-gold-950 font-semibold mb-4 text-lg">Grade</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Premium', 'Standard', 'Gift Pack'].map((grade) => (
                        <button
                          key={grade}
                          onClick={() => {
                            if (selectedGrades.includes(grade)) {
                              setSelectedGrades(selectedGrades.filter(g => g !== grade));
                            } else {
                              setSelectedGrades([...selectedGrades, grade]);
                            }
                          }}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            selectedGrades.includes(grade)
                              ? 'bg-gold-950 text-darkGreen-950 border-gold-950'
                              : 'bg-darkGreen-950 text-gray-300 border-gold-950/30 hover:border-gold-950'
                          }`}
                        >
                          {grade}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-gold-950" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No products found</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="bg-darkGreen-900/50 border border-gold-950/20 rounded-lg overflow-hidden hover:border-gold-950/50 transition-all duration-300 group"
                    >
                      <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}>
                        <div className="relative aspect-square overflow-hidden bg-darkGreen-950">
                          <FirebaseImage
                            src={
                              (product.images && product.images.length > 0 && product.images[0])
                              || product.thumbnail
                              || 'https://images8.alphacoders.com/109/1095996.jpg'
                            }
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {isProductOutOfStock(product) ? (
                            <span className="absolute top-3 left-3 bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                              Out of Stock
                            </span>
                          ) : product.isBestSeller ? (
                            <span className="absolute top-3 left-3 bg-gold-950 text-darkGreen-950 text-xs font-semibold px-3 py-1.5 rounded-full">
                              BESTSELLER
                            </span>
                          ) : product.isNewArrival ? (
                            <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                              NEW ARRIVAL
                            </span>
                          ) : product.discount > 0 && (
                            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                              -{product.discount}%
                            </span>
                          )}
                          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setQuickViewProduct(product);
                              }}
                              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                              title="Quick View"
                            >
                              <Eye className="w-4 h-4 text-gray-700" />
                            </button>
                            <button
                              onClick={(e) => handleToggleWishlist(product._id, e)}
                              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                              title="Add to Wishlist"
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
                        </div>
                      </Link>

                      <div className="p-4">
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 fill-gold-950 text-gold-950" />
                          ))}
                          <span className="text-xs text-gray-400 ml-1">(128)</span>
                        </div>
                        <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', product.slug)}>
                          <h3 className="font-semibold text-gray-200 mb-1 hover:text-gold-950 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        {product.origin && (
                          <p className="text-xs text-gray-400 mb-2">{product.origin}</p>
                        )}
                        <div className="mb-2">
                          <p className="text-xs text-gray-400">
                            Stock: <span className={`font-semibold ${isProductOutOfStock(product) ? 'text-red-400' : 'text-green-400'}`}>
                              {isProductOutOfStock(product) ? 'Out of Stock' : `${getProductStock(product)} available`}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <p className="text-lg font-bold text-gold-950">
                              {getProductPrice(product)}
                            </p>
                            {product.compareAtPrice && (
                              <p className="text-xs text-gray-500 line-through">
                                Rs. {product.compareAtPrice.toLocaleString()}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={isProductOutOfStock(product)}
                            className={`p-2 rounded-lg transition-colors ${
                              isProductOutOfStock(product)
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-gold-950 text-darkGreen-950 hover:bg-gold-600'
                            }`}
                            title={isProductOutOfStock(product) ? 'Out of Stock' : 'Add to Cart'}
                          >
                            <ShoppingCart className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-col items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border transition-colors ${
                          currentPage === 1
                            ? 'bg-darkGreen-900 text-gray-600 cursor-not-allowed border-gold-950/30'
                            : 'bg-darkGreen-900 text-gold-950 hover:bg-darkGreen-800 border-gold-950/50 hover:border-gold-950'
                        }`}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-4 py-2 rounded-lg border transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-gold-950 text-darkGreen-950 border-gold-950'
                                  : 'bg-darkGreen-900 text-gray-300 border-gold-950/30 hover:border-gold-950'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg border transition-colors ${
                          currentPage === totalPages
                            ? 'bg-darkGreen-900 text-gray-600 cursor-not-allowed border-gold-950/30'
                            : 'bg-darkGreen-900 text-gold-950 hover:bg-darkGreen-800 border-gold-950/50 hover:border-gold-950'
                        }`}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
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
