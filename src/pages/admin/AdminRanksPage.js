import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, RefreshCw } from 'lucide-react';
import adminService from '../../services/admin';
import { Button } from '../../components';
import { toast } from 'react-toastify';

const AdminRanksPage = () => {
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRank, setEditingRank] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    reward: '',
    teamSize: '',
    weeklySalary: '',
  });

  useEffect(() => {
    fetchRanks();
  }, []);

  const fetchRanks = async () => {
    setLoading(true);
    try {
      const response = await adminService.getRanks();
      if (response.success) {
        setRanks(response.data?.ranks || []);
      }
    } catch (error) {
      console.error('Error fetching ranks:', error);
      toast.error(error.message || 'Failed to fetch ranks');
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
    setEditingRank(null);
    setFormData({
      name: '',
      reward: '',
      teamSize: '',
      weeklySalary: '',
    });
    setShowModal(true);
  };

  const handleEdit = (rank) => {
    setEditingRank(rank);
    setFormData({
      name: rank.name || '',
      reward: rank.reward || '',
      teamSize: rank.teamSize || '',
      weeklySalary: rank.weeklySalary || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const rankData = {
        name: formData.name,
        reward: parseFloat(formData.reward) || 0,
        teamSize: parseInt(formData.teamSize) || 0,
        weeklySalary: parseFloat(formData.weeklySalary) || 0,
      };

      if (editingRank) {
        await adminService.updateRank(editingRank._id, rankData);
        toast.success('Rank updated successfully');
      } else {
        await adminService.createRank(rankData);
        toast.success('Rank created successfully');
      }
      
      setShowModal(false);
      fetchRanks();
    } catch (error) {
      console.error('Error saving rank:', error);
      toast.error(error.message || 'Failed to save rank');
    }
  };

  const handleDelete = async (rankId) => {
    if (!window.confirm('Are you sure you want to delete this rank?')) {
      return;
    }
    
    try {
      await adminService.deleteRank(rankId);
      toast.success('Rank deleted successfully');
      fetchRanks();
    } catch (error) {
      console.error('Error deleting rank:', error);
      toast.error(error.message || 'Failed to delete rank');
    }
  };

  const handleSeedRanks = async () => {
    if (!window.confirm('This will seed/update all default ranks. Continue?')) {
      return;
    }
    
    try {
      await adminService.seedRanks();
      toast.success('Ranks seeded successfully');
      fetchRanks();
    } catch (error) {
      console.error('Error seeding ranks:', error);
      toast.error(error.message || 'Failed to seed ranks');
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ranks Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage user ranks and rewards</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSeedRanks}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <RefreshCw className="w-4 h-4" />
            Seed Default Ranks
          </Button>
          <Button
            onClick={handleCreate}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Rank
          </Button>
        </div>
      </div>

      {/* Ranks Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rank Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reward ($)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Team Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Weekly Salary ($)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {ranks.length > 0 ? (
                ranks.map((rank) => (
                  <tr key={rank._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{rank.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${rank.reward}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{rank.teamSize}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${rank.weeklySalary}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(rank)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(rank._id)}
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
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No ranks found
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
              className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingRank ? 'Edit Rank' : 'Create New Rank'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Rank Name *
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
                      Reward ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="reward"
                      value={formData.reward}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Team Size Required *
                    </label>
                    <input
                      type="number"
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Weekly Salary ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="weeklySalary"
                      value={formData.weeklySalary}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
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
                      {editingRank ? 'Update Rank' : 'Create Rank'}
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

export default AdminRanksPage;

