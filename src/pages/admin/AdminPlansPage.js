import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Plus, Edit, Trash2, X, Save } from 'lucide-react';
import adminService from '../../services/admin';
import { Button } from '../../components';
import { toast } from 'react-toastify';

const AdminPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    dailyEarning: '',
    level1Bonus: '',
    level1DailyShare: '',
    level2Bonus: '',
    level2DailyShare: '',
    level3Bonus: '',
    level3DailyShare: '',
    level4Bonus: '',
    level4DailyShare: '',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await adminService.getPlans();
      if (response.success) {
        setPlans(response.data?.plans || []);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error(error.message || 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreate = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      amount: '',
      dailyEarning: '',
      level1Bonus: '',
      level1DailyShare: '',
      level2Bonus: '',
      level2DailyShare: '',
      level3Bonus: '',
      level3DailyShare: '',
      level4Bonus: '',
      level4DailyShare: '',
    });
    setShowModal(true);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name || '',
      amount: plan.amount || '',
      dailyEarning: plan.dailyEarning || '',
      level1Bonus: plan.level1Bonus || '',
      level1DailyShare: plan.level1DailyShare || '',
      level2Bonus: plan.level2Bonus || '',
      level2DailyShare: plan.level2DailyShare || '',
      level3Bonus: plan.level3Bonus || '',
      level3DailyShare: plan.level3DailyShare || '',
      level4Bonus: plan.level4Bonus || '',
      level4DailyShare: plan.level4DailyShare || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const planData = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        dailyEarning: parseFloat(formData.dailyEarning),
        level1Bonus: parseFloat(formData.level1Bonus) || 0,
        level1DailyShare: parseFloat(formData.level1DailyShare) || 0,
        level2Bonus: parseFloat(formData.level2Bonus) || 0,
        level2DailyShare: parseFloat(formData.level2DailyShare) || 0,
        level3Bonus: parseFloat(formData.level3Bonus) || 0,
        level3DailyShare: parseFloat(formData.level3DailyShare) || 0,
        level4Bonus: parseFloat(formData.level4Bonus) || 0,
        level4DailyShare: parseFloat(formData.level4DailyShare) || 0,
      };

      if (editingPlan) {
        await adminService.updatePlan(editingPlan._id, planData);
        toast.success('Plan updated successfully');
      } else {
        await adminService.createPlan(planData);
        toast.success('Plan created successfully');
      }
      
      setShowModal(false);
      fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error(error.message || 'Failed to save plan');
    }
  };

  const handleDelete = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) {
      return;
    }
    
    try {
      await adminService.deletePlan(planId);
      toast.success('Plan deleted successfully');
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error(error.message || 'Failed to delete plan');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Plans Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage investment plans</p>
        </div>
        <Button
          onClick={handleCreate}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Plan
        </Button>
      </div>

      {/* Plans Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Daily Earning</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Level 1</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Level 2</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Level 3</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Level 4</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {plans.length > 0 ? (
                plans.map((plan) => (
                  <tr key={plan._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{plan.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${plan.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${plan.level1Bonus}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>Daily: ${plan.level1Bonus}</div>
                      <div>Mining Income: ${plan.level1DailyShare}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>Daily: ${plan.level2Bonus}</div>
                      <div>Mining Income: ${plan.level2DailyShare}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>Daily: ${plan.level3Bonus}</div>
                      <div>Mining Income: ${plan.level3DailyShare}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>Daily: ${plan.level4Bonus}</div>
                      <div>Mining Income: ${plan.level4DailyShare}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(plan)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan._id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No plans found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingPlan ? 'Edit Plan' : 'Create New Plan'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Plan Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Amount ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Daily Earning ($) *
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        name="dailyEarning"
                        value={formData.dailyEarning}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Level Bonuses & Daily Shares</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((level) => (
                        <div key={level} className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Level {level}</h4>
                          <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Bonus ($)</label>
                            <input
                              type="number"
                              step="0.01"
                              name={`level${level}Bonus`}
                              value={formData[`level${level}Bonus`]}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Daily Share ($)</label>
                            <input
                              type="number"
                              step="0.001"
                              name={`level${level}DailyShare`}
                              value={formData[`level${level}DailyShare`]}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      {editingPlan ? 'Update Plan' : 'Create Plan'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPlansPage;

