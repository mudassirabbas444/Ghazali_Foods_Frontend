import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Loader2,
  X,
  Calendar,
  Eye,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import adminService from '../../services/admin';
import blogService from '../../services/blog';
import { toast } from 'react-toastify';
import FirebaseImage from '../../components/FirebaseImage';

const AdminBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPublished, setFilterPublished] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const blogsPerPage = 12;

  useEffect(() => {
    fetchBlogs();
  }, [searchQuery, filterPublished, currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const filters = {
        page: currentPage,
        limit: blogsPerPage,
        search: searchQuery || undefined,
        isPublished: filterPublished === 'all' ? undefined : filterPublished === 'published',
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
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      await adminService.deleteBlog(blogId);
      toast.success('Blog deleted successfully');
      fetchBlogs();
    } catch (error) {
      toast.error(error.message || 'Failed to delete blog');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blogs</h1>
          <p className="text-gray-600 mt-1">Manage blog posts and articles</p>
        </div>
        <button
          onClick={() => {
            setEditingBlog(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Blog
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search blogs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
            />
          </div>
          <select
            value={filterPublished}
            onChange={(e) => {
              setFilterPublished(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
          >
            <option value="all">All Blogs</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No blogs found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {blogs.map((blog) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {blog.featuredImage && (
                    <div className="h-48 overflow-hidden bg-gray-100">
                      <FirebaseImage
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{blog.title}</h3>
                    {blog.excerpt && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{blog.excerpt}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className={`px-2 py-1 rounded ${blog.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                      {blog.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(blog.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <span>By {blog.author || 'Admin'}</span>
                      {blog.views > 0 && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {blog.views}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 pt-3 border-t">
                      <button
                        onClick={() => {
                          setEditingBlog(blog);
                          setShowModal(true);
                        }}
                        className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                      >
                        <Edit className="w-4 h-4 inline mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * blogsPerPage) + 1} to {Math.min(currentPage * blogsPerPage, totalBlogs)} of {totalBlogs} blogs
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Blog Modal */}
      {showModal && (
        <BlogModal
          blog={editingBlog}
          onClose={() => {
            setShowModal(false);
            setEditingBlog(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingBlog(null);
            fetchBlogs();
          }}
        />
      )}
    </div>
  );
};

// Blog Modal Component
const BlogModal = ({ blog, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    content: blog?.content || '',
    excerpt: blog?.excerpt || '',
    author: blog?.author || 'Admin',
    category: blog?.category || '',
    tags: blog?.tags || [],
    isPublished: blog?.isPublished !== undefined ? blog.isPublished : false,
    metaTitle: blog?.metaTitle || '',
    metaDescription: blog?.metaDescription || '',
  });
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(blog?.featuredImage || null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (blog) {
      setExistingImage(blog.featuredImage || null);
    }
  }, [blog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const blogData = {
        ...formData,
        tags: formData.tags,
        isPublished: formData.isPublished ? 'true' : 'false', // Explicitly convert to string for FormData
      };

      if (blog) {
        await adminService.updateBlog(blog._id, blogData, image);
        toast.success('Blog updated successfully');
      } else {
        await adminService.createBlog(blogData, image);
        toast.success('Blog created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Failed to save blog');
    } finally {
      setSubmitting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setExistingImage(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-900">
              {blog ? 'Edit Blog' : 'Add New Blog'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Blog post title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt (Short Description)
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief description for blog listing"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Blog content (supports HTML)"
                rows="12"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">You can use HTML tags for formatting</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Health, Recipes, News"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tag and press Enter"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-orange-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              <div className="flex gap-4">
                {existingImage && !image && (
                  <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                    <FirebaseImage
                      src={existingImage}
                      alt="Featured"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {image && (
                  <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer">
                    <ImageIcon className="w-4 h-4" />
                    {image || existingImage ? 'Change Image' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Meta Title
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="SEO title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Meta Description
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="SEO description"
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4 text-orange-500 focus:ring-orange-500 rounded"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                Publish this blog
              </label>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Saving...' : blog ? 'Update Blog' : 'Create Blog'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminBlogsPage;

