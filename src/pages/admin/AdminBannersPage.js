import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Image as ImageIcon,
  Loader2,
  X,
  Check,
  Calendar,
} from 'lucide-react';
import adminService from '../../services/admin';
import bannerService from '../../services/banner';
import { toast } from 'react-toastify';
import FirebaseImage from '../../components/FirebaseImage';

const AdminBannersPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBanners();
  }, [searchQuery]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannerService.getBanners();
      if (response.success) {
        let filtered = response.banners || response.data || [];
        if (searchQuery) {
          filtered = filtered.filter(banner =>
            banner.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        setBanners(filtered);
      }
    } catch (error) {
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      await adminService.deleteBanner(bannerId);
      toast.success('Banner deleted successfully');
      fetchBanners();
    } catch (error) {
      toast.error(error.message || 'Failed to delete banner');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banners</h1>
          <p className="text-gray-600 mt-1">Manage homepage and promotional banners</p>
        </div>
        <button
          onClick={() => {
            setEditingBanner(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Banner
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search banners..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Banners Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No banners found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {banners.map((banner) => (
              <motion.div
                key={banner._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 bg-gray-100">
                  <FirebaseImage
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        banner.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{banner.title}</h3>
                  {banner.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{banner.description}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="capitalize">{banner.position?.replace('_', ' ')}</span>
                    {banner.expiryDate && (
                      <span>
                        Expires: {new Date(banner.expiryDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t">
                    <button
                      onClick={() => {
                        setEditingBanner(banner);
                        setShowModal(true);
                      }}
                      className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Edit className="w-4 h-4 inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Banner Modal */}
      {showModal && (
        <BannerModal
          banner={editingBanner}
          onClose={() => {
            setShowModal(false);
            setEditingBanner(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingBanner(null);
            fetchBanners();
          }}
        />
      )}
    </div>
  );
};

// Banner Modal Component
const BannerModal = ({ banner, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: banner?.title || '',
    description: banner?.description || '',
    link: banner?.link || '',
    position: banner?.position || 'home_slider',
    isActive: banner?.isActive !== undefined ? banner.isActive : true,
    displayOrder: banner?.displayOrder || 0,
    startDate: banner?.startDate
      ? new Date(banner.startDate).toISOString().split('T')[0]
      : '',
    endDate: banner?.endDate
      ? new Date(banner.endDate).toISOString().split('T')[0]
      : '',
  });
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(banner?.image || null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const bannerData = {
        ...formData,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
      };

      if (banner) {
        await adminService.updateBanner(banner._id, bannerData, image);
        toast.success('Banner updated successfully');
      } else {
        await adminService.createBanner(bannerData, image);
        toast.success('Banner created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Failed to save banner');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-900">
              {banner ? 'Edit Banner' : 'Add New Banner'}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="home_slider">Home Slider</option>
                  <option value="home_banner">Home Banner</option>
                  <option value="category_banner">Category Banner</option>
                  <option value="sidebar">Sidebar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, displayOrder: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link URL
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Image *
              </label>
              {existingImage && (
                <div className="mb-3">
                  <FirebaseImage
                    src={existingImage}
                    alt="Banner"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                required={!existingImage}
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {banner ? 'Update' : 'Create'} Banner
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminBannersPage;

