import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, X, Image as ImageIcon, Loader2, Check, Package } from 'lucide-react';
import reviewService from '../../services/review';
import orderService from '../../services/order';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import FirebaseImage from '../FirebaseImage';

const ReviewForm = ({ productId, onReviewSubmitted, existingReview }) => {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState(existingReview?.images || []);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(existingReview?.order?._id || '');
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (isAuthenticated && productId && !existingReview) {
      fetchAvailableOrders();
    }
  }, [isAuthenticated, productId, existingReview]);

  const fetchAvailableOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await orderService.getMyOrders({ status: 'delivered' });
      if (response.success && response.orders) {
        // Filter orders that contain this product
        const ordersWithProduct = response.orders.filter(order => 
          order.items?.some(item => 
            (item.product?._id || item.product) === productId
          )
        );
        setAvailableOrders(ordersWithProduct);
        
        // Auto-select first order if only one available
        if (ordersWithProduct.length === 1) {
          setSelectedOrderId(ordersWithProduct[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-gray-600">Please login to write a review</p>
      </div>
    );
  }

  // Check if user can review (has delivered orders with this product)
  if (!existingReview && !loadingOrders && availableOrders.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
        <p className="text-gray-700 font-medium mb-1">Review Not Available</p>
        <p className="text-sm text-gray-600">
          You can only review products you have purchased and received. Please complete an order first.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('rating', rating.toString());
      formData.append('comment', comment);
      if (title) formData.append('title', title);
      if (selectedOrderId) formData.append('orderId', selectedOrderId);
      
      images.forEach((image) => {
        formData.append('images', image);
      });

      if (existingReview) {
        await reviewService.updateReview(existingReview._id, formData);
        toast.success('Review updated successfully');
      } else {
        await reviewService.createReview(formData);
        toast.success('Review submitted successfully');
      }
      
      setShowForm(false);
      setRating(0);
      setTitle('');
      setComment('');
      setImages([]);
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (!showForm && !existingReview) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
      >
        Write a Review
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          {existingReview ? 'Edit Your Review' : 'Write a Review'}
        </h3>
        {!existingReview && (
          <button
            onClick={() => setShowForm(false)}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-gray-600">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Title (Optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your review"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        {!existingReview && availableOrders.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Order (Optional)
            </label>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select an order...</option>
              {availableOrders.map((order) => (
                <option key={order._id} value={order._id}>
                  Order #{order.orderNumber} - {new Date(order.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Selecting an order will mark this as a verified purchase review
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos (Optional)
          </label>
          {existingImages.length > 0 && (
            <div className="flex gap-2 mb-2">
              {existingImages.map((img, idx) => (
                <FirebaseImage
                  key={idx}
                  src={img}
                  alt={`Review ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">You can upload up to 5 images</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                {existingReview ? 'Update Review' : 'Submit Review'}
              </>
            )}
          </button>
          {!existingReview && (
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default ReviewForm;

