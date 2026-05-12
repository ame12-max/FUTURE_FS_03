import { useState, useEffect } from 'react';
import { FiStar, FiSend } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { menuAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Reviews = ({ menuItemId, onReviewAdded }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [menuItemId]);

  const fetchReviews = async () => {
    try {
      const res = await menuAPI.getReviews(menuItemId);
      setReviews(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }
    
    setSubmitting(true);
    try {
      await menuAPI.addReview(menuItemId, { rating, comment });
      toast.success('Review added!');
      setComment('');
      setRating(5);
      fetchReviews();
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      toast.error('Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (value, interactive = false, onStarClick = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`text-xl cursor-pointer transition ${
              star <= (interactive ? (hoverRating || rating) : value)
                ? 'text-gold fill-gold'
                : 'text-gray-500'
            }`}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && onStarClick && onStarClick(star)}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) {
    return <div className="text-gray-400">Loading reviews...</div>;
  }

  return (
    <div className="mt-8 border-t border-white/20 pt-8">
      <h3 className="text-2xl font-playfair font-bold text-gold mb-4">Customer Reviews</h3>
      
      {/* Rating Summary */}
      <div className="bg-white/5 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-gold">{averageRating}</div>
            <div className="text-sm text-gray-400">out of 5</div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {renderStars(averageRating)}
              <span className="text-sm text-gray-400">({reviews.length} reviews)</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Review Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="bg-white/5 rounded-xl p-6 mb-8">
          <h4 className="text-lg font-semibold text-gold mb-3">Write a Review</h4>
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">Your Rating</label>
            {renderStars(rating, true, setRating)}
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">Your Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="3"
              placeholder="Share your experience with this dish..."
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-gold"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-gold text-black px-6 py-2 rounded-full font-semibold hover:bg-gold-light transition disabled:opacity-50 flex items-center gap-2"
          >
            <FiSend /> {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      ) : (
        <div className="bg-white/5 rounded-xl p-6 text-center mb-8">
          <p className="text-gray-300">Login to leave a review</p>
          <a href="/login" className="inline-block mt-2 text-gold hover:underline">Login</a>
        </div>
      )}
      
      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white/5 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {renderStars(review.rating)}
                    <span className="font-semibold text-white">{review.user_name || 'Guest'}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-300 text-sm">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;