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
import PopularItems from '../../components/product/PopularItems';

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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Header */}
        <div className="md:hidden mb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Your Cart</h1>
            <button
              onClick={async () => {
                if (window.confirm('Are you sure you want to clear your cart?')) {
                  try {
                    await cartService.clearCart();
                    await fetchCart();
                    toast.success('Cart cleared');
                  } catch (error) {
                    toast.error('Failed to clear cart');
                  }
                }
              }}
              className="text-sm text-orange-500 hover:text-orange-600"
            >
              Clear cart
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <h1 className="hidden md:block text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            {cartItems.map((item) => {
              const originalPrice = item.product?.compareAtPrice || item.product?.basePrice;
              const currentPrice = item.price;
              const discount = originalPrice && originalPrice > currentPrice 
                ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
                : 0;

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-3 md:p-4 flex gap-3 md:gap-4"
                >
                  <Link
                    to={ROUTES.PRODUCT_DETAIL.replace(':slug', item.product?.slug)}
                    className="flex-shrink-0"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-gray-100">
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

                  <div className="flex-1 min-w-0">
                    <Link to={ROUTES.PRODUCT_DETAIL.replace(':slug', item.product?.slug)}>
                      <h3 className="font-semibold text-gray-900 mb-1 hover:text-orange-600 text-sm md:text-base line-clamp-2">
                        {item.product?.name}
                      </h3>
                    </Link>
                    <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2">
                      {item.product?.shortDescription || item.product?.description?.substring(0, 60) + '...'}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      {originalPrice && originalPrice > currentPrice && (
                        <span className="text-xs md:text-sm text-red-500 line-through">
                          Rs. {originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-base md:text-lg font-bold text-gray-900">
                        Rs. {currentPrice?.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 md:mt-4">
                      <div className="flex items-center gap-1 md:gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                          disabled={updating || item.quantity <= 1}
                          className="p-1 md:p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                        <span className="w-8 md:w-12 text-center font-semibold text-sm md:text-base">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                          disabled={updating}
                          className="p-1 md:p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
                        >
                          <Plus className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        disabled={updating}
                        className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6 sticky top-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

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
              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex justify-between text-sm md:text-base text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">Rs. {totals.subtotal.toLocaleString()}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-sm md:text-base text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">- Rs. {totals.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm md:text-base text-gray-700">
                  <span>FBR POS Charges</span>
                  <span className="font-semibold">Rs. 1</span>
                </div>
                <div className="border-t pt-2 md:pt-3">
                  <div className="flex justify-between">
                    <span className="text-base md:text-lg font-bold text-gray-900">Grand total</span>
                    <span className="text-base md:text-lg font-bold text-gray-900">
                      Rs. {(totals.total + 1).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to={ROUTES.CHECKOUT}
                className="block w-full bg-blue-500 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Checkout
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

        {/* Popular Items Section */}
        <PopularItems 
          excludeProductIds={cartItems.map(item => item.product?._id).filter(Boolean)}
          limit={6}
        />
      </div>
    </div>
  );
};

export default CartPage;

