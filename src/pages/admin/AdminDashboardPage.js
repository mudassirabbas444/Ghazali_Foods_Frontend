import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import adminService from '../../services/admin';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { toast } from 'react-toastify';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, lowStockResponse, ordersResponse] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getLowStockProducts(),
        adminService.getAllOrders({ limit: 5 }),
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
      if (lowStockResponse.success) {
        setLowStockProducts(lowStockResponse.products || []);
      }
      if (ordersResponse.success) {
        setRecentOrders(ordersResponse.orders || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: stats?.totalRevenue || 0,
      icon: DollarSign,
      color: 'green',
      change: stats?.revenueChange || 0,
      prefix: 'Rs. ',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'blue',
      change: stats?.ordersChange || 0,
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'purple',
      change: stats?.customersChange || 0,
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'orange',
      change: stats?.productsChange || 0,
    },
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toLocaleString() || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const isPositive = card.change >= 0;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.prefix}
                    {formatNumber(card.value)}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {isPositive ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {Math.abs(card.change)}%
                    </span>
                    <span className="text-sm text-gray-500">vs last month</span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-lg bg-${card.color}-100`}
                >
                  <Icon className={`w-6 h-6 text-${card.color}-600`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link
              to={ROUTES.ADMIN_ORDERS}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order #</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                      No recent orders
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {order.user?.fullName || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        Rs. {order.total?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Low Stock</h2>
            <AlertCircle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">All products in stock</p>
            ) : (
              lowStockProducts.slice(0, 5).map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-600">
                      Stock: {product.stock || product.variants?.[0]?.stock || 0}
                    </p>
                  </div>
                  <Link
                    to={`${ROUTES.ADMIN_PRODUCTS}?edit=${product._id}`}
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Update
                  </Link>
                </div>
              ))
            )}
            {lowStockProducts.length > 5 && (
              <Link
                to={ROUTES.ADMIN_PRODUCTS}
                className="block text-center text-sm text-orange-600 hover:text-orange-700 font-medium pt-2"
              >
                View All ({lowStockProducts.length})
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.pendingOrders || 0}
              </p>
            </div>
            <ShoppingCart className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs. {formatNumber(stats?.averageOrderValue || 0)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {(stats?.conversionRate || 0).toFixed(1)}%
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

