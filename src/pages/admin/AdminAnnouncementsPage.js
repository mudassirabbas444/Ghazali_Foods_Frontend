import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Loader2,
  X,
  Check,
  Calendar,
} from 'lucide-react';
import adminService from '../../services/admin';
import announcementService from '../../services/announcement';
import { toast } from 'react-toastify';

const AdminAnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, [searchQuery]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await announcementService.getAnnouncements();
      if (response.success) {
        let filtered = response.announcements || response.data || [];
        if (searchQuery) {
          filtered = filtered.filter(announcement =>
            announcement.text.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        setAnnouncements(filtered);
      }
    } catch (error) {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (announcementId) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await adminService.deleteAnnouncement(announcementId);
      toast.success('Announcement deleted successfully');
      fetchAnnouncements();
    } catch (error) {
      toast.error(error.message || 'Failed to delete announcement');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-1">Manage header announcements that scroll from right to left</p>
        </div>
        <button
          onClick={() => {
            setEditingAnnouncement(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Announcement
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
            placeholder="Search announcements..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
          />
        </div>
      </div>

      {/* Announcements Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No announcements found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {announcements.map((announcement) => (
              <motion.div
                key={announcement._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className="p-4 text-white"
                  style={{
                    backgroundColor: announcement.backgroundColor || '#22c55e',
                    color: announcement.textColor || '#ffffff',
                  }}
                >
                  <p className="font-semibold mb-2">{announcement.text}</p>
                  {announcement.link && (
                    <p className="text-xs opacity-90">Link: {announcement.link}</p>
                  )}
                </div>

                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className={`px-2 py-1 rounded ${announcement.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {announcement.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {announcement.startDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(announcement.startDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t">
                    <button
                      onClick={() => {
                        setEditingAnnouncement(announcement);
                        setShowModal(true);
                      }}
                      className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Edit className="w-4 h-4 inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(announcement._id)}
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

      {/* Announcement Modal */}
      {showModal && (
        <AnnouncementModal
          announcement={editingAnnouncement}
          onClose={() => {
            setShowModal(false);
            setEditingAnnouncement(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingAnnouncement(null);
            fetchAnnouncements();
          }}
        />
      )}
    </div>
  );
};

// Announcement Modal Component
const AnnouncementModal = ({ announcement, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    text: announcement?.text || '',
    link: announcement?.link || '',
    backgroundColor: announcement?.backgroundColor || '#22c55e',
    textColor: announcement?.textColor || '#ffffff',
    isActive: announcement?.isActive !== undefined ? announcement.isActive : true,
    displayOrder: announcement?.displayOrder || 0,
    startDate: announcement?.startDate
      ? new Date(announcement.startDate).toISOString().split('T')[0]
      : '',
    endDate: announcement?.endDate
      ? new Date(announcement.endDate).toISOString().split('T')[0]
      : '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const announcementData = {
        ...formData,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
      };

      if (announcement) {
        await adminService.updateAnnouncement(announcement._id, announcementData);
        toast.success('Announcement updated successfully');
      } else {
        await adminService.createAnnouncement(announcementData);
        toast.success('Announcement created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Failed to save announcement');
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
              {announcement ? 'Edit Announcement' : 'Add New Announcement'}
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
                Announcement Text *
              </label>
              <input
                type="text"
                required
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="e.g., Free Shipping on Orders Over Rs 2000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link URL (Optional)
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://example.com or /shop"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                    className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.textColor}
                    onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                    className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.textColor}
                    onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                  />
                </div>
              </div>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                />
              </div>
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

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div
                className="p-4 rounded-lg text-white"
                style={{
                  backgroundColor: formData.backgroundColor,
                  color: formData.textColor,
                }}
              >
                {formData.text || 'Preview will appear here...'}
              </div>
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
                    {announcement ? 'Update' : 'Create'} Announcement
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

export default AdminAnnouncementsPage;

