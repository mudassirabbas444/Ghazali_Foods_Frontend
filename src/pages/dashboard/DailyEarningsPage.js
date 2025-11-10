import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Filter,
  ArrowLeft,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import dashboardService from '../../services/dashboard';
import { Button } from '../../components';
import { ROUTES } from '../../constants';

const DailyEarningsPage = () => {
  const navigate = useNavigate();
  const [dailyEarnings, setDailyEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: '',
  });

  useEffect(() => {
    fetchDailyEarnings();
  }, [filters]);

  const fetchDailyEarnings = async () => {
    setLoading(true);
    try {
      const response = await dashboardService.getDailyEarnings(
        filters.startDate || null,
        filters.endDate || null
      );
      if (response.success) {
        let records = response.data?.records || [];
        
        // Filter by type if selected
        if (filters.type) {
          records = records.map(record => ({
            ...record,
            earnings: record.earnings.filter(e => e.type === filters.type),
            totalEarnings: record.earnings
              .filter(e => e.type === filters.type)
              .reduce((sum, e) => sum + e.amount, 0),
            breakdown: {
              ...record.breakdown,
              [filters.type]: record.breakdown[filters.type] || 0,
            }
          })).filter(record => record.totalEarnings > 0);
        }
        
        setDailyEarnings(records);
      }
    } catch (error) {
      console.error('Error fetching daily earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      type: '',
    });
  };

  const getTotalEarnings = () => {
    return dailyEarnings.reduce((sum, record) => sum + record.totalEarnings, 0);
  };

  const getEarningsByType = () => {
    const totals = {
      ROI: 0,
      Direct: 0,
      Level2: 0,
      Level3: 0,
      Level4: 0,
      RankReward: 0,
    };
    
    dailyEarnings.forEach(record => {
      Object.keys(totals).forEach(type => {
        totals[type] += record.breakdown[type] || 0;
      });
    });
    
    return totals;
  };

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'ROI', label: 'ROI' },
    { value: 'Direct', label: 'Direct' },
    { value: 'Level2', label: 'Level 2' },
    { value: 'Level3', label: 'Level 3' },
    { value: 'Level4', label: 'Level 4' },
    { value: 'RankReward', label: 'Rank Reward' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const earningsByType = getEarningsByType();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Daily Earnings Records
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Detailed view of your daily earnings with filters
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Earnings</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  ${getTotalEarnings().toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Days</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {dailyEarnings.length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-indigo-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Daily</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  ${dailyEarnings.length > 0 ? (getTotalEarnings() / dailyEarnings.length).toFixed(2) : '0.00'}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">ROI Earnings</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${earningsByType.ROI.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Filters
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Earning Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={clearFilters}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Earnings Breakdown by Type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
            Earnings Breakdown by Type
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(earningsByType).map(([type, amount]) => (
              <div
                key={type}
                className={`p-4 rounded-lg ${
                  type === 'ROI' ? 'bg-indigo-50 dark:bg-indigo-900/20' :
                  type === 'Direct' ? 'bg-emerald-50 dark:bg-emerald-900/20' :
                  type === 'Level2' ? 'bg-purple-50 dark:bg-purple-900/20' :
                  type === 'Level3' ? 'bg-blue-50 dark:bg-blue-900/20' :
                  type === 'Level4' ? 'bg-amber-50 dark:bg-amber-900/20' :
                  'bg-pink-50 dark:bg-pink-900/20'
                }`}
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{type}</p>
                <p className={`text-lg font-bold ${
                  type === 'ROI' ? 'text-indigo-600 dark:text-indigo-400' :
                  type === 'Direct' ? 'text-emerald-600 dark:text-emerald-400' :
                  type === 'Level2' ? 'text-purple-600 dark:text-purple-400' :
                  type === 'Level3' ? 'text-blue-600 dark:text-blue-400' :
                  type === 'Level4' ? 'text-amber-600 dark:text-amber-400' :
                  'text-pink-600 dark:text-pink-400'
                }`}>
                  ${amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Daily Earnings Records */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Daily Records
          </h2>
          {dailyEarnings.length > 0 ? (
            <div className="space-y-4">
              {dailyEarnings.map((record) => (
                <div
                  key={record.date}
                  className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </h3>
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      ${record.totalEarnings.toFixed(2)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-sm">
                    {record.breakdown.ROI > 0 && (
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded p-2">
                        <p className="text-gray-600 dark:text-gray-400">ROI</p>
                        <p className="font-semibold text-indigo-600 dark:text-indigo-400">
                          ${record.breakdown.ROI.toFixed(2)}
                        </p>
                      </div>
                    )}
                    {record.breakdown.Direct > 0 && (
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded p-2">
                        <p className="text-gray-600 dark:text-gray-400">Direct</p>
                        <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                          ${record.breakdown.Direct.toFixed(2)}
                        </p>
                      </div>
                    )}
                    {record.breakdown.Level2 > 0 && (
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-2">
                        <p className="text-gray-600 dark:text-gray-400">Level 2</p>
                        <p className="font-semibold text-purple-600 dark:text-purple-400">
                          ${record.breakdown.Level2.toFixed(2)}
                        </p>
                      </div>
                    )}
                    {record.breakdown.Level3 > 0 && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2">
                        <p className="text-gray-600 dark:text-gray-400">Level 3</p>
                        <p className="font-semibold text-blue-600 dark:text-blue-400">
                          ${record.breakdown.Level3.toFixed(2)}
                        </p>
                      </div>
                    )}
                    {record.breakdown.Level4 > 0 && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded p-2">
                        <p className="text-gray-600 dark:text-gray-400">Level 4</p>
                        <p className="font-semibold text-amber-600 dark:text-amber-400">
                          ${record.breakdown.Level4.toFixed(2)}
                        </p>
                      </div>
                    )}
                    {record.breakdown.RankReward > 0 && (
                      <div className="bg-pink-50 dark:bg-pink-900/20 rounded p-2">
                        <p className="text-gray-600 dark:text-gray-400">Rank</p>
                        <p className="font-semibold text-pink-600 dark:text-pink-400">
                          ${record.breakdown.RankReward.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No earnings records found for the selected filters
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DailyEarningsPage;

