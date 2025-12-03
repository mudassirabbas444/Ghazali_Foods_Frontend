import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Tag,
  Loader2,
  X,
  Check,
  Calendar,
  Percent,
  DollarSign,
} from 'lucide-react';
import adminService from '../../services/admin';
import { toast } from 'react-toastify';

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, [searchQuery]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllCoupons();
      if (response.success) {
        let filtered = response.coupons || [];
        if (searchQuery) {
          filtered = filtered.filter(coupon =>
            coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        setCoupons(filtered);
      }
    } catch (error) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await adminService.deleteCoupon(couponId);
      toast.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (error) {
      toast.error(error.message || 'Failed to delete coupon');
    }
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-600 mt-1">Manage discount coupons</p>
        </div>
        <button
          onClick={() => {
            setEditingCoupon(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Coupon
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
            placeholder="Search coupons..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-20">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No coupons found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {coupons.map((coupon) => (
              <motion.div
                key={coupon._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  isExpired(coupon.expiryDate) || !coupon.isActive
                    ? 'border-gray-200 bg-gray-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{coupon.code}</h3>
                      {isExpired(coupon.expiryDate) && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          Expired
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {coupon.discountType === 'percentage' ? (
                        <span className="text-2xl font-bold text-orange-600">
                          {coupon.discountValue}%
                        </span>
                      ) : (
                        <span className="text-2xl font-bold text-orange-600">
                          Rs. {coupon.discountValue}
                        </span>
                      )}
                      <span className="text-sm text-gray-600">off</span>
                    </div>
                    {coupon.minOrderAmount > 0 && (
                      <p className="text-xs text-gray-600">
                        Min order: Rs. {coupon.minOrderAmount.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      coupon.isActive && !isExpired(coupon.expiryDate)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {coupon.isActive && !isExpired(coupon.expiryDate) ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {coupon.expiryDate
                        ? `Expires: ${new Date(coupon.expiryDate).toLocaleDateString()}`
                        : 'No expiry'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>
                      Used: {coupon.usedCount || 0} / {coupon.usageLimit || '∞'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t">
                  <button
                    onClick={() => {
                      setEditingCoupon(coupon);
                      setShowModal(true);
                    }}
                    className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4 inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Coupon Modal */}
      {showModal && (
        <CouponModal
          coupon={editingCoupon}
          onClose={() => {
            setShowModal(false);
            setEditingCoupon(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingCoupon(null);
            fetchCoupons();
          }}
        />
      )}
    </div>
  );
};

// Coupon Modal Component
const CouponModal = ({ coupon, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    code: coupon?.code || '',
    discountType: coupon?.discountType || 'percentage',
    discountValue: coupon?.discountValue || 0,
    minOrderAmount: coupon?.minOrderAmount || 0,
    maxDiscountAmount: coupon?.maxDiscountAmount || 0,
    usageLimit: coupon?.usageLimit || 0,
    expiryDate: coupon?.expiryDate
      ? new Date(coupon.expiryDate).toISOString().split('T')[0]
      : '',
    isActive: coupon?.isActive !== undefined ? coupon.isActive : true,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const couponData = {
        ...formData,
        expiryDate: formData.expiryDate || undefined,
        usageLimit: formData.usageLimit || undefined,
      };

      if (coupon) {
        await adminService.updateCoupon(coupon._id, couponData);
        toast.success('Coupon updated successfully');
      } else {
        await adminService.createCoupon(couponData);
        toast.success('Coupon created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Failed to save coupon');
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
              {coupon ? 'Edit Coupon' : 'Add New Coupon'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="SAVE20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Type *
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Value *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.discountValue}
                  onChange={(e) =>
                    setFormData({ ...formData, discountValue: parseFloat(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Order Amount
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minOrderAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, minOrderAmount: parseFloat(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {formData.discountType === 'percentage' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Discount Amount
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.maxDiscountAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, maxDiscountAmount: parseFloat(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usage Limit
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.usageLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, usageLimit: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="0 = Unlimited"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
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
                    {coupon ? 'Update' : 'Create'} Coupon
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

export default AdminCouponsPage;

