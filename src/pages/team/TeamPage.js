import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  ChevronDown,
  ChevronRight,
  Mail,
  Calendar,
  UserPlus,
  TrendingUp,
  CheckCircle,
  XCircle,
  Loader,
} from 'lucide-react';
import dashboardService from '../../services/dashboard';

const TeamPage = () => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState({});
  const [pagination, setPagination] = useState({
    level1: { page: 1, limit: 50 },
    level2: { page: 1, limit: 50 },
    level3: { page: 1, limit: 50 },
    level4: { page: 1, limit: 50 },
  });
  const [expandedLevels, setExpandedLevels] = useState({
    level1: true,
    level2: false,
    level3: false,
    level4: false,
  });

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async (loadMoreLevel = null) => {
    try {
      if (loadMoreLevel) {
        setLoadingMore(prev => ({ ...prev, [loadMoreLevel]: true }));
      } else {
        setLoading(true);
      }

      const response = await dashboardService.getTeam(pagination);
      if (response.success) {
        if (loadMoreLevel) {
          // Append new data for the specific level
          setTeamData(prev => ({
            ...prev,
            [loadMoreLevel]: [...(prev?.[loadMoreLevel] || []), ...(response.data[loadMoreLevel] || [])],
            pagination: response.data.pagination,
            summary: response.data.summary,
          }));
        } else {
          // Initial load
          setTeamData(response.data);
        }
        
        // Update pagination state
        if (response.data.pagination) {
          setPagination(prev => {
            const updated = { ...prev };
            Object.keys(response.data.pagination).forEach(level => {
              if (response.data.pagination[level]) {
                updated[level] = {
                  page: response.data.pagination[level].page,
                  limit: response.data.pagination[level].limit,
                };
              }
            });
            return updated;
          });
        }
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      if (loadMoreLevel) {
        setLoadingMore(prev => ({ ...prev, [loadMoreLevel]: false }));
      } else {
        setLoading(false);
      }
    }
  };

  const loadMore = async (level) => {
    try {
      setLoadingMore(prev => ({ ...prev, [level]: true }));
      
      const currentPage = pagination[level].page;
      const nextPage = currentPage + 1;
      const paginationParams = {
        [level]: {
          page: nextPage,
          limit: pagination[level].limit
        }
      };
      
      const response = await dashboardService.getTeam(paginationParams);
      
      if (response.success) {
        setTeamData(prev => ({
          ...prev,
          [level]: [...(prev?.[level] || []), ...(response.data[level] || [])],
          pagination: response.data.pagination,
        }));
        
        setPagination(prev => ({
          ...prev,
          [level]: { ...prev[level], page: nextPage }
        }));
      }
    } catch (error) {
      console.error(`Error loading more ${level}:`, error);
    } finally {
      setLoadingMore(prev => ({ ...prev, [level]: false }));
    }
  };

  const toggleLevel = (level) => {
    setExpandedLevels((prev) => ({
      ...prev,
      [level]: !prev[level],
    }));
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

  const levels = [
    {
      key: 'level1',
      name: 'Level 1 (Direct)',
      members: teamData?.level1 || [],
      pagination: teamData?.pagination?.level1,
      color: 'indigo',
      icon: Users,
    },
    {
      key: 'level2',
      name: 'Level 2',
      members: teamData?.level2 || [],
      pagination: teamData?.pagination?.level2,
      color: 'purple',
      icon: TrendingUp,
    },
    {
      key: 'level3',
      name: 'Level 3',
      members: teamData?.level3 || [],
      pagination: teamData?.pagination?.level3,
      color: 'emerald',
      icon: UserPlus,
    },
    {
      key: 'level4',
      name: 'Level 4',
      members: teamData?.level4 || [],
      pagination: teamData?.pagination?.level4,
      color: 'blue',
      icon: Users,
    },
  ];

  const colorClasses = {
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      border: 'border-indigo-200 dark:border-indigo-800',
      text: 'text-indigo-700 dark:text-indigo-400',
      icon: 'text-indigo-600 dark:text-indigo-400',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-700 dark:text-purple-400',
      icon: 'text-purple-600 dark:text-purple-400',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-700 dark:text-emerald-400',
      icon: 'text-emerald-600 dark:text-emerald-400',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-700 dark:text-blue-400',
      icon: 'text-blue-600 dark:text-blue-400',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Team
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            View your referral network across all levels
          </p>
        </motion.div>

        {/* Team Summary */}
        {teamData?.summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
              Team Overview
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {teamData.summary.total || 0}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Total Members</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {teamData.summary.active || 0}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Active</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">
                  {teamData.summary.inactive || 0}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Inactive</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Level Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {levels.map((level) => {
            const activeCount = level.members.filter(m => m.isActive).length;
            const inactiveCount = level.members.length - activeCount;
            return (
              <motion.div
                key={level.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-3 sm:p-4 md:p-6 ${colorClasses[level.color].bg} ${colorClasses[level.color].border} border-2`}
              >
                <div className="flex items-center justify-between mb-2">
                  <level.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colorClasses[level.color].icon}`} />
                  <span className={`text-xl sm:text-2xl font-bold ${colorClasses[level.color].text}`}>
                    {level.members.length}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {level.name}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    {activeCount} active
                  </span>
                  {inactiveCount > 0 && (
                    <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                      {inactiveCount} inactive
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Team Levels */}
        <div className="space-y-4">
          {levels.map((level, index) => {
            const colors = colorClasses[level.color];
            const isExpanded = expandedLevels[level.key];

            return (
              <motion.div
                key={level.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
              >
                {/* Level Header */}
                <button
                  onClick={() => toggleLevel(level.key)}
                  className={`w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between ${colors.bg} hover:opacity-90 transition-opacity min-h-[44px] active:opacity-75`}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    {isExpanded ? (
                      <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.icon} mr-2 sm:mr-3 flex-shrink-0`} />
                    ) : (
                      <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.icon} mr-2 sm:mr-3 flex-shrink-0`} />
                    )}
                    <level.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.icon} mr-2 sm:mr-3 flex-shrink-0`} />
                    <h3 className={`text-sm sm:text-base md:text-lg font-bold ${colors.text} truncate`}>
                      {level.name}
                    </h3>
                    <span className={`ml-2 sm:ml-3 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${colors.bg} ${colors.text} border ${colors.border} flex-shrink-0`}>
                      {level.members.length}
                    </span>
                  </div>
                </button>

                {/* Level Members */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 sm:p-6">
                        {level.members.length === 0 ? (
                          <p className="text-gray-500 dark:text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">
                            No members in this level yet
                          </p>
                        ) : (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                              {level.members.map((member) => (
                                <motion.div
                                  key={member._id}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className={`bg-gray-50 dark:bg-slate-700 rounded-lg p-3 sm:p-4 border ${
                                    member.isActive 
                                      ? 'border-emerald-200 dark:border-emerald-800' 
                                      : 'border-gray-200 dark:border-slate-600'
                                  }`}
                                >
                                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                                          {member.fullName || 'N/A'}
                                        </h4>
                                        {member.isActive ? (
                                          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                        ) : (
                                          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                          member.isActive
                                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                        }`}>
                                          {member.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                      </div>
                                      <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                                        <span className="truncate">{member.email || 'N/A'}</span>
                                      </div>
                                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                                        <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                                        <span className="truncate">Joined: {formatDate(member.joinDate || member.createdAt)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                            {level.pagination && level.pagination.hasMore && (
                              <div className="mt-4 sm:mt-6 flex justify-center">
                                <button
                                  onClick={() => loadMore(level.key)}
                                  disabled={loadingMore[level.key]}
                                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                                    loadingMore[level.key]
                                      ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                      : `${colorClasses[level.color].bg} ${colorClasses[level.color].text} ${colorClasses[level.color].border} border-2 hover:opacity-90`
                                  }`}
                                >
                                  {loadingMore[level.key] ? (
                                    <span className="flex items-center gap-2">
                                      <Loader className="w-4 h-4 animate-spin" />
                                      Loading...
                                    </span>
                                  ) : (
                                    `Load More (${level.pagination.total - level.members.length} remaining)`
                                  )}
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;

