import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Eye,
  X,
} from 'lucide-react';
import supportService from '../../services/support';
import { Button, Input } from '../../components';
import { useApp } from '../../context/AppContext';

const SupportPage = () => {
  const { addNotification } = useApp();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    fetchTickets();
  }, [page]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await supportService.getMySupport(page, 10);
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

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const response = await supportService.createSupport(data.subject, data.message);

      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Support ticket created successfully',
        });
        reset();
        setShowForm(false);
        fetchTickets();
      } else {
        addNotification({
          type: 'error',
          title: 'Error',
          message: response.message || 'Failed to create support ticket',
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to create support ticket',
      });
    } finally {
      setSubmitting(false);
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Support Center
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Get help from our support team
              </p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </div>
        </motion.div>

        {/* Create Ticket Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Create Support Ticket
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  reset();
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Subject"
                type="text"
                placeholder="Enter ticket subject"
                error={errors.subject?.message}
                {...register('subject', {
                  required: 'Subject is required',
                  minLength: {
                    value: 5,
                    message: 'Subject must be at least 5 characters',
                  },
                })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('message', {
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters',
                    },
                  })}
                  rows={6}
                  placeholder="Describe your issue or question..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  loading={submitting}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Ticket
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    reset();
                  }}
                  className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Tickets List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            My Support Tickets
          </h2>

          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No support tickets yet. Create your first ticket to get help!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
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
            <div className="flex items-center justify-between mt-6">
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
        </motion.div>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedTicket.subject}
              </h3>
              <button
                onClick={() => setSelectedTicket(null)}
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
                  Your Message:
                </h4>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                  {selectedTicket.message}
                </p>
              </div>

              {selectedTicket.adminResponse && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Admin Response:
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
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SupportPage;

