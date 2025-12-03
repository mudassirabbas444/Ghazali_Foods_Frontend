import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import cartService from '../../services/cart';
import couponService from '../../services/coupon';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { ROUTES } from '../../constants';
import FirebaseImage from '../../components/FirebaseImage';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [totals, setTotals] = useState({ subtotal: 0, discount: 0, total: 0 });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    fetchCart();
  }, [isAuthenticated]);

  useEffect(() => {
    if (cart) {
      calculateTotals();
    }
  }, [cart]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      if (response.success) {
        // Backend returns data in response.data
        const cartData = response.data || response.cart;
        console.log('Cart data:', cartData);
        console.log('Cart items:', cartData?.items);
        setCart(cartData);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    if (!cart || !cart.items) {
      setTotals({ subtotal: 0, discount: 0, total: 0 });
      return;
    }

    let subtotal = 0;
    cart.items.forEach(item => {
      subtotal += (item.price || 0) * (item.quantity || 0);
    });

    const discount = cart.couponDiscount || 0;
    const total = Math.max(0, subtotal - discount);

    setTotals({ subtotal, discount, total });
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(true);
      await cartService.updateCartItem(itemId, newQuantity);
      await fetchCart();
    } catch (error) {
      toast.error(error.message || 'Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setUpdating(true);
      await cartService.removeFromCart(itemId);
      await fetchCart();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error(error.message || 'Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      setApplyingCoupon(true);
      await cartService.applyCoupon(couponCode.trim().toUpperCase());
      await fetchCart();
      setCouponCode('');
      toast.success('Coupon applied successfully!');
    } catch (error) {
      toast.error(error.message || 'Invalid coupon code');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      setApplyingCoupon(true);
      await cartService.removeCoupon();
      await fetchCart();
      toast.success('Coupon removed');
    } catch (error) {
      toast.error(error.message || 'Failed to remove coupon');
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // Check if cart is empty or has no items
  const cartItems = cart?.items || [];
  const hasItems = cartItems.length > 0;

  if (!cart || !hasItems) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <Link
            to={ROUTES.SHOP}
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 flex gap-4"
              >
                <Link
                  to={ROUTES.PRODUCT_DETAIL.replace(':slug', item.product?.slug)}
                  className="flex-shrink-0"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                    <FirebaseImage
                      src={
                        (item.product?.images && item.product.images.length > 0 && item.product.images[0])
                        || item.product?.thumbnail
                        || 'https://images8.alphacoders.com/109/1095996.jpg'
                      }
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                <div className="flex-1">
                  <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', item.product?.slug)}>
                    <h3 className="font-semibold text-gray-900 mb-1 hover:text-orange-600">
                      {item.product?.name}
                    </h3>
                  </Link>
                  {item.variant && (
                    <p className="text-sm text-gray-600 mb-2">Weight: {item.variant}</p>
                  )}
                  <p className="text-lg font-bold text-gray-900">
                    Rs. {item.price?.toLocaleString()}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                        disabled={updating || item.quantity <= 1}
                        className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        disabled={updating}
                        className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      disabled={updating}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Coupon Section */}
              <div className="mb-6">
                {cart.coupon ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-800">
                          {cart.coupon.code}
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        disabled={applyingCoupon}
                        className="text-xs text-green-700 hover:text-green-900"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="mb-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter promo code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      <button
                        type="submit"
                        disabled={applyingCoupon || !couponCode.trim()}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
                      >
                        {applyingCoupon ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Apply'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">Rs. {totals.subtotal.toLocaleString()}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">- Rs. {totals.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Charges</span>
                  <span className="font-semibold">Rs. 200</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Grand Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      Rs. {(totals.total + 200).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to={ROUTES.CHECKOUT}
                className="block w-full bg-orange-500 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Proceed to Checkout
              </Link>

              <Link
                to={ROUTES.SHOP}
                className="block w-full text-center mt-3 text-gray-600 hover:text-orange-600"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

