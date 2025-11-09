import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';
import adminService from '../../services/admin';
import { Button, Input } from '../../components';

const AdminWithdrawalsPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [processingId, setProcessingId] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    fetchWithdrawals();
  }, [filter, page]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const status = filter !== 'all' ? filter : null;
      const response = await adminService.getWithdrawals(status, page, 20);
      if (response.success) {
        setWithdrawals(response.withdrawals || []);
        setTotalPages(response.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (withdrawalId) => {
    if (!window.confirm('Are you sure you want to approve and mark this withdrawal as paid?')) {
      return;
    }

    try {
      setProcessingId(withdrawalId);
      const response = await adminService.approveWithdrawal(withdrawalId, adminNote);
      if (response.success) {
        await fetchWithdrawals();
        setAdminNote('');
        setSelectedWithdrawal(null);
        alert('Withdrawal approved and marked as paid!');
      } else {
        alert(response.message || 'Failed to approve withdrawal');
      }
    } catch (error) {
      alert(error.message || 'Failed to approve withdrawal');
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
      Paid: {
        icon: CheckCircle,
        bg: 'bg-emerald-100 dark:bg-emerald-900/20',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-300 dark:border-emerald-700',
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

  if (loading && withdrawals.length === 0) {
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
            Withdrawal Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Review and approve withdrawal requests
          </p>
        </div>
        <Button
          onClick={fetchWithdrawals}
          variant="outline"
          className="flex items-center w-full sm:w-auto min-h-[44px]"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'Pending', 'Approved', 'Paid', 'Rejected'].map((status) => (
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

      {/* Withdrawals Table/Cards */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        {withdrawals.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
              No withdrawals found
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-gray-200 dark:divide-slate-700">
              {withdrawals.map((withdrawal) => (
                <motion.div
                  key={withdrawal._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4"
                >
                  <div className="mb-3">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                      {withdrawal.user?.fullName || 'N/A'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {withdrawal.user?.email || 'N/A'}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                          <DollarSign className="w-3 h-3 mr-1 text-emerald-500" />
                          {withdrawal.amount}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Method</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {withdrawal.method}
                        </p>
                      </div>
                    </div>
                    {withdrawal.accountDetails && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Account</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 truncate">
                          {withdrawal.accountDetails}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      {getStatusBadge(withdrawal.status)}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(withdrawal.createdAt)}
                      </p>
                    </div>
                  </div>
                  {(withdrawal.status === 'Pending' || withdrawal.status === 'Approved') && (
                    <Button
                      onClick={() => {
                        setSelectedWithdrawal(withdrawal);
                        setAdminNote(withdrawal.adminNote || '');
                      }}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white w-full min-h-[44px] text-xs"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                  )}
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
                      Amount
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Method
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
                  {withdrawals.map((withdrawal) => (
                    <motion.tr
                      key={withdrawal._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {withdrawal.user?.fullName || 'N/A'}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {withdrawal.user?.email || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                          <DollarSign className="w-4 h-4 mr-1 text-emerald-500" />
                          {withdrawal.amount}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white capitalize">
                          {withdrawal.method}
                        </div>
                        {withdrawal.accountDetails && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {withdrawal.accountDetails}
                          </div>
                        )}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(withdrawal.status)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(withdrawal.createdAt)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                        {(withdrawal.status === 'Pending' || withdrawal.status === 'Approved') && (
                          <Button
                            onClick={() => {
                              setSelectedWithdrawal(withdrawal);
                              setAdminNote(withdrawal.adminNote || '');
                            }}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white min-h-[44px]"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        )}
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

      {/* Approval Modal */}
      {selectedWithdrawal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Approve Withdrawal
              </h3>
              <Button
                onClick={() => {
                  setSelectedWithdrawal(null);
                  setAdminNote('');
                }}
                variant="ghost"
                size="sm"
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">User</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedWithdrawal.user?.fullName || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  ${selectedWithdrawal.amount}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Method</p>
                <p className="font-medium text-gray-900 dark:text-white capitalize">
                  {selectedWithdrawal.method}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Account Details</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedWithdrawal.accountDetails}
                </p>
              </div>

              <Input
                label="Admin Note (Optional)"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add a note about this withdrawal..."
                leftIcon={<MessageSquare className="w-5 h-5" />}
              />

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setSelectedWithdrawal(null);
                    setAdminNote('');
                  }}
                  variant="outline"
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleApprove(selectedWithdrawal._id)}
                  loading={processingId === selectedWithdrawal._id}
                  fullWidth
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Paid
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawalsPage;

