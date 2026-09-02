import { useState } from 'react';
import useAxios from './useAxios';
import useAsync from './useAsync';
import useAuth from './useAuth';
import { createReview, getProductReviews } from '../services/reviewService';

export default function useProductReviews(productId) {
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

  const addReview = async ({ rating, comment }) => {
    if (!isAuthenticated) {
      setSubmitState({ submitting: false, submitError: 'Please sign in to write a review.' });
      return false;
    }
    setSubmitState({ submitting: true, submitError: '' });
    try {
      await createReview(API, { productId, rating, comment });
      reload();
      setSubmitState({ submitting: false, submitError: '' });
      return true;
    } catch (requestError) {
      setSubmitState({ submitting: false, submitError: requestError.message || 'Could not submit your review. Please try again.' });
      return false;
    }
  };

  return {
    reviews,
    loading,
    error,
    averageRating,
    reviewCount: reviews.length,
    addReview,
    reload,
    ...submitState,
  };
}