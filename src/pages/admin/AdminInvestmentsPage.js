import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Eye,
  RefreshCw,
} from 'lucide-react';
import adminService from '../../services/admin';
import { Button } from '../../components';

const AdminInvestmentsPage = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [processingId, setProcessingId] = useState(null);
  const [selectedInvestment, setSelectedInvestment] = useState(null);

  useEffect(() => {
    fetchInvestments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page]);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const status = filter !== 'all' ? filter : null;
      const response = await adminService.getInvestments(status, page, 20);
      if (response.success) {
        // Backend returns { success: true, data: { investments, total, page, pages } }
        setInvestments(response.data?.investments || response.investments || []);
        setTotalPages(response.data?.pages || response.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (investmentId) => {
    if (!window.confirm('Are you sure you want to approve this investment?')) {
      return;
    }

    try {
      setProcessingId(investmentId);
      const response = await adminService.approveInvestment(investmentId);
      if (response.success) {
        await fetchInvestments();
        alert('Investment approved successfully!');
      } else {
        alert(response.message || 'Failed to approve investment');
      }
    } catch (error) {
      alert(error.message || 'Failed to approve investment');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (investmentId) => {
    if (!window.confirm('Are you sure you want to reject this investment?')) {
      return;
    }

    try {
      setProcessingId(investmentId);
      const response = await adminService.rejectInvestment(investmentId);
      if (response.success) {
        await fetchInvestments();
        alert('Investment rejected successfully!');
      } else {
        alert(response.message || 'Failed to reject investment');
      }
    } catch (error) {
      alert(error.message || 'Failed to reject investment');
    } finally {
      setProcessingId(null);
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && investments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Investment Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Review and approve investment requests
          </p>
        </div>
        <Button
          onClick={fetchInvestments}
          variant="outline"
          className="flex items-center w-full sm:w-auto min-h-[44px]"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status.toLowerCase());
                setPage(1);
              }}
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
            <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
              No investments found
            </p>
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
                  <div className="mb-3">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                      {investment.user?.fullName || investment.user?.name || 'User Not Found'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {investment.user?.email || 'Email not available'}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Plan</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {investment.plan?.name || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                          <DollarSign className="w-3 h-3 mr-1 text-emerald-500" />
                          {investment.amount}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      {getStatusBadge(investment.status)}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(investment.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {investment.paymentProof && (
                      <Button
                        onClick={() => setSelectedInvestment(investment)}
                        variant="outline"
                        size="sm"
                        className="flex-1 min-h-[44px] text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Receipt
                      </Button>
                    )}
                    {investment.status === 'Pending' && (
                      <>
                        <Button
                          onClick={() => handleApprove(investment._id)}
                          size="sm"
                          loading={processingId === investment._id}
                          className="bg-green-600 hover:bg-green-700 text-white flex-1 min-h-[44px] text-xs"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(investment._id)}
                          size="sm"
                          loading={processingId === investment._id}
                          className="bg-red-600 hover:bg-red-700 text-white flex-1 min-h-[44px] text-xs"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
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
                      User
                    </th>
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
                      Date
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
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
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {investment.user?.fullName || investment.user?.name || 'User Not Found'}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {investment.user?.email || 'Email not available'}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {investment.plan?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                          <DollarSign className="w-4 h-4 mr-1 text-emerald-500" />
                          {investment.amount}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(investment.status)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(investment.createdAt)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          {investment.paymentProof && (
                            <Button
                              onClick={() => setSelectedInvestment(investment)}
                              variant="outline"
                              size="sm"
                              className="min-h-[44px]"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Receipt
                            </Button>
                          )}
                          {investment.status === 'Pending' && (
                            <>
                              <Button
                                onClick={() => handleApprove(investment._id)}
                                size="sm"
                                loading={processingId === investment._id}
                                className="bg-green-600 hover:bg-green-700 text-white min-h-[44px]"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => handleReject(investment._id)}
                                size="sm"
                                loading={processingId === investment._id}
                                className="bg-red-600 hover:bg-red-700 text-white min-h-[44px]"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedInvestment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-2xl w-full mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Payment Receipt
              </h3>
              <Button
                onClick={() => setSelectedInvestment(null)}
                variant="ghost"
                size="sm"
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>
            <img
              src={selectedInvestment.paymentProof}
              alt="Receipt"
              className="w-full rounded-lg"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminInvestmentsPage;

