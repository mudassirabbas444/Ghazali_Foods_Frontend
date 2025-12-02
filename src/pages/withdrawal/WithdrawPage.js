import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Wallet, ArrowRight, Clock, CheckCircle, XCircle, DollarSign, History, Eye, X, Info } from 'lucide-react';
import withdrawalService from '../../services/withdrawal';
import dashboardService from '../../services/dashboard';
import investmentService from '../../services/investment';
import { Button, Input } from '../../components';

const WithdrawPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [paymentAccounts, setPaymentAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [viewReceipt, setViewReceipt] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  
  const selectedMethod = watch('method');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, withdrawalsRes, accountsRes] = await Promise.all([
        dashboardService.getDashboard(),
        withdrawalService.getMyWithdrawals(),
        investmentService.getPaymentAccounts(),
      ]);

      if (dashboardRes.success) {
        setAvailableBalance(dashboardRes.data?.availableBalance || 0);
      }

      if (withdrawalsRes.success) {
        setWithdrawals(withdrawalsRes.withdrawals || []);
      }

      if (accountsRes.success) {
        setPaymentAccounts(accountsRes.accounts || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update selected account when payment method changes
  useEffect(() => {
    if (selectedMethod) {
      const account = paymentAccounts.find(acc => acc._id === selectedMethod);
      setSelectedAccount(account || null);
    } else {
      setSelectedAccount(null);
    }
  }, [selectedMethod, paymentAccounts]);

  const checkWithdrawalRestrictions = () => {
    // Get current time in Pakistani time zone (Asia/Karachi, UTC+5)
    const now = new Date();
    
    // Convert to Pakistani time using Intl.DateTimeFormat
    const pakistaniTimeFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const parts = pakistaniTimeFormatter.formatToParts(now);
    const pakistaniDate = {
      year: parseInt(parts.find(p => p.type === 'year').value),
      month: parseInt(parts.find(p => p.type === 'month').value) - 1, // Month is 0-indexed
      day: parseInt(parts.find(p => p.type === 'day').value),
      hour: parseInt(parts.find(p => p.type === 'hour').value),
      minute: parseInt(parts.find(p => p.type === 'minute').value),
    };
    
    // Create a date object from Pakistani time components to get day of week
    const pakistaniDateObj = new Date(
      pakistaniDate.year,
      pakistaniDate.month,
      pakistaniDate.day,
      pakistaniDate.hour,
      pakistaniDate.minute
    );
    
    const dayOfWeek = pakistaniDateObj.getDay(); // 0 = Sunday
    
    // Check if it's Sunday
    if (dayOfWeek === 0) {
      return 'Withdrawals are not allowed on Sundays. Please try again on Monday.';
    }

    // Check withdrawal time (9 AM to 12 AM) in Pakistani time zone
    const currentHour = pakistaniDate.hour;
    const currentMinute = pakistaniDate.minute;
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    const startTimeInMinutes = 9 * 60; // 9 AM = 540 minutes

    if (currentTimeInMinutes < startTimeInMinutes) {
      return 'Withdrawals are only allowed from 9 AM to 12 AM (midnight) Pakistan Standard Time. Please try again after 9 AM PKT.';
    }

    return null;
  };

  const onSubmit = async (data) => {
    // Check withdrawal restrictions
    const restrictionError = checkWithdrawalRestrictions();
    if (restrictionError) {
      setError(restrictionError);
      return;
    }

    const amount = parseFloat(data.amount);
    
    if (amount > availableBalance) {
      setError('Insufficient balance');
      return;
    }

    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    // Get limits from selected account
    const account = paymentAccounts.find(acc => acc._id === data.method);
    const minLimit = account?.minLimit || 1;
    const maxLimit = account?.maxLimit;

    if (amount < minLimit) {
      setError(`Minimum withdrawal amount is $${minLimit.toFixed(2)}`);
      return;
    }

    if (maxLimit && amount > maxLimit) {
      setError(`Maximum withdrawal amount is $${maxLimit.toFixed(2)}`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(false);

      const response = await withdrawalService.createWithdrawal(
        parseFloat(data.amount),
        data.method,
        data.accountDetails
      );

      if (response.success) {
        setSuccess(true);
        reset();
        fetchData(); // Refresh data
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.message || 'Failed to create withdrawal request');
      }
    } catch (err) {
      setError(err.message || 'Failed to create withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: {
        icon: Clock,
        bg: 'bg-amber-100 dark:bg-amber-900/20',
        text: 'text-amber-700 dark:text-amber-400',
      },
      Approved: {
        icon: CheckCircle,
        bg: 'bg-green-100 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-400',
      },
      Paid: {
        icon: CheckCircle,
        bg: 'bg-emerald-100 dark:bg-emerald-900/20',
        text: 'text-emerald-700 dark:text-emerald-400',
      },
      Rejected: {
        icon: XCircle,
        bg: 'bg-red-100 dark:bg-red-900/20',
        text: 'text-red-700 dark:text-red-400',
      },
    };

    const config = statusConfig[status] || statusConfig.Pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Withdraw Funds
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Request withdrawal from your available balance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Withdrawal Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6 md:p-8"
            >
              {/* Available Balance */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Available Balance
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      ${availableBalance.toFixed(2)}
                    </p>
                  </div>
                  <Wallet className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500 flex-shrink-0" />
                </div>
              </div>

              {/* Withdrawal Limits Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                    <p className="font-semibold mb-1">Withdrawal Limits:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400">
                      {selectedAccount ? (
                        <>
                          <li>Minimum withdrawal amount: ${selectedAccount.minLimit?.toFixed(2) || '1.00'}</li>
                          {selectedAccount.maxLimit ? (
                            <li>Maximum withdrawal amount: ${selectedAccount.maxLimit.toFixed(2)}</li>
                          ) : (
                            <li>No maximum limit</li>
                          )}
                        </>
                      ) : (
                        <li>Select a payment method to see limits</li>
                      )}
                      <li>One withdrawal request per 24 hours</li>
                      <li>Withdrawals allowed: Monday to Saturday, 9 AM to 12 AM (midnight) Pakistan Standard Time (PKT)</li>
                      <li>No withdrawals on Sundays</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Approval Notice */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-800 dark:text-amber-300">
                    <p className="font-semibold mb-1">Processing Time:</p>
                    <p className="text-amber-700 dark:text-amber-400">
                      Your withdrawal request will be reviewed and approved within 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <p className="text-green-700 dark:text-green-400">
                      Withdrawal request submitted successfully!
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
                >
                  <p className="text-red-700 dark:text-red-400">{error}</p>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <Input
                  label="Amount"
                  type="number"
                  step="0.01"
                  placeholder="Enter withdrawal amount"
                  leftIcon={<DollarSign className="w-5 h-5" />}
                  error={errors.amount?.message}
                  {...register('amount', {
                    required: 'Amount is required',
                    min: {
                      value: selectedAccount?.minLimit || 1,
                      message: `Minimum withdrawal amount is $${(selectedAccount?.minLimit || 1).toFixed(2)}`,
                    },
                    max: {
                      value: selectedAccount?.maxLimit 
                        ? Math.min(selectedAccount.maxLimit, availableBalance)
                        : availableBalance,
                      message: selectedAccount?.maxLimit
                        ? `Amount cannot exceed $${Math.min(selectedAccount.maxLimit, availableBalance).toFixed(2)}`
                        : `Amount cannot exceed available balance ($${availableBalance.toFixed(2)})`,
                    },
                  })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('method', { required: 'Payment method is required' })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[44px] text-base"
                  >
                    <option value="">Select payment method</option>
                    {paymentAccounts.map((account) => (
                      <option key={account._id} value={account._id}>
                        {account.name} ({account.type})
                      </option>
                    ))}
                  </select>
                  {errors.method && (
                    <p className="mt-1 text-sm text-red-500">{errors.method.message}</p>
                  )}
                  {selectedAccount && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Account: {selectedAccount.accountNumber}
                      {selectedAccount.accountHolderName && ` - ${selectedAccount.accountHolderName}`}
                    </p>
                  )}
                </div>

                <Input
                  label="Account Details"
                  type="text"
                  placeholder="Enter your account/wallet details"
                  error={errors.accountDetails?.message}
                  {...register('accountDetails', {
                    required: 'Account details are required',
                    minLength: {
                      value: 5,
                      message: 'Account details must be at least 5 characters',
                    },
                  })}
                />

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={submitting}
                  disabled={submitting || availableBalance <= 0}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white min-h-[44px] text-sm sm:text-base"
                >
                  Submit Withdrawal Request
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </form>
            </motion.div>
          </div>

          {/* Withdrawal History */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6"
            >
              <div className="flex items-center mb-3 sm:mb-4">
                <History className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 mr-2" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Recent Withdrawals
                </h3>
              </div>

              {withdrawals.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No withdrawal history
                </p>
              ) : (
                <div className="space-y-4">
                  {withdrawals.slice(0, 5).map((withdrawal) => (
                    <div
                      key={withdrawal._id}
                      className="border-b border-gray-200 dark:border-slate-700 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          ${withdrawal.amount}
                        </span>
                        {getStatusBadge(withdrawal.status)}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {formatDate(withdrawal.createdAt)}
                      </p>
                      {withdrawal.receipt && withdrawal.status === 'Paid' && (
                        <button
                          onClick={() => setViewReceipt(withdrawal.receipt)}
                          className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                        >
                          <Eye className="w-3 h-3" />
                          View Receipt
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

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
              <button
                onClick={() => setViewReceipt(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
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

export default WithdrawPage;

