import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Users, ArrowRight, Sparkles } from 'lucide-react';
import investmentService from '../../services/investment';
import { Button } from '../../components';

const PlansPage = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await investmentService.getPlans();
      if (response.success) {
        setPlans(response.plans || []);
      } else {
        setError(response.message || 'Failed to fetch plans');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyPlan = (planId) => {
    navigate(`/buy-plan/${planId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full shadow-lg">
          <p className="text-red-500 text-center">{error}</p>
          <Button onClick={fetchPlans} className="mt-4 w-full">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
            Investment Packages
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 px-4">
            Choose the perfect plan to start your investment journey
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-slate-700"
            >
              <div className="p-4 sm:p-6">
                {/* Plan Header */}
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    ${plan.amount}
                  </div>
                </div>

                {/* Plan Details */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Daily Earning
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                      ${plan.dailyEarning}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Level 1 Bonus
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-emerald-500">
                      ${plan.level1Bonus || 0}
                    </span>
                  </div>
                </div>

                {/* Buy Button */}
                <Button
                  onClick={() => handleBuyPlan(plan._id)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm sm:text-base min-h-[44px]"
                >
                  Invest Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {plans.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No investment plans available at the moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansPage;

