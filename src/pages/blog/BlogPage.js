import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Calendar,
  User,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Tag,
} from 'lucide-react';
import blogService from '../../services/blog';
import { ROUTES } from '../../constants';
import FirebaseImage from '../../components/FirebaseImage';

const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [categories, setCategories] = useState([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const blogsPerPage = 9;

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, searchQuery, selectedCategory]);

  useEffect(() => {
    // Extract unique categories from blogs
    const uniqueCategories = [...new Set(blogs.map(blog => blog.category).filter(Boolean))];
    setCategories(uniqueCategories);
  }, [blogs]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const filters = {
        isPublished: true,
        page: currentPage,
        limit: blogsPerPage,
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
      };
      
      const response = await blogService.getBlogs(filters);
      if (response.success) {
        setBlogs(response.blogs || []);
        if (response.pagination) {
          setTotalPages(response.pagination.pages || 1);
          setTotalBlogs(response.pagination.total || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchParams({ search: searchQuery, page: 1 });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setCurrentPage(1);
    setSearchParams({ category: category === selectedCategory ? '' : category, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedCategory) params.append('category', selectedCategory);
    if (newPage > 1) params.append('page', newPage);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-darkGreen-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold-950 mb-4">Blog</h1>
          <p className="text-gray-300">Read our latest articles and updates</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blogs..."
              className="w-full pl-12 pr-4 py-3 bg-darkGreen-900/50 border border-gold-950/30 rounded-lg text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-gold-950 focus:border-gold-950 outline-none"
            />
          </form>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  !selectedCategory
                    ? 'bg-gold-950 text-darkGreen-950 border-gold-950'
                    : 'bg-darkGreen-900/50 text-gray-300 border-gold-950/30 hover:border-gold-950'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedCategory === category
                      ? 'bg-gold-950 text-darkGreen-950 border-gold-950'
                      : 'bg-darkGreen-900/50 text-gray-300 border-gold-950/30 hover:border-gold-950'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Blogs Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold-950" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No blogs found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {blogs.map((blog) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-darkGreen-900/50 border border-gold-950/20 rounded-lg overflow-hidden hover:border-gold-950/50 transition-all duration-300 group"
                >
                  <Link to={ROUTES.BLOG_DETAIL.replace(':slug', blog.slug)}>
                    {blog.featuredImage && (
                      <div className="h-48 overflow-hidden bg-darkGreen-950">
                        <FirebaseImage
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {blog.category && (
                        <span className="inline-block px-3 py-1 bg-gold-950/20 text-gold-950 text-xs font-semibold rounded-full mb-3">
                          {blog.category}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-gray-100 mb-2 line-clamp-2 group-hover:text-gold-950 transition-colors">
                        {blog.title}
                      </h3>
                      {blog.excerpt && (
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                          {blog.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gold-950/20">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {blog.author || 'Admin'}
                          </span>
                          {blog.publishedAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(blog.publishedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {blog.views > 0 && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {blog.views}
                          </span>
                        )}
                      </div>
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {blog.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-darkGreen-950 text-gray-400 text-xs rounded"
                            >
                              <Tag className="w-2 h-2" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-gray-300 text-sm">
                  Showing {((currentPage - 1) * blogsPerPage) + 1} to {Math.min(currentPage * blogsPerPage, totalBlogs)} of {totalBlogs} blogs
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 bg-darkGreen-900/50 border border-gold-950/30 rounded-lg text-gold-950 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-darkGreen-900 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-gray-300 text-sm px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-darkGreen-900/50 border border-gold-950/30 rounded-lg text-gold-950 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-darkGreen-900 transition-colors"
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
  );
};

export default BlogPage;

