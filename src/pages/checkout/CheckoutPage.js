import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  Loader2,
  Lock,
  MapPin,
  CreditCard,
  Wallet,
  Phone,
  Mail,
  Navigation,
} from 'lucide-react';
import cartService from '../../services/cart';
import orderService from '../../services/order';
import addressService from '../../services/address';
import { useAuth } from '../../context/AuthContext';
import { useLocationContext } from '../../context/LocationContext';
import { toast } from 'react-toastify';
import { ROUTES } from '../../constants';
import FirebaseImage from '../../components/FirebaseImage';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { getCurrentLocation, location, locationName } = useLocationContext();

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [totals, setTotals] = useState({ subtotal: 0, discount: 0, delivery: 200, total: 0 });
  const [usingCurrentLocation, setUsingCurrentLocation] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    fetchCart();
    fetchAddresses();
  }, [isAuthenticated]);

  useEffect(() => {
    if (cart) {
      calculateTotals();
    }
  }, [cart]);

  useEffect(() => {
    if (user) {
      setValue('fullName', user.fullName || '');
      setValue('email', user.email || '');
      setValue('phone', user.phone || '');
    }
  }, [user, setValue]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      if (response.success) {
        // Backend returns data in response.data
        const cartData = response.data || response.cart;
        console.log('Checkout cart data:', cartData);
        console.log('Checkout cart items:', cartData?.items);
        setCart(cartData);
        if (!cartData || !cartData.items || cartData.items.length === 0) {
          toast.info('Your cart is empty');
          navigate(ROUTES.CART);
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await addressService.getAddresses();
      if (response.success) {
        setAddresses(response.addresses || []);
        const defaultAddress = response.addresses?.find(addr => addr.isDefault) || response.addresses?.[0];
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const calculateTotals = () => {
    if (!cart || !cart.items) {
      setTotals({ subtotal: 0, discount: 0, delivery: 200, total: 200 });
      return;
    }

    let subtotal = 0;
    cart.items.forEach(item => {
      subtotal += (item.price || 0) * (item.quantity || 0);
    });

    const discount = cart.couponDiscount || 0;
    const delivery = 200;
    const total = Math.max(0, subtotal - discount + delivery);

    setTotals({ subtotal, discount, delivery, total });
  };

  const onSubmit = async (data) => {
    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!selectedAddress && !data.address) {
      toast.error('Please provide a delivery address');
      return;
    }

    try {
      setPlacingOrder(true);

      const orderData = {
        shippingAddress: selectedAddress ? {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          address: selectedAddress.address,
          city: selectedAddress.city,
          area: selectedAddress.area,
          postalCode: selectedAddress.postalCode,
          landmark: selectedAddress.landmark,
        } : {
          fullName: data.fullName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          area: data.area,
          postalCode: data.postalCode,
          landmark: data.landmark,
        },
        paymentMethod,
        coupon: cart.coupon?._id || null,
      };

      const response = await orderService.createOrder(orderData);
      
      if (response.success) {
        toast.success('Order placed successfully!');
        // Backend returns order in response.data
        const order = response.data || response.order;
        navigate(ROUTES.ORDER_DETAIL.replace(':orderNumber', order.orderNumber));
      }
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-green-50 to-amber-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      {...register('fullName', { required: 'Full name is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email address',
                        },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <div className="flex gap-2">
                      <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                        <option value="+92">+92</option>
                        <option value="+1">+1</option>
                      </select>
                      <input
                        type="tel"
                        {...register('phone', { required: 'Phone number is required' })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="300 1234567"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        setIsGettingLocation(true);
                        const locationData = await getCurrentLocation();
                        setUsingCurrentLocation(true);
                        setSelectedAddress(null);
                        setValue('city', locationData.name || locationName);
                        toast.success('Location detected! Please fill in your complete address.');
                      } catch (error) {
                        toast.error('Failed to get location. Please enable location access.');
                      } finally {
                        setIsGettingLocation(false);
                      }
                    }}
                    disabled={isGettingLocation || usingCurrentLocation}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {isGettingLocation ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Getting Location...
                      </>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4" />
                        {usingCurrentLocation ? 'Using Current Location' : 'Use Current Location'}
                      </>
                    )}
                  </button>
                </div>
                
                {addresses.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {addresses.map((address) => (
                      <label
                        key={address._id}
                        className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedAddress?._id === address._id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                        onClick={() => {
                          setSelectedAddress(address);
                          setUsingCurrentLocation(false);
                        }}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={address._id}
                          checked={selectedAddress?._id === address._id}
                          onChange={() => {
                            setSelectedAddress(address);
                            setUsingCurrentLocation(false);
                          }}
                          className="sr-only"
                        />
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900">{address.fullName}</p>
                            <p className="text-sm text-gray-600">{address.address}</p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.area} {address.postalCode}
                            </p>
                            <p className="text-sm text-gray-600">{address.phone}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {usingCurrentLocation && (
                  <div className="mb-4 p-4 bg-green-50 border-2 border-green-500 rounded-lg">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Current Location</p>
                        <p className="text-sm text-gray-600">{locationName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Please fill in your complete address details below
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Address
                    </label>
                    <input
                      type="text"
                      {...register('address', { required: !selectedAddress && !usingCurrentLocation ? 'Address is required' : false })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="House No. Street, Area"
                      disabled={!!selectedAddress}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        {...register('city', { required: !selectedAddress && !usingCurrentLocation ? 'City is required' : false })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        disabled={!!selectedAddress}
                        placeholder={usingCurrentLocation ? locationName : 'Enter city'}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                      <input
                        type="text"
                        {...register('area')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        disabled={!!selectedAddress}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Instructions/Allergies
                    </label>
                    <textarea
                      {...register('specialInstructions')}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., Please call before arrival or specify any nut allergies."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { value: 'cod', label: 'Cash on Delivery', icon: Wallet },
                    { value: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                    { value: 'jazzcash', label: 'JazzCash', icon: Phone },
                    { value: 'easypaisa', label: 'Easypaisa', icon: Phone },
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.value}
                        className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          paymentMethod === method.value
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={paymentMethod === method.value}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <Icon className="w-5 h-5 text-green-500" />
                        <span className="font-medium text-gray-900">{method.label}</span>
                      </label>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                  <Lock className="w-4 h-4" />
                  <span>All transactions are secure and encrypted.</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={placingOrder}
                className="w-full bg-green-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {placingOrder ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
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
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{item.product?.name}</p>
                      {item.variant && (
                        <p className="text-sm text-gray-600">{item.variant}</p>
                      )}
                      <p className="text-sm text-gray-600">x{item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        Rs. {((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {cart.coupon && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-semibold text-green-800">
                    Coupon: {cart.coupon.code}
                  </p>
                </div>
              )}

              <div className="space-y-2 border-t pt-4">
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
                  <span className="font-semibold">Rs. {totals.delivery.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>FBR POS Charges</span>
                  <span className="font-semibold">Rs. 15</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Grand Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      Rs. {(totals.total + 15).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

