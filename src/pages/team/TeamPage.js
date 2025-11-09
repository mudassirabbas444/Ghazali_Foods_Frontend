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
} from 'lucide-react';
import dashboardService from '../../services/dashboard';

const TeamPage = () => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedLevels, setExpandedLevels] = useState({
    level1: true,
    level2: false,
    level3: false,
    level4: false,
  });

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getTeam();
      if (response.success) {
        setTeamData(response.data);
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
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
      color: 'indigo',
      icon: Users,
    },
    {
      key: 'level2',
      name: 'Level 2',
      members: teamData?.level2 || [],
      color: 'purple',
      icon: TrendingUp,
    },
    {
      key: 'level3',
      name: 'Level 3',
      members: teamData?.level3 || [],
      color: 'emerald',
      icon: UserPlus,
    },
    {
      key: 'level4',
      name: 'Level 4',
      members: teamData?.level4 || [],
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {levels.map((level) => (
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
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                {level.name}
              </p>
            </motion.div>
          ))}
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {level.members.map((member) => (
                              <motion.div
                                key={member._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-slate-600"
                              >
                                <div className="flex items-start justify-between mb-2 sm:mb-3">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 truncate">
                                      {member.fullName || 'N/A'}
                                    </h4>
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

