import { useEffect, useState } from 'react';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingState from '../../components/common/LoadingState';
import Pagination from '../../components/pagination/Pagination';
import StarRating from '../../components/common/StarRating';
import Button from '../../components/common/Button';
import AdminProductTabs from './AdminProductTabs';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';
import { getReviews, deleteReview, mapReview } from '../../services/reviewService';
import { getCollection } from '../../utils/apiResponse';

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function ReviewsLayout({ children }) {
  return (
    <section className="admin-page">
      <div className="admin-page__heading">
        <p className="eyebrow">Administration</p>
        <h1>Reviews</h1>
      </div>
      <AdminProductTabs />
      {children}
    </section>
  );
}

export default function AdminReviewsPage() {
  const API = useAxios();
  const { isAdmin } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const PAGE_SIZE = 20;

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const controller = new AbortController();
      const data = await getReviews(API, controller.signal);
      const allReviews = getCollection(data).map(mapReview);
      setTotalPages(Math.max(1, Math.ceil(allReviews.length / PAGE_SIZE)));
      const start = (page - 1) * PAGE_SIZE;
      setReviews(allReviews.slice(start, start + PAGE_SIZE));
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Could not load reviews.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
    return () => {};
  }, [page]);

  const handleDelete = async (reviewId) => {
    if (deleteConfirmId !== reviewId) {
      setDeleteConfirmId(reviewId);
      return;
    }
    setDeletingId(reviewId);
    try {
      await deleteReview(API, reviewId);
      await loadReviews();
    } catch (err) {
      setError(err.message || 'Could not delete review.');
    } finally {
      setDeletingId(null);
      setDeleteConfirmId(null);
    }
  };

  const handleDeleteCancel = () => setDeleteConfirmId(null);

  const changePage = (newPage) => setPage(newPage);

  if (loading) {
    return <ReviewsLayout><LoadingState>Loading reviews...</LoadingState></ReviewsLayout>;
  }

  if (error) {
    return <ReviewsLayout><ErrorMessage message={error} onRetry={loadReviews} /></ReviewsLayout>;
  }

  if (!reviews.length) {
    return (
      <ReviewsLayout>
        <EmptyState title="No reviews available" />
      </ReviewsLayout>
    );
  }

  return (
    <ReviewsLayout>
      {deleteConfirmId && (
        <div className="review-confirm-dialog" role="dialog" aria-labelledby="delete-confirm-title">
          <p id="delete-confirm-title">Delete this review?</p>
          <p className="review-confirm-dialog__message">This action cannot be undone.</p>
          <div className="review-confirm-dialog__buttons">
            <Button variant="ghost" onClick={handleDeleteCancel} disabled={deletingId === deleteConfirmId}>Cancel</Button>
            <Button variant="danger" onClick={() => handleDelete(deleteConfirmId)} disabled={deletingId === deleteConfirmId}>
              {deletingId === deleteConfirmId ? 'Deleting…' : 'Delete'}
            </Button>
          </div>
        </div>
      )}
      <table className="admin-reviews-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Author</th>
            <th>Rating</th>
            <th>Review</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td>
                <a href={`/products/${encodeURIComponent(review.productId)}`} target="_blank" rel="noopener noreferrer">
                  {review.productId}
                </a>
              </td>
              <td>{review.author}</td>
              <td>
                <StarRating value={review.rating} size="sm" ariaLabel={`Rated ${review.rating} out of 5`} />
              </td>
              <td className="admin-reviews-table__comment">
                {review.title && <strong>{review.title}</strong>}
                {review.title && <br />}
                {review.comment?.substring(0, 100)}{review.comment?.length > 100 ? '...' : ''}
              </td>
              <td>{formatDate(review.createdAt)}</td>
              <td>
                <button
                  type="button"
                  className="review__action-btn review__action-btn--delete"
                  onClick={() => handleDelete(review.id)}
                  disabled={deletingId === review.id}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={changePage}
        label="Review pages"
      />
    </ReviewsLayout>
  );
}
