import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  RefreshCw,
  MessageSquare,
  Upload,
  FileText,
  Eye,
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
  const [receiptFile, setReceiptFile] = useState(null);
  const [viewReceipt, setViewReceipt] = useState(null);
  const [actionType, setActionType] = useState('approve'); // 'approve' or 'reject'

  useEffect(() => {
    fetchWithdrawals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const status = filter !== 'all' ? filter : null;
      const response = await adminService.getWithdrawals(status, page, 20);
      if (response.success) {
        // Backend returns { success: true, data: { withdrawals, total, page, pages } }
        setWithdrawals(response.data?.withdrawals || response.withdrawals || []);
        setTotalPages(response.data?.pages || response.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Only JPEG, PNG, WebP images and PDF files are allowed.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setReceiptFile(file);
    }
  };

  const handleApprove = async (withdrawalId) => {
    if (!window.confirm('Are you sure you want to approve and mark this withdrawal as paid?')) {
      return;
    }

    try {
      setProcessingId(withdrawalId);
      const response = await adminService.approveWithdrawal(withdrawalId, adminNote, receiptFile);
      if (response.success) {
        await fetchWithdrawals();
        setAdminNote('');
        setReceiptFile(null);
        setSelectedWithdrawal(null);
        setActionType('approve');
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

  const handleReject = async (withdrawalId) => {
    if (!window.confirm('Are you sure you want to reject this withdrawal? The amount will be refunded to the user.')) {
      return;
    }

    try {
      setProcessingId(withdrawalId);
      const response = await adminService.rejectWithdrawal(withdrawalId, adminNote);
      if (response.success) {
        await fetchWithdrawals();
        setAdminNote('');
        setSelectedWithdrawal(null);
        setActionType('approve');
        alert('Withdrawal rejected and amount refunded!');
      } else {
        alert(response.message || 'Failed to reject withdrawal');
      }
    } catch (error) {
      alert(error.message || 'Failed to reject withdrawal');
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
                  <div className="flex gap-2">
                    {withdrawal.receipt && (
                      <Button
                        onClick={() => setViewReceipt(withdrawal.receipt)}
                        variant="outline"
                        size="sm"
                        className="flex-1 min-h-[44px] text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Receipt
                      </Button>
                    )}
                    {withdrawal.status === 'Pending' && (
                      <>
                        <Button
                          onClick={() => {
                            setSelectedWithdrawal(withdrawal);
                            setAdminNote(withdrawal.adminNote || '');
                            setReceiptFile(null);
                            setActionType('approve');
                          }}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white flex-1 min-h-[44px] text-xs"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedWithdrawal(withdrawal);
                            setAdminNote(withdrawal.adminNote || '');
                            setActionType('reject');
                          }}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white flex-1 min-h-[44px] text-xs"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {withdrawal.status === 'Approved' && (
                      <Button
                        onClick={() => {
                          setSelectedWithdrawal(withdrawal);
                          setAdminNote(withdrawal.adminNote || '');
                          setReceiptFile(null);
                          setActionType('approve');
                        }}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white flex-1 min-h-[44px] text-xs"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
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
                        <div className="flex items-center gap-2">
                          {withdrawal.receipt && (
                            <Button
                              onClick={() => setViewReceipt(withdrawal.receipt)}
                              variant="outline"
                              size="sm"
                              className="min-h-[44px]"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Receipt
                            </Button>
                          )}
                          {withdrawal.status === 'Pending' && (
                            <>
                              <Button
                                onClick={() => {
                                  setSelectedWithdrawal(withdrawal);
                                  setAdminNote(withdrawal.adminNote || '');
                                  setReceiptFile(null);
                                  setActionType('approve');
                                }}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white min-h-[44px]"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => {
                                  setSelectedWithdrawal(withdrawal);
                                  setAdminNote(withdrawal.adminNote || '');
                                  setActionType('reject');
                                }}
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white min-h-[44px]"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {withdrawal.status === 'Approved' && (
                            <Button
                              onClick={() => {
                                setSelectedWithdrawal(withdrawal);
                                setAdminNote(withdrawal.adminNote || '');
                                setReceiptFile(null);
                                setActionType('approve');
                              }}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white min-h-[44px]"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
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
                {actionType === 'approve' ? 'Approve Withdrawal' : 'Reject Withdrawal'}
              </h3>
              <Button
                onClick={() => {
                  setSelectedWithdrawal(null);
                  setAdminNote('');
                  setReceiptFile(null);
                  setActionType('approve');
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
                placeholder={actionType === 'approve' ? "Add a note about this withdrawal..." : "Reason for rejection..."}
                leftIcon={<MessageSquare className="w-5 h-5" />}
              />

              {/* Receipt Upload - Only show for approve */}
              {actionType === 'approve' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Receipt (Optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-4 border-2 border-gray-300 dark:border-slate-600 border-dashed rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
                    <div className="space-y-1 text-center w-full">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400 items-center justify-center">
                        <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                          <span>Upload receipt</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, WebP, PDF up to 5MB
                      </p>
                      {receiptFile && (
                        <div className="flex items-center justify-center mt-2">
                          <FileText className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm text-green-600 dark:text-green-400 truncate">
                            {receiptFile.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {actionType === 'reject' && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-700 dark:text-red-400">
                    <strong>Note:</strong> Rejecting this withdrawal will refund the amount back to the user's available balance.
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setSelectedWithdrawal(null);
                    setAdminNote('');
                    setReceiptFile(null);
                    setActionType('approve');
                  }}
                  variant="outline"
                  fullWidth
                >
                  Cancel
                </Button>
                {actionType === 'approve' ? (
                  <Button
                    onClick={() => handleApprove(selectedWithdrawal._id)}
                    loading={processingId === selectedWithdrawal._id}
                    fullWidth
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Paid
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleReject(selectedWithdrawal._id)}
                    loading={processingId === selectedWithdrawal._id}
                    fullWidth
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject & Refund
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Receipt View Modal */}
      {viewReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Payment Receipt
              </h3>
              <Button
                onClick={() => setViewReceipt(null)}
                variant="ghost"
                size="sm"
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {viewReceipt.endsWith('.pdf') ? (
                <iframe
                  src={viewReceipt}
                  className="w-full h-full min-h-[500px] rounded-lg"
                  title="Receipt PDF"
                />
              ) : (
                <img
                  src={viewReceipt}
                  alt="Payment Receipt"
                  className="w-full h-auto rounded-lg"
                />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawalsPage;

