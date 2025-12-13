import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  Loader2,
  CheckCircle,
  Clock,
  Truck,
  X,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Filter,
} from 'lucide-react';
import adminService from '../../services/admin';
import orderService from '../../services/order';
import { toast } from 'react-toastify';
import { ROUTES } from '../../constants';
import FirebaseImage from '../../components/FirebaseImage';

const AdminOrderDetailPage = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderByNumber(orderNumber);
      if (response.success) {
        const orderData = response.data || response.order;
        setOrder(orderData);
        setStatus(orderData.status);
        setAdminNotes(orderData.adminNotes || '');
      } else {
        toast.error(response.message || 'Order not found');
        navigate(ROUTES.ADMIN_ORDERS);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error(error.message || 'Failed to load order');
      navigate(ROUTES.ADMIN_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      await adminService.updateOrderStatus(order._id, status, adminNotes);
      toast.success('Order status updated successfully');
      setShowStatusModal(false);
      fetchOrder();
    } catch (error) {
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      packed: 'bg-purple-100 text-purple-800',
      'out-for-delivery': 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      returned: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <X className="w-5 h-5" />;
      case 'out-for-delivery':
        return <Truck className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to={ROUTES.ADMIN_ORDERS}
            className="text-gray-600 hover:text-orange-500 mb-4 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600 mt-1">Order #{order.orderNumber}</p>
        </div>
        <button
          onClick={() => setShowStatusModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Update Status
        </button>
      </div>

      {/* Order Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Order #{order.orderNumber}
            </h2>
            <p className="text-sm text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(
              order.status
            )}`}
          >
            {getStatusIcon(order.status)}
            {order.status.replace('_', ' ').replace('-', ' ').toUpperCase()}
          </span>
        </div>

        {/* Customer Info */}
        {order.user && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Customer Information</h3>
            <div className="text-sm text-gray-600">
              <p className="font-medium">{order.user.fullName || order.user.name}</p>
              <p>{order.user.email}</p>
              {order.user.phone && <p>{order.user.phone}</p>}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items?.map((item, idx) => {
              let imageSrc = null;
              
              const isValidUrl = (url) => {
                if (!url || typeof url !== 'string') return false;
                const trimmed = url.trim();
                if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') return false;
                try {
                  const urlObj = new URL(trimmed);
                  return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
                } catch {
                  return false;
                }
              };
              
              if (item.product?.images && Array.isArray(item.product.images) && item.product.images.length > 0) {
                const firstImage = item.product.images[0];
                if (isValidUrl(firstImage)) {
                  imageSrc = firstImage.trim();
                }
              }
              if (!imageSrc && item.product?.thumbnail && isValidUrl(item.product.thumbnail)) {
                imageSrc = item.product.thumbnail.trim();
              }
              if (!imageSrc && item.image && isValidUrl(item.image)) {
                imageSrc = item.image.trim();
              }
              if (!imageSrc) {
                imageSrc = 'https://images8.alphacoders.com/109/1095996.jpg';
              }
              
              return (
                <div key={idx} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <FirebaseImage
                      src={imageSrc}
                      alt={item.productName || 'Product image'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.productName}</h4>
                    {item.variant && (
                      <p className="text-sm text-gray-600">Weight: {item.variant}</p>
                    )}
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      Rs. {item.total?.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Delivery Address
          </h3>
          <div className="text-gray-600">
            <p className="font-semibold">{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.address}</p>
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.area}{' '}
              {order.shippingAddress?.postalCode}
            </p>
            <p className="flex items-center gap-2 mt-2">
              <Phone className="w-4 h-4" />
              {order.shippingAddress?.phone}
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold">Rs. {order.subtotal?.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span className="font-semibold">- Rs. {order.discount?.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Delivery Charges</span>
              <span className="font-semibold">Rs. {order.deliveryCharges?.toLocaleString() || '0'}</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-gray-900">Grand Total</span>
                <span className="text-lg font-bold text-gray-900">
                  Rs. {order.total?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {order.paymentMethod?.replace('_', ' ')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Payment Status</p>
                <p
                  className={`font-semibold capitalize ${
                    order.paymentStatus === 'paid'
                      ? 'text-green-600'
                      : order.paymentStatus === 'failed'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {order.paymentStatus}
                </p>
              </div>
            </div>
          </div>

          {order.trackingNumber && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
              <p className="font-semibold text-gray-900">{order.trackingNumber}</p>
            </div>
          )}

          {order.adminNotes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Admin Notes</p>
              <p className="text-gray-900">{order.adminNotes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowStatusModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-white rounded-lg shadow-xl max-w-md w-full"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Update Order Status</h2>
                <p className="text-sm text-gray-600 mt-1">Order #{order.orderNumber}</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleStatusUpdate();
                }}
                className="p-6 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="packed">Packed</option>
                    <option value="out-for-delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add any notes about this order..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowStatusModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderDetailPage;

