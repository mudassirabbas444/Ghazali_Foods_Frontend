import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Eye,
  X,
  Search,
  Filter,
} from 'lucide-react';
import supportService from '../../services/support';
import { Button, Input } from '../../components';
import { useApp } from '../../context/AppContext';

const AdminSupportPage = () => {
  const { addNotification } = useApp();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [status, setStatus] = useState('Open');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchTickets();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page, search]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const statusFilter = filter !== 'all' ? filter : null;
      const response = await supportService.getAllSupport(page, 20, statusFilter, null, search || null);
      if (response.success) {
        setTickets(response.data?.supports || []);
        setTotalPages(response.data?.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load support tickets',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await supportService.getSupportStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleRespond = async () => {
    if (!adminResponse.trim()) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Please enter a response',
      });
      return;
    }

    try {
      const response = await supportService.respondToSupport(
        selectedTicket._id,
        adminResponse,
        status
      );

      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Response sent successfully',
        });
        setSelectedTicket(null);
        setAdminResponse('');
        setStatus('Open');
        fetchTickets();
        fetchStats();
      } else {
        addNotification({
          type: 'error',
          title: 'Error',
          message: response.message || 'Failed to send response',
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to send response',
      });
    }
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      const response = await supportService.updateSupportStatus(ticketId, newStatus);
      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Status updated successfully',
        });
        fetchTickets();
        fetchStats();
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to update status',
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Open: {
        icon: Clock,
        bg: 'bg-amber-100 dark:bg-amber-900/20',
        text: 'text-amber-700 dark:text-amber-400',
      },
      'In Progress': {
        icon: AlertCircle,
        bg: 'bg-blue-100 dark:bg-blue-900/20',
        text: 'text-blue-700 dark:text-blue-400',
      },
      Resolved: {
        icon: CheckCircle,
        bg: 'bg-green-100 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-400',
      },
      Closed: {
        icon: XCircle,
        bg: 'bg-gray-100 dark:bg-gray-900/20',
        text: 'text-gray-700 dark:text-gray-400',
      },
    };

    const config = statusConfig[status] || statusConfig.Open;
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Support Tickets
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage and respond to user support tickets
          </p>
        </motion.div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">Open</p>
              <p className="text-2xl font-bold text-amber-600">{stats.open}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">Closed</p>
              <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search tickets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No support tickets found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-slate-700">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {ticket.subject}
                        </h3>
                        {getStatusBadge(ticket.status)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {ticket.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          From: {ticket.user?.fullName || ticket.user?.email || 'Unknown'}
                        </span>
                        <span>Created: {formatDate(ticket.createdAt)}</span>
                        {ticket.respondedAt && (
                          <span>Responded: {formatDate(ticket.respondedAt)}</span>
                        )}
                      </div>
                    </div>
                    <Eye className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedTicket.subject}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  From: {selectedTicket.user?.fullName || selectedTicket.user?.email || 'Unknown'}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedTicket(null);
                  setAdminResponse('');
                  setStatus('Open');
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Status:
                  </span>
                  {getStatusBadge(selectedTicket.status)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Created: {formatDate(selectedTicket.createdAt)}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  User Message:
                </h4>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                  {selectedTicket.message}
                </p>
              </div>

              {selectedTicket.adminResponse && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Previous Response:
                  </h4>
                  <p className="text-gray-900 dark:text-white bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800">
                    {selectedTicket.adminResponse}
                  </p>
                  {selectedTicket.respondedAt && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Responded: {formatDate(selectedTicket.respondedAt)}
                    </p>
                  )}
                </div>
              )}

              {/* Response Form */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Response:
                </h4>
                <textarea
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  rows={4}
                  placeholder="Enter your response..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
                <div className="mt-3 flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Update Status:
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-slate-700">
              <Button
                onClick={() => {
                  const newStatus = selectedTicket.status === 'Open' ? 'In Progress' : 'Resolved';
                  handleStatusUpdate(selectedTicket._id, newStatus);
                }}
                className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
              >
                Update Status Only
              </Button>
              <Button
                onClick={handleRespond}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Response
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminSupportPage;

