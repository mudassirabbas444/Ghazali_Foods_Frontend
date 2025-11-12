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
  Copy,
  Share2,
  Calendar,
  CheckCircle,
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
  const [referralInfo, setReferralInfo] = useState(null);
  const [dailyEarnings, setDailyEarnings] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchEarnings();
    fetchReferralInfo();
    fetchDailyEarnings();
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

  const fetchReferralInfo = async () => {
    try {
      const response = await dashboardService.getReferralInfo();
      if (response.success) {
        setReferralInfo(response.data);
      }
    } catch (error) {
      console.error('Error fetching referral info:', error);
    }
  };

  const fetchDailyEarnings = async () => {
    try {
      const response = await dashboardService.getDailyEarnings();
      if (response.success) {
        setDailyEarnings(response.data?.records || []);
      }
    } catch (error) {
      console.error('Error fetching daily earnings:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferralLink = async () => {
    if (navigator.share && referralInfo) {
      try {
        await navigator.share({
          title: 'Join Dreams Life',
          text: referralInfo.shareText,
          url: referralInfo.referralLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyToClipboard(referralInfo?.referralLink || '');
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
      value: `$${Number(dashboardData?.totalInvestment || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'indigo',
      link: ROUTES.MY_INVESTMENTS,
    },
    {
      name: 'Total Earnings',
      value: `$${Number(dashboardData?.totalEarnings || 0).toFixed(2)}`,
      icon: TrendingUp,
      color: 'emerald',
      link: null,
    },
    {
      name: 'Available Balance',
      value: `$${Number(dashboardData?.availableBalance || 0).toFixed(2)}`,
      icon: Wallet,
      color: 'purple',
      link: ROUTES.WITHDRAW,
    },
    {
      name: 'Active Team',
      value: dashboardData?.activeTeamCount || 0,
      icon: Users,
      color: 'blue',
      link: ROUTES.TEAM,
      subtitle: `${dashboardData?.inactiveTeamCount || 0} inactive`,
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
                {stat.subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stat.subtitle}
                  </p>
                )}
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

        {/* Referral Code Section */}
        {referralInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
              Your Referral Code
            </h2>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <label className="text-sm font-medium text-white/80 mb-2 block">
                  Referral Code
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={referralInfo.refCode}
                    readOnly
                    className="flex-1 bg-white/20 text-white font-mono text-lg sm:text-xl px-4 py-2 rounded border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button
                    onClick={() => copyToClipboard(referralInfo.refCode)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded transition-colors"
                    title="Copy code"
                  >
                    {copied ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Copy className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <label className="text-sm font-medium text-white/80 mb-2 block">
                  Referral Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={referralInfo.referralLink}
                    readOnly
                    className="flex-1 bg-white/20 text-white text-sm sm:text-base px-4 py-2 rounded border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 truncate"
                  />
                  <button
                    onClick={() => copyToClipboard(referralInfo.referralLink)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded transition-colors"
                    title="Copy link"
                  >
                    {copied ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <Copy className="w-5 h-5 text-white" />
                    )}
                  </button>
                  <button
                    onClick={shareReferralLink}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded transition-colors"
                    title="Share link"
                  >
                    <Share2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Daily Earnings Summary */}
        {dailyEarnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate(ROUTES.DAILY_EARNINGS)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    Daily Earnings
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {dailyEarnings.length} day{dailyEarnings.length !== 1 ? 's' : ''} recorded
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  ${dailyEarnings.reduce((sum, record) => sum + record.totalEarnings, 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total</p>
                <ArrowRight className="w-5 h-5 text-gray-400 mt-2 ml-auto" />
              </div>
            </div>
          </motion.div>
        )}

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

