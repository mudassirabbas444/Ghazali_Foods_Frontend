import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MessageSquare,
  Loader2,
  Trash2,
  CheckCircle,
  XCircle,
  Edit,
  Send,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import adminService from '../../services/admin';
import { toast } from 'react-toastify';
import FirebaseImage from '../../components/FirebaseImage';

const AdminQuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAnswered, setFilterAnswered] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchQuestions();
  }, [filterAnswered, searchQuery]);

  useEffect(() => {
    // Update displayed questions based on current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setQuestions(allQuestions.slice(startIndex, endIndex));
  }, [currentPage, allQuestions]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const filters = {
        hasAnswer: filterAnswered === 'all' ? undefined : filterAnswered === 'answered',
      };
      const response = await adminService.getAllQuestions(filters);
      if (response.success) {
        let filtered = response.data || response.questions || [];
        if (searchQuery) {
          filtered = filtered.filter(q =>
            q.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        setAllQuestions(filtered);
        setCurrentPage(1);
      }
    } catch (error) {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (questionId) => {
    if (!answer.trim()) {
      toast.error('Please enter an answer');
      return;
    }

    try {
      await adminService.answerQuestion(questionId, answer);
      toast.success('Answer submitted successfully');
      setAnswer('');
      setEditingQuestion(null);
      fetchQuestions();
    } catch (error) {
      toast.error(error.message || 'Failed to submit answer');
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      await adminService.deleteQuestion(questionId);
      toast.success('Question deleted successfully');
      fetchQuestions();
    } catch (error) {
      toast.error(error.message || 'Failed to delete question');
    }
  };

  const handleApprove = async (questionId) => {
    try {
      await adminService.approveQuestion(questionId);
      toast.success('Question approved');
      fetchQuestions();
    } catch (error) {
      toast.error(error.message || 'Failed to approve question');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Product Questions</h1>
        <p className="text-gray-600 mt-1">Manage customer questions and answers</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={filterAnswered}
            onChange={(e) => setFilterAnswered(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Questions</option>
            <option value="answered">Answered</option>
            <option value="unanswered">Unanswered</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No questions found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {questions.map((question) => (
              <motion.div
                key={question._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {question.product?.thumbnail && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <FirebaseImage
                            src={question.product.thumbnail}
                            alt={question.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {question.product?.name || 'Product'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Asked by {question.user?.fullName || 'Anonymous'}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-900 mb-2">{question.question}</p>
                    {question.answer && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm font-semibold text-green-800 mb-1">Answer:</p>
                        <p className="text-gray-700">{question.answer}</p>
                        {question.answeredBy && (
                          <p className="text-xs text-gray-500 mt-2">
                            Answered by {question.answeredBy?.fullName || 'Admin'}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!question.isApproved && (
                      <button
                        onClick={() => handleApprove(question._id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {!question.answer && (
                      <button
                        onClick={() => setEditingQuestion(question._id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Answer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(question._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Answer Form */}
                {editingQuestion === question._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Enter your answer..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 mb-3"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAnswer(question._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        Submit Answer
                      </button>
                      <button
                        onClick={() => {
                          setEditingQuestion(null);
                          setAnswer('');
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}

                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2">
                    {question.isApproved ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Approved
                      </span>
                    ) : (
                      <span className="text-yellow-600 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {allQuestions.length > itemsPerPage && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, allQuestions.length)} of {allQuestions.length} questions
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.ceil(allQuestions.length / itemsPerPage) }, (_, i) => i + 1)
                .filter(page => {
                  const totalPages = Math.ceil(allQuestions.length / itemsPerPage);
                  if (totalPages <= 7) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (Math.abs(page - currentPage) <= 1) return true;
                  return false;
                })
                .map((page, idx, arr) => {
                  const totalPages = Math.ceil(allQuestions.length / itemsPerPage);
                  const prevPage = arr[idx - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;
                  
                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && <span className="px-2">...</span>}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-lg ${
                          currentPage === page
                            ? 'bg-orange-500 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(allQuestions.length / itemsPerPage), prev + 1))}
              disabled={currentPage >= Math.ceil(allQuestions.length / itemsPerPage)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuestionsPage;

