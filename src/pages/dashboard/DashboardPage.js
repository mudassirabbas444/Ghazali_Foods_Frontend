import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Wallet,
  Award,
  Users,
  ArrowRight,
} from 'lucide-react';
import dashboardService from '../../services/dashboard';
import { Button } from '../../components';
import { ROUTES } from '../../constants';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchEarnings();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getDashboard();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEarnings = async () => {
    try {
      const response = await dashboardService.getEarnings(1, 30);
      if (response.success) {
        setEarnings(response.data?.earnings || []);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Investment',
      value: `$${dashboardData?.totalInvestment || 0}`,
      icon: DollarSign,
      color: 'indigo',
      link: ROUTES.MY_INVESTMENTS,
    },
    {
      name: 'Total Earnings',
      value: `$${dashboardData?.totalEarnings || 0}`,
      icon: TrendingUp,
      color: 'emerald',
      link: null,
    },
    {
      name: 'Available Balance',
      value: `$${dashboardData?.availableBalance || 0}`,
      icon: Wallet,
      color: 'purple',
      link: ROUTES.WITHDRAW,
    },
    {
      name: 'Team Count',
      value: dashboardData?.teamCount || 0,
      icon: Users,
      color: 'blue',
      link: ROUTES.TEAM,
    },
    {
      name: 'Rank',
      value: dashboardData?.rank || 'None',
      icon: Award,
      color: 'amber',
      link: null,
    },
  ];

  // Prepare chart data
  const earningsChartData = earnings.slice(0, 7).reverse().map((earning) => ({
    date: new Date(earning.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    amount: earning.amount,
    type: earning.type,
  }));

  const levelCounts = dashboardData?.levelCounts || {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Overview of your investment portfolio and earnings
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              indigo: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
              emerald: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
              purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
              blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
              amber: 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
            };

            return (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6 ${
                  stat.link ? 'cursor-pointer hover:shadow-xl transition-shadow active:scale-95' : ''
                }`}
                onClick={() => stat.link && navigate(stat.link)}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`p-2 sm:p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  {stat.link && (
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  )}
                </div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.name}
                </h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">
                  {stat.value}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Earnings Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6"
          >
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Recent Earnings
            </h3>
            {earningsChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                <LineChart data={earningsChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-slate-600" />
                  <XAxis dataKey="date" className="text-gray-600 dark:text-gray-400" />
                  <YAxis className="text-gray-600 dark:text-gray-400" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    name="Earnings ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No earnings data available
              </div>
            )}
          </motion.div>

          {/* Team Levels Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6"
          >
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Team Distribution
            </h3>
            {Object.keys(levelCounts).length > 0 ? (
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                <BarChart data={[
                  { level: 'Level 1', count: levelCounts.level1 || 0 },
                  { level: 'Level 2', count: levelCounts.level2 || 0 },
                  { level: 'Level 3', count: levelCounts.level3 || 0 },
                  { level: 'Level 4', count: levelCounts.level4 || 0 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-slate-600" />
                  <XAxis dataKey="level" className="text-gray-600 dark:text-gray-400" />
                  <YAxis className="text-gray-600 dark:text-gray-400" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="#7C3AED" name="Team Members" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No team data available
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Button
            onClick={() => navigate(ROUTES.PLANS)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-16 sm:h-20 text-base sm:text-lg min-h-[44px]"
          >
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Invest Now
          </Button>
          <Button
            onClick={() => navigate(ROUTES.WITHDRAW)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white h-16 sm:h-20 text-base sm:text-lg min-h-[44px]"
          >
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Withdraw Funds
          </Button>
          <Button
            onClick={() => navigate(ROUTES.TEAM)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white h-16 sm:h-20 text-base sm:text-lg min-h-[44px] sm:col-span-2 lg:col-span-1"
          >
            <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            View Team
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

