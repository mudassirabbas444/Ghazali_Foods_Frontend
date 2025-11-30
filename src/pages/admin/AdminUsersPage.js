import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Eye,
  X,
} from 'lucide-react';
import adminService from '../../services/admin';
import { Button } from '../../components';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    minInvestment: '',
    maxInvestment: '',
    minEarnings: '',
    maxEarnings: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userEarnings, setUserEarnings] = useState(null);
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [userTeam, setUserTeam] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersPage, filters.search, filters.sortBy, filters.sortOrder, filters.minInvestment, filters.maxInvestment, filters.minEarnings, filters.maxEarnings]);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await adminService.getUsers(usersPage, 20, filters);
      if (response.success) {
        setUsers(response.data?.users || []);
        setUsersTotal(response.data?.total || 0);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setUsersPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      minInvestment: '',
      maxInvestment: '',
      minEarnings: '',
      maxEarnings: '',
    });
    setUsersPage(1);
  };

  const handleViewEarnings = async (user) => {
    try {
      if (!user || !user._id) {
        alert('Invalid user data');
        return;
      }
      setSelectedUser(user);
      const response = await adminService.getUserEarnings(user._id, 1, 10);
      if (response.success) {
        setUserEarnings(response.data);
        setShowEarningsModal(true);
      } else {
        alert(response.message || 'Failed to fetch user earnings');
      }
    } catch (err) {
      console.error('Error fetching user earnings:', err);
      alert(err.message || 'Failed to fetch user earnings');
    }
  };

  const handleViewTeam = async (user) => {
    try {
      if (!user || !user._id) {
        alert('Invalid user data');
        return;
      }
      setSelectedUser(user);
      const response = await adminService.getUserTeam(user._id);
      if (response.success) {
        setUserTeam(response.data);
        setShowTeamModal(true);
      } else {
        alert(response.message || 'Failed to fetch user team');
      }
    } catch (err) {
      console.error('Error fetching user team:', err);
      alert(err.message || 'Failed to fetch user team');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          User Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage all platform users
        </p>
      </div>

      {/* Users Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              All Users
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Total: {usersTotal} users
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/30 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Name, email, phone, refCode"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="createdAt">Join Date</option>
                    <option value="totalInvestment">Total Investment</option>
                    <option value="totalEarnings">Total Earnings</option>
                    <option value="teamCount">Team Count</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Order
                  </label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Investment Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.minInvestment}
                      onChange={(e) => handleFilterChange('minInvestment', e.target.value)}
                      placeholder="Min"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="number"
                      value={filters.maxInvestment}
                      onChange={(e) => handleFilterChange('maxInvestment', e.target.value)}
                      placeholder="Max"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Earnings Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.minEarnings}
                      onChange={(e) => handleFilterChange('minEarnings', e.target.value)}
                      placeholder="Min"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="number"
                      value={filters.maxEarnings}
                      onChange={(e) => handleFilterChange('maxEarnings', e.target.value)}
                      placeholder="Max"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                  </div>
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
          )}
        </AnimatePresence>

        {/* Users Table */}
        {usersLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Ref Code</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Investment</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Earnings</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Team</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {user.fullName || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600 dark:text-gray-400">
                      {user.refCode}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      ${(user.totalInvestment || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                      ${(user.totalEarnings || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {user.teamCount || 0}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleViewTeam(user)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View Team
                        </button>
                        <button
                          onClick={() => handleViewEarnings(user)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/30 transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View Earnings
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to delete user "${user.fullName}"? This action cannot be undone.`)) {
                              try {
                                const response = await adminService.deleteUser(user._id);
                                if (response.success) {
                                  alert('User deleted successfully');
                                  fetchUsers();
                                } else {
                                  alert(response.message || 'Failed to delete user');
                                }
                              } catch (err) {
                                console.error('Error deleting user:', err);
                                alert(err.message || 'Failed to delete user');
                              }
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors text-sm"
                        >
                          <X className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No users found
          </div>
        )}

        {/* Pagination */}
        {usersTotal > 20 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Page {usersPage} of {Math.ceil(usersTotal / 20)}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setUsersPage(prev => Math.max(1, prev - 1))}
                disabled={usersPage === 1}
                className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
              >
                Previous
              </Button>
              <Button
                onClick={() => setUsersPage(prev => Math.min(Math.ceil(usersTotal / 20), prev + 1))}
                disabled={usersPage >= Math.ceil(usersTotal / 20)}
                className="px-4 py-2 bg-indigo-600 text-white disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* User Earnings Modal */}
      <AnimatePresence>
        {showEarningsModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEarningsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Earnings Details
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedUser?.fullName || 'N/A'} ({selectedUser?.email || 'N/A'})
                  </p>
                </div>
                <button
                  onClick={() => setShowEarningsModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {userEarnings ? (
                  <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Earnings</p>
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          ${(selectedUser?.totalEarnings || 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Transactions</p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          {userEarnings?.earnings?.total || 0}
                        </p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Daily Records</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {userEarnings?.dailyEarnings?.total || 0}
                        </p>
                      </div>
                    </div>

                    {/* Recent Earnings */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Recent Earnings
                      </h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {userEarnings?.earnings?.earnings && Array.isArray(userEarnings.earnings.earnings) && userEarnings.earnings.earnings.length > 0 ? (
                          userEarnings.earnings.earnings.map((earning) => (
                            <div
                              key={earning._id}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {earning?.type || 'N/A'}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {earning?.createdAt ? new Date(earning.createdAt).toLocaleString() : 'N/A'}
                                </p>
                                {earning?.description && (
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                    {earning.description}
                                  </p>
                                )}
                              </div>
                              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                +${(earning?.amount || 0).toFixed(2)}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                            No earnings found
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Daily Earnings */}
                    {userEarnings?.dailyEarnings?.records && Array.isArray(userEarnings.dailyEarnings.records) && userEarnings.dailyEarnings.records.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Daily Earnings Breakdown
                        </h4>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {userEarnings.dailyEarnings.records.slice(0, 10).map((record, index) => (
                            <div
                              key={record?.date || index}
                              className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {record?.date ? new Date(record.date).toLocaleDateString() : 'N/A'}
                                </p>
                                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                  ${(record?.total || 0).toFixed(2)}
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {record?.breakdown && typeof record.breakdown === 'object' && Object.entries(record.breakdown).map(([type, amount]) => (
                                  <div key={type} className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400 capitalize">{type}:</span>
                                    <span className="text-gray-900 dark:text-white">${(amount || 0).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Loading earnings data...
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Team Modal */}
      <AnimatePresence>
        {showTeamModal && selectedUser && userTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowTeamModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Team Details
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedUser?.fullName || 'N/A'} ({selectedUser?.email || 'N/A'})
                  </p>
                </div>
                <button
                  onClick={() => setShowTeamModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Direct Upline */}
                  {userTeam.directUpline && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Direct Upline
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                          <p className="font-medium text-gray-900 dark:text-white">{userTeam.directUpline.fullName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                          <p className="font-medium text-gray-900 dark:text-white">{userTeam.directUpline.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Ref Code</p>
                          <p className="font-mono font-medium text-gray-900 dark:text-white">{userTeam.directUpline.refCode}</p>
                        </div>
                        {userTeam.directUpline.phone && (
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                            <p className="font-medium text-gray-900 dark:text-white">{userTeam.directUpline.phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Team Summary */}
                  {userTeam.summary && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Team</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {userTeam.summary.total || 0}
                        </p>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Members</p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          {userTeam.summary.active || 0}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Inactive Members</p>
                        <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                          {userTeam.summary.inactive || 0}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Level Stats */}
                  {userTeam.levelStats && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Level Statistics
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {['level1', 'level2', 'level3', 'level4'].map((level) => {
                          const stats = userTeam.levelStats[level] || { total: 0, active: 0, inactive: 0 };
                          return (
                            <div key={level} className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2 capitalize">
                                {level.replace('level', 'Level ')}
                              </p>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Total:</span>
                                  <span className="font-medium text-gray-900 dark:text-white">{stats.total}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-emerald-600 dark:text-emerald-400">Active:</span>
                                  <span className="font-medium text-emerald-600 dark:text-emerald-400">{stats.active}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-500">Inactive:</span>
                                  <span className="font-medium text-gray-500 dark:text-gray-500">{stats.inactive}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Team Members by Level */}
                  {['level1', 'level2', 'level3', 'level4'].map((level) => {
                    const levelData = userTeam[level];
                    if (!levelData || !levelData.members || levelData.members.length === 0) return null;

                    return (
                      <div key={level} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 capitalize">
                          {level.replace('level', 'Level ')} Members ({levelData.members.length})
                        </h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {levelData.members.map((member, index) => (
                            <div
                              key={member._id || index}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {member.fullName || 'N/A'}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {member.email || 'N/A'} • Joined: {member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'}
                                </p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                member.isActive
                                  ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                              }`}>
                                {member.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsersPage;

