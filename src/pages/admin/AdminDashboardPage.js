import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Wallet,
  ArrowRight,
  BarChart3,
  PieChart,
} from 'lucide-react';
import adminService from '../../services/admin';
import { Button } from '../../components';
import { ROUTES } from '../../constants';
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const response = await adminService.getOverview();
      if (response.success) {
        setOverview(response.data);
      } else {
        setError(response.message || 'Failed to fetch overview');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch overview');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-700 dark:text-red-400">{error}</p>
        <Button onClick={fetchOverview} className="mt-4">Retry</Button>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Users',
      value: overview?.totalUsers || 0,
      icon: Users,
      color: 'indigo',
      link: null,
    },
    {
      name: 'Total Investments',
      value: `$${(overview?.totalInvestments || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'emerald',
      link: ROUTES.ADMIN_INVESTMENTS,
    },
    {
      name: 'Total Payouts',
      value: `$${(overview?.totalPayouts || 0).toLocaleString()}`,
      icon: Wallet,
      color: 'purple',
      link: ROUTES.ADMIN_WITHDRAWALS,
    },
    {
      name: 'Total Earnings',
      value: `$${(overview?.totalEarnings || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'blue',
      link: null,
    },
    {
      name: 'Pending Investments',
      value: overview?.pendingInvestments || 0,
      icon: Clock,
      color: 'amber',
      link: ROUTES.ADMIN_INVESTMENTS,
    },
    {
      name: 'Pending Withdrawals',
      value: overview?.pendingWithdrawals || 0,
      icon: Clock,
      color: 'red',
      link: ROUTES.ADMIN_WITHDRAWALS,
    },
  ];

  const colorClasses = {
    indigo: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    amber: 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  };

  const chartData = [
    { name: 'Investments', value: overview?.totalInvestments || 0 },
    { name: 'Payouts', value: overview?.totalPayouts || 0 },
    { name: 'Earnings', value: overview?.totalEarnings || 0 },
  ];

  const COLORS = ['#4F46E5', '#10B981', '#3B82F6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of platform statistics and pending actions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 ${
                stat.link ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''
              }`}
              onClick={() => stat.link && navigate(stat.link)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                {stat.link && (
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {stat.name}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Overview Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Financial Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-slate-600" />
              <XAxis dataKey="name" className="text-gray-600 dark:text-gray-400" />
              <YAxis className="text-gray-600 dark:text-gray-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value) => `$${value.toLocaleString()}`}
              />
              <Bar dataKey="value" fill="#4F46E5" name="Amount ($)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Button
          onClick={() => navigate(ROUTES.ADMIN_INVESTMENTS)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-20 text-lg"
        >
          <DollarSign className="w-6 h-6 mr-2" />
          Manage Investments
        </Button>
        <Button
          onClick={() => navigate(ROUTES.ADMIN_WITHDRAWALS)}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white h-20 text-lg"
        >
          <Wallet className="w-6 h-6 mr-2" />
          Manage Withdrawals
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

