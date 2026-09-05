import { useState } from 'react';
import useAxios from './useAxios';
import useAsync from './useAsync';
import useAuth from './useAuth';
import {
  createReview,
  deleteReview,
  getProductReviews,
  markReviewHelpful,
  markReviewNotHelpful,
  updateReview,
} from '../services/reviewService';

export default function useProductReviews(productId, onChanged) {
  const API = useAxios();
  const { isAuthenticated } = useAuth();
  const [submitState, setSubmitState] = useState({ submitting: false, submitError: '' });
  const { data, loading, error, reload } = useAsync(
    (signal) => getProductReviews(API, productId, signal),
    [API, productId],
  );

  const reviews = data ?? [];
  const averageRating = reviews.length
    ? Math.round((reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / reviews.length) * 10) / 10
    : 0;

  const ratingDistribution = reviews.reduce(
    (dist, review) => {
      const rating = Math.max(0, Math.min(5, Math.round(Number(review.rating) || 0)));
      if (rating > 0) {
        dist[rating] = (dist[rating] || 0) + 1;
        dist.total += 1;
      }
      return dist;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, total: 0 },
  );

  const requireAuth = () => {
    if (!isAuthenticated) {
      setSubmitState({ submitting: false, submitError: 'Please sign in to continue.' });
      return false;
    }
    return true;
  };

  const addReview = async ({ rating, comment, title }) => {
    if (!requireAuth()) return false;
    setSubmitState({ submitting: true, submitError: '' });
    try {
      await createReview(API, { productId, rating, comment, title });
      reload();
      onChanged?.();
      setSubmitState({ submitting: false, submitError: '' });
      return true;
    } catch (requestError) {
      setSubmitState({ submitting: false, submitError: requestError.message || 'Could not submit your review. Please try again.' });
      return false;
    }
  };

  const editReview = async (reviewId, { rating, comment, title }) => {
    if (!requireAuth()) return false;
    setSubmitState({ submitting: true, submitError: '' });
    try {
      await updateReview(API, reviewId, { rating, comment, title });
      reload();
      onChanged?.();
      setSubmitState({ submitting: false, submitError: '' });
      return true;
    } catch (requestError) {
      setSubmitState({ submitting: false, submitError: requestError.message || 'Could not update your review. Please try again.' });
      return false;
    }
  };

  const removeReview = async (reviewId) => {
    if (!requireAuth()) return false;
    setSubmitState({ submitting: true, submitError: '' });
    try {
      await deleteReview(API, reviewId);
      reload();
      onChanged?.();
      setSubmitState({ submitting: false, submitError: '' });
      return true;
    } catch (requestError) {
      setSubmitState({ submitting: false, submitError: requestError.message || 'Could not delete your review. Please try again.' });
      return false;
    }
  };

  const voteHelpful = async (reviewId, isHelpful) => {
    if (!requireAuth()) return false;
    try {
      if (isHelpful) {
        await markReviewHelpful(API, reviewId);
      } else {
        await markReviewNotHelpful(API, reviewId);
      }
      reload();
      return true;
    } catch (requestError) {
      setSubmitState({ submitting: false, submitError: requestError.message || 'Could not register your feedback. Please try again.' });
      return false;
    }
  };

  return {
    reviews,
    loading,
    error,
    averageRating,
    reviewCount: reviews.length,
    ratingDistribution,
    addReview,
    editReview,
    removeReview,
    voteHelpful,
    reload,
    ...submitState,
  };
}