import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useProductReviews from '../../hooks/useProductReviews';
import { ROUTES } from '../../routes/routePaths';
import Button from '../../components/common/Button';
import StarRating from '../../components/common/StarRating';

const VISIBLE_REVIEW_LIMIT = 5;

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Most recent' },
  { value: 'highest', label: 'Highest rated' },
  { value: 'lowest', label: 'Lowest rated' },
  { value: 'helpful', label: 'Most helpful' },
];

function sortReviews(reviews, sortBy) {
  const sorted = [...reviews];
  switch (sortBy) {
    case 'highest':
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case 'lowest':
      return sorted.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
    case 'helpful':
      return sorted.sort((a, b) => ((b.helpfulCount ?? 0) - (a.helpfulCount ?? 0)));
    case 'newest':
    default:
      return sorted.sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0));
  }
}

function RatingBar({ label, count, total, onClick }) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <button type="button" className="rating-bar" onClick={onClick} aria-label={`Filter by ${label} stars`}>
      <span className="rating-bar__label">{label} star</span>
      <div className="rating-bar__track">
        <div className="rating-bar__fill" style={{ width: `${percentage}%` }} />
      </div>
      <span className="rating-bar__count">{count}</span>
    </button>
  );
}

function ReviewItem({ review, isOwner, isAdmin, onEdit, onDelete, onVoteHelpful, onVoteNotHelpful, voting }) {
  return (
    <li className="review" key={review.id ?? `${review.author}-${review.createdAt}`}>
      <div className="review__head">
        <div className="review__meta">
          <span className="review__author">{review.author}</span>
          {review.isVerifiedPurchase && (
            <span className="review__verified" title="Verified purchase">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              Verified Purchase
            </span>
          )}
        </div>
        <span className="review__date">{formatDate(review.createdAt)}</span>
      </div>
      <div className="review__rating">
        <StarRating value={review.rating} ariaLabel={`Rated ${review.rating} out of 5`} size="sm" />
      </div>
      {review.title && <p className="review__title">{review.title}</p>}
      {review.comment && <p className="review__comment">{review.comment}</p>}
      {(review.helpfulCount > 0 || review.notHelpfulCount > 0) && (
        <p className="review__votes">
          {review.helpfulCount} of {review.helpfulCount + review.notHelpfulCount} found this helpful
        </p>
      )}
      <div className="review__actions">
        {(isOwner || isAdmin) && (
          <>
            <button type="button" className="review__action-btn" onClick={onEdit} disabled={voting}>
              Edit
            </button>
            <button type="button" className="review__action-btn review__action-btn--delete" onClick={onDelete} disabled={voting}>
              Delete
            </button>
          </>
        )}
        {!isOwner && (
          <>
            <button type="button" className="review__action-btn" onClick={onVoteHelpful} disabled={voting} aria-label="Mark as helpful">
              Helpful
            </button>
            <button type="button" className="review__action-btn" onClick={onVoteNotHelpful} disabled={voting} aria-label="Mark as not helpful">
              Not helpful
            </button>
          </>
        )}
      </div>
    </li>
  );
}

function ReviewForm({ initialValues, onSubmit, onCancel, submitting, submitError, isEditing }) {
  const [rating, setRating] = useState(initialValues?.rating ?? 0);
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [comment, setComment] = useState(initialValues?.comment ?? '');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!rating) {
      setFormError('Please choose a star rating.');
      return;
    }
    if (!comment.trim()) {
      setFormError('Please write a few words about the product.');
      return;
    }
    const submitted = await onSubmit({ rating, comment: comment.trim(), title: title.trim() });
    if (submitted) {
      setRating(0);
      setTitle('');
      setComment('');
      setFormError('');
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit} noValidate>
      <p className="review-form__title">{isEditing ? 'Edit your review' : 'Write a review'}</p>
      <StarRating value={rating} onChange={setRating} ariaLabel="Your rating" />
      <input
        type="text"
        className="review-form__title-input"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Summarize your experience (optional)"
        aria-label="Review title"
        maxLength={100}
      />
      <textarea
        className="review-form__comment"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="What did you like or dislike?"
        aria-label="Your review"
        maxLength={1000}
      />
      {(formError || submitError) && <p className="field-error" role="alert">{formError || submitError}</p>}
      <div className="review-form__buttons">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Submitting…' : isEditing ? 'Save changes' : 'Submit review'}
        </Button>
      </div>
    </form>
  );
}

function ReviewsModal({ title, reviews, onClose, renderReview }) {
  return (
    <div className="reviews-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="reviews-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="reviews-modal__header">
          <p className="reviews-modal__title">{title}</p>
          <button type="button" className="reviews-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <ul className="review-list reviews-modal__list">
          {reviews.map((review) => renderReview(review))}
        </ul>
      </div>
    </div>
  );
}

