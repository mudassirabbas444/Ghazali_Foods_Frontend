import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Plus, Minus, User, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import productQuestionService from '../../services/productQuestion';
import { toast } from 'react-toastify';

const ProductQuestions = ({ productId }) => {
  const { isAuthenticated, user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [productId]);

  const fetchQuestions = async () => {
    try {
      const response = await productQuestionService.getProductQuestions(productId);
      if (response.success) {
        setQuestions(response.data || response.questions || []);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    try {
      setSubmitting(true);
      const response = await productQuestionService.createQuestion(productId, question);
      
      if (response.success) {
        setQuestion('');
        setShowForm(false);
        toast.success('Question submitted! We will answer soon.');
        fetchQuestions(); // Refresh questions
      } else {
        toast.error(response.message || 'Failed to submit question');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit question');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  return (
    <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          Questions & Answers ({questions.length})
        </h2>
        {isAuthenticated && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ask a Question
          </button>
        )}
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="mb-6 p-4 bg-gray-50 rounded-lg"
        >
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about this product..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 mb-3"
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Question'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setQuestion('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      <div className="space-y-4">
        {questions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No questions yet. Be the first to ask!
          </p>
        ) : (
          questions.map((q) => (
            <div key={q._id} className="border border-gray-200 rounded-lg p-4">
              <button
                onClick={() => toggleQuestion(q._id)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-900">
                      {q.user?.fullName || 'Anonymous'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-medium text-gray-900">{q.question}</p>
                </div>
                {expandedQuestions.has(q._id) ? (
                  <Minus className="w-5 h-5 text-gray-500" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {expandedQuestions.has(q._id) && q.answer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-3 border-t border-gray-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-orange-600">Seller Response:</span>
                  </div>
                  <p className="text-gray-700">{q.answer}</p>
                </motion.div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductQuestions;

