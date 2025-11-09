import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, CheckCircle, XCircle, Plus, DollarSign } from 'lucide-react';
import investmentService from '../../services/investment';
import { Button } from '../../components';
import { ROUTES } from '../../constants';

const MyInvestmentsPage = () => {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInvestments();
  }, [filter]);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const status = filter !== 'all' ? filter : null;
      const response = await investmentService.getMyInvestments(status);
      if (response.success) {
        setInvestments(response.investments || []);
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: {
        icon: Clock,
        bg: 'bg-amber-100 dark:bg-amber-900/20',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-300 dark:border-amber-700',
      },
      Approved: {
        icon: CheckCircle,
        bg: 'bg-green-100 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-400',
        border: 'border-green-300 dark:border-green-700',
      },
      Rejected: {
        icon: XCircle,
        bg: 'bg-red-100 dark:bg-red-900/20',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-300 dark:border-red-700',
      },
    };

    const config = statusConfig[status] || statusConfig.Pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text} ${config.border} border`}
      >
        <Icon className="w-4 h-4 mr-1" />
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              My Investments
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Track all your investment requests and their status
            </p>
          </div>
          <Button
            onClick={() => navigate(ROUTES.PLANS)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto min-h-[44px] text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            New Investment
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          {['all', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status.toLowerCase())}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors min-h-[44px] ${
                filter === status.toLowerCase()
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Investments Table/Cards */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
          {investments.length === 0 ? (
            <div className="text-center py-8 sm:py-12 px-4">
              <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-4">
                No investments found
              </p>
              <Button
                onClick={() => navigate(ROUTES.PLANS)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white min-h-[44px]"
              >
                Browse Plans
              </Button>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block sm:hidden divide-y divide-gray-200 dark:divide-slate-700">
                {investments.map((investment) => (
                  <motion.div
                    key={investment._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                          {investment.plan?.name || 'N/A'}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <DollarSign className="w-4 h-4 mr-1 text-emerald-500" />
                          ${investment.amount}
                        </div>
                      </div>
                      {getStatusBadge(investment.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Total Earned</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ${investment.totalEarned || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Date</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatDate(investment.createdAt)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Total Earned
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                    {investments.map((investment) => (
                      <motion.tr
                        key={investment._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {investment.plan?.name || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900 dark:text-white">
                            <DollarSign className="w-4 h-4 mr-1 text-emerald-500" />
                            {investment.amount}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(investment.status)}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            ${investment.totalEarned || 0}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(investment.createdAt)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyInvestmentsPage;