export default function ProductReviews({ product, currentUserId, isAdmin = false }) {
  const { isAuthenticated, session } = useAuth();
  const location = useLocation();
  const {
    reviews, loading, error, averageRating, reviewCount, ratingDistribution,
    addReview, editReview, removeReview, voteHelpful, submitting, submitError,
  } = useProductReviews(product?.id);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [showAllModal, setShowAllModal] = useState(false);

  const userId = currentUserId ?? session?.sub ?? session?.user?.sub ?? null;
  const sortedReviews = sortReviews(reviews, sortBy);
  const filteredReviews = filterRating > 0
    ? sortedReviews.filter((r) => Math.round(r.rating) === filterRating)
    : sortedReviews;
  const visibleReviews = filteredReviews.slice(0, VISIBLE_REVIEW_LIMIT);
  const remainingReviews = filteredReviews.slice(VISIBLE_REVIEW_LIMIT);
  const loginReturnTo = `${location.pathname}${location.search}${location.hash}`;

  const handleEdit = (reviewId) => setEditingReviewId(reviewId);
  const handleEditCancel = () => setEditingReviewId(null);

  const handleDelete = async (reviewId) => {
    if (deleteConfirmId !== reviewId) {
      setDeleteConfirmId(reviewId);
      return;
    }
    await removeReview(reviewId);
    setDeleteConfirmId(null);
  };

  const handleDeleteCancel = () => setDeleteConfirmId(null);

  const handleEditSubmit = async (values) => {
    const success = await editReview(editingReviewId, values);
    if (success) setEditingReviewId(null);
    return success;
  };

  const handleVote = async (reviewId, isHelpful) => {
    await voteHelpful(reviewId, isHelpful);
  };

  const renderReview = (review) => {
    const isOwner = userId && (String(review.userId) === String(userId) || review.author === userId);
    if (editingReviewId === review.id) {
      return (
        <li className="review review--editing" key={review.id}>
          <ReviewForm
            initialValues={{ rating: review.rating, title: review.title, comment: review.comment }}
            onSubmit={handleEditSubmit}
            onCancel={handleEditCancel}
            submitting={submitting}
            submitError={submitError}
            isEditing
          />
        </li>
      );
    }
    return (
      <ReviewItem
        key={review.id}
        review={review}
        isOwner={isOwner}
        isAdmin={isAdmin}
        onEdit={() => handleEdit(review.id)}
        onDelete={() => handleDelete(review.id)}
        onVoteHelpful={() => handleVote(review.id, true)}
        onVoteNotHelpful={() => handleVote(review.id, false)}
        voting={submitting}
      />
    );
  };

  return (
    <section className="product-reviews" aria-labelledby="product-reviews-heading">
      <p className="eyebrow" id="product-reviews-heading">Reviews</p>
      <div className="reviews-summary">
        <span className="reviews-summary__score">{reviewCount ? averageRating.toFixed(1) : '–'}</span>
        <StarRating value={averageRating} ariaLabel={reviewCount ? `Average rating ${averageRating} out of 5` : 'No ratings yet'} />
        <span className="reviews-summary__count">{reviewCount ? `${reviewCount} review${reviewCount > 1 ? 's' : ''}` : 'No ratings yet'}</span>
      </div>

      {reviewCount > 0 && (
        <div className="reviews-breakdown">
          <div className="reviews-breakdown__bars">
            {[5, 4, 3, 2, 1].map((star) => (
              <RatingBar
                key={star}
                label={star}
                count={ratingDistribution[star] || 0}
                total={ratingDistribution.total}
                onClick={() => setFilterRating(filterRating === star ? 0 : star)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="reviews-controls">
        <label className="reviews-sort" htmlFor="review-sort">
          Sort by:{' '}
          <select
            id="review-sort"
            className="reviews-sort__select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
        {filterRating > 0 && (
          <button type="button" className="reviews-filter-clear" onClick={() => setFilterRating(0)}>
            Clear filter ({filterRating} star{filterRating > 1 ? 's' : ''})
          </button>
        )}
      </div>

      {loading && <p className="reviews-status">Loading reviews…</p>}
      {error && <p className="field-error" role="alert">Could not load reviews. Please try again later.</p>}

      {!loading && !error && visibleReviews.length > 0 && (
        <ul className="review-list">
          {visibleReviews.map((review) => renderReview(review))}
        </ul>
      )}

      {!loading && !error && remainingReviews.length > 0 && (
        <div className="reviews-load-more">
          <Button variant="ghost" onClick={() => setShowAllModal(true)}>
            Load more reviews ({remainingReviews.length})
          </Button>
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <p className="reviews-status">Be the first to review this product.</p>
      )}

      {deleteConfirmId && (
        <div className="review-confirm-dialog" role="dialog" aria-labelledby="delete-confirm-title">
          <p id="delete-confirm-title">Delete this review?</p>
          <p className="review-confirm-dialog__message">This action cannot be undone.</p>
          <div className="review-confirm-dialog__buttons">
            <Button variant="ghost" onClick={handleDeleteCancel} disabled={submitting}>Cancel</Button>
            <Button variant="danger" onClick={() => handleDelete(deleteConfirmId)} disabled={submitting}>
              {submitting ? 'Deleting…' : 'Delete'}
            </Button>
          </div>
        </div>
      )}

      {showAllModal && (
        <ReviewsModal
          title={`All reviews (${filteredReviews.length})`}
          reviews={remainingReviews}
          onClose={() => setShowAllModal(false)}
          renderReview={renderReview}
        />
      )}

      <div className="review-form-wrapper">
        {isAuthenticated ? (
          !editingReviewId && (
            <ReviewForm
              onSubmit={addReview}
              submitting={submitting}
              submitError={submitError}
              isEditing={false}
            />
          )
        ) : (
          <p className="reviews-login-hint">
            <Link className="button button--ghost" to={`${ROUTES.login}?reason=login-required&returnTo=${encodeURIComponent(loginReturnTo)}`}>
              Sign in to write a review
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}