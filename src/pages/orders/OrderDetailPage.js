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
} from 'lucide-react';
import orderService from '../../services/order';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { ROUTES } from '../../constants';
import FirebaseImage from '../../components/FirebaseImage';

const OrderDetailPage = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    fetchOrder();
  }, [orderNumber, isAuthenticated]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderByNumber(orderNumber);
      if (response.success) {
        // Backend returns order in response.data
        setOrder(response.data || response.order);
      } else {
        toast.error(response.message || 'Order not found');
        navigate(ROUTES.ORDERS);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error(error.message || 'Failed to load order');
      navigate(ROUTES.ORDERS);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await orderService.cancelOrder(order._id, 'Cancelled by user');
      toast.success('Order cancelled successfully');
      fetchOrder();
    } catch (error) {
      toast.error(error.message || 'Failed to cancel order');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-green-100 text-green-800',
      packed: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-indigo-100 text-indigo-800',
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
      case 'out_for_delivery':
        return <Truck className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold-950" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-darkGreen-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to={ROUTES.ORDERS}
          className="text-gray-300 hover:text-gold-950 mb-6 inline-block"
        >
          ← Back to Orders
        </Link>

        <div className="bg-darkGreen-900/50 border border-gold-950/20 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gold-950 mb-2">
                Order #{order.orderNumber}
              </h1>
              <p className="text-sm text-gray-300">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusIcon(order.status)}
              {order.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {order.status === 'pending' && (
            <button
              onClick={handleCancelOrder}
              className="px-4 py-2 border border-red-400 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              Cancel Order
            </button>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-darkGreen-900/50 border border-gold-950/20 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gold-950 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items?.map((item, idx) => {
              // Get image source with proper fallback
              let imageSrc = null;
              
              // Helper function to validate URL
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
              
              // Priority 1: product.images[0] (from populated product - most reliable)
              if (item.product?.images && Array.isArray(item.product.images) && item.product.images.length > 0) {
                const firstImage = item.product.images[0];
                if (isValidUrl(firstImage)) {
                  imageSrc = firstImage.trim();
                }
              }
              // Priority 2: product.thumbnail
              if (!imageSrc && item.product?.thumbnail && isValidUrl(item.product.thumbnail)) {
                imageSrc = item.product.thumbnail.trim();
              }
              // Priority 3: item.image (stored when order was created - may be outdated)
              if (!imageSrc && item.image && isValidUrl(item.image)) {
                imageSrc = item.image.trim();
              }
              // Priority 4: fallback
              if (!imageSrc) {
                imageSrc = 'https://images8.alphacoders.com/109/1095996.jpg';
              }
              
              return (
                <div key={idx} className="flex gap-4 pb-4 border-b border-gold-950/20 last:border-0">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-darkGreen-950 flex-shrink-0">
                    <FirebaseImage
                      src={imageSrc}
                      alt={item.productName || 'Product image'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-200">{item.productName}</h3>
                  {item.variant && (
                    <p className="text-sm text-gray-400">Weight: {item.variant}</p>
                  )}
                  <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                  <p className="text-sm font-semibold text-gold-950 mt-1">
                    Rs. {item.total?.toLocaleString()}
                  </p>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-darkGreen-900/50 border border-gold-950/20 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gold-950 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Delivery Address
          </h2>
          <div className="text-gray-300">
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
        <div className="bg-darkGreen-900/50 border border-gold-950/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gold-950 mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-300">
              <span>Subtotal</span>
              <span className="font-semibold">Rs. {order.subtotal?.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-gold-950">
                <span>Discount</span>
                <span className="font-semibold">- Rs. {order.discount?.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-300">
              <span>Delivery Charges</span>
              <span className="font-semibold">Rs. {order.deliveryCharges?.toLocaleString() || '0'}</span>
            </div>
            <div className="border-t border-gold-950/20 pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-gold-950">Grand Total</span>
                <span className="text-lg font-bold text-gold-950">
                  Rs. {order.total?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gold-950/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Payment Method</p>
                <p className="font-semibold text-gray-200 capitalize">
                  {order.paymentMethod?.replace('_', ' ')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">Payment Status</p>
                <p
                  className={`font-semibold capitalize ${
                    order.paymentStatus === 'paid'
                      ? 'text-gold-950'
                      : order.paymentStatus === 'failed'
                      ? 'text-red-400'
                      : 'text-yellow-400'
                  }`}
                >
                  {order.paymentStatus}
                </p>
              </div>
            </div>
          </div>

          {order.trackingNumber && (
            <div className="mt-6 pt-6 border-t border-gold-950/20">
              <p className="text-sm text-gray-300 mb-1">Tracking Number</p>
              <p className="font-semibold text-gray-200">{order.trackingNumber}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;

