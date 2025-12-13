import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  User,
  Eye,
  Loader2,
  ArrowLeft,
  Tag,
  Share2,
} from 'lucide-react';
import blogService from '../../services/blog';
import { ROUTES } from '../../constants';
import FirebaseImage from '../../components/FirebaseImage';
import { toast } from 'react-toastify';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogBySlug(slug);
      if (response.success) {
        setBlog(response.blog);
        // Fetch related blogs
        if (response.blog.category) {
          fetchRelatedBlogs(response.blog.category, response.blog._id);
        }
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Blog not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (category, excludeId) => {
    try {
      const response = await blogService.getBlogs({
        isPublished: true,
        category,
        limit: 3,
      });
      if (response.success) {
        const related = (response.blogs || []).filter(b => b._id !== excludeId).slice(0, 3);
        setRelatedBlogs(related);
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt || blog.title,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-darkGreen-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold-950" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-darkGreen-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Blog not found</p>
          <Link
            to={ROUTES.BLOG}
            className="text-gold-950 hover:text-gold-600 transition-colors"
          >
            ← Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkGreen-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to={ROUTES.BLOG}
          className="inline-flex items-center gap-2 text-gray-300 hover:text-gold-950 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Link>

        {/* Blog Content */}
        <article className="bg-darkGreen-900/50 border border-gold-950/20 rounded-lg overflow-hidden">
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="w-full h-64 md:h-96 overflow-hidden bg-darkGreen-950">
              <FirebaseImage
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Category and Meta */}
            <div className="flex items-center justify-between mb-4">
              {blog.category && (
                <span className="inline-block px-3 py-1 bg-gold-950/20 text-gold-950 text-sm font-semibold rounded-full">
                  {blog.category}
                </span>
              )}
              <button
                onClick={handleShare}
                className="p-2 text-gray-300 hover:text-gold-950 hover:bg-darkGreen-900 rounded-lg transition-colors"
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gold-950 mb-4">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6 pb-6 border-b border-gold-950/20">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {blog.author || 'Admin'}
              </span>
              {blog.publishedAt && (
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}
              {blog.views > 0 && (
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {blog.views} views
                </span>
              )}
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-darkGreen-950 text-gray-300 text-sm rounded-full border border-gold-950/20"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-invert max-w-none text-gray-300"
              dangerouslySetInnerHTML={{ __html: blog.content }}
              style={{
                '--tw-prose-headings': '#E4A11C',
                '--tw-prose-links': '#E4A11C',
                '--tw-prose-bold': '#E4A11C',
              }}
            />
          </div>
        </article>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gold-950 mb-6">Related Blogs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <motion.div
                  key={relatedBlog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-darkGreen-900/50 border border-gold-950/20 rounded-lg overflow-hidden hover:border-gold-950/50 transition-all duration-300 group"
                >
                  <Link to={ROUTES.BLOG_DETAIL.replace(':slug', relatedBlog.slug)}>
                    {relatedBlog.featuredImage && (
                      <div className="h-40 overflow-hidden bg-darkGreen-950">
                        <FirebaseImage
                          src={relatedBlog.featuredImage}
                          alt={relatedBlog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-100 mb-2 line-clamp-2 group-hover:text-gold-950 transition-colors">
                        {relatedBlog.title}
                      </h3>
                      {relatedBlog.excerpt && (
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {relatedBlog.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetailPage;

