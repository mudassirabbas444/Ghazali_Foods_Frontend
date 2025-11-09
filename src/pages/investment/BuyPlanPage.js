import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Upload, DollarSign, FileText, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import investmentService from '../../services/investment';
import { Button, Input } from '../../components';
import { ROUTES } from '../../constants';

const BuyPlanPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const fetchPlan = useCallback(async () => {
    try {
      setLoading(true);
      const response = await investmentService.getPlans();
      if (response.success) {
        const foundPlan = response.plans?.find(p => p._id === id);
        if (foundPlan) {
          setPlan(foundPlan);
        } else {
          setError('Plan not found');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch plan');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Only JPEG, PNG, WebP images and PDF files are allowed.');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setReceiptFile(file);
      setError(null);
    }
  };

  const onSubmit = async (data) => {
    if (!receiptFile) {
      setError('Please upload a payment receipt');
      return;
    }

    if (parseFloat(data.amount) !== plan.amount) {
      setError(`Investment amount must be exactly $${plan.amount}`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await investmentService.createInvestment(
        plan._id,
        data.amount,
        receiptFile
      );

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(ROUTES.MY_INVESTMENTS);
        }, 2000);
      } else {
        setError(response.message || 'Failed to create investment');
      }
    } catch (err) {
      setError(err.message || 'Failed to create investment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{error || 'Plan not found'}</p>
          <Button onClick={() => navigate(ROUTES.PLANS)} className="mt-4">
            Back to Plans
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6 md:p-8"
        >
          {/* Header */}
          <div className="flex items-center mb-4 sm:mb-6">
            <Button
              onClick={() => navigate(ROUTES.PLANS)}
              variant="ghost"
              className="mr-2 sm:mr-4 p-2"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Invest in {plan.name}
            </h1>
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
                  Investment created successfully! Redirecting...
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
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Plan Summary */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="mb-3 sm:mb-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Investment Package</p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  ${plan.amount}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Investment Amount</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Daily Earning</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  ${plan.dailyEarning}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Level 1 Bonus</p>
                <p className="text-base sm:text-lg font-semibold text-emerald-500">
                  ${plan.level1Bonus || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <Input
              label="Investment Amount"
              type="number"
              step="0.01"
              defaultValue={plan.amount}
              leftIcon={<DollarSign className="w-5 h-5" />}
              error={errors.amount?.message}
              disabled
              {...register('amount', {
                required: 'Amount is required',
                value: plan.amount,
              })}
            />

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Receipt <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 border-2 border-gray-300 dark:border-slate-600 border-dashed rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
                <div className="space-y-1 text-center w-full">
                  <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                  <div className="flex flex-col sm:flex-row text-xs sm:text-sm text-gray-600 dark:text-gray-400 items-center justify-center">
                    <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-0 sm:pl-1 mt-1 sm:mt-0">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 px-2">
                    PNG, JPG, WebP, PDF up to 5MB
                  </p>
                  {receiptFile && (
                    <div className="flex items-center justify-center mt-2 px-2">
                      <FileText className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-green-600 dark:text-green-400 truncate max-w-full">
                        {receiptFile.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={submitting}
              disabled={submitting || !receiptFile}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white min-h-[44px] text-sm sm:text-base"
            >
              Submit Investment Request
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default BuyPlanPage;

