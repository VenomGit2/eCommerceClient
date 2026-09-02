import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useProductReviews from '../../hooks/useProductReviews';
import { ROUTES } from '../../routes/routePaths';
import Button from '../../components/common/Button';
import StarRating from '../../components/common/StarRating';

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ProductReviews({ product }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { reviews, loading, error, averageRating, reviewCount, addReview, submitting, submitError } = useProductReviews(product?.id);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (!rating) {
      setFormError('Please choose a star rating.');
      return;
    }
    if (!comment.trim()) {
      setFormError('Please write a few words about the product.');
      return;
    }
    const submitted = await addReview({ rating, comment: comment.trim() });
    if (submitted) {
      setRating(0);
      setComment('');
      setFormError('');
    }
  };

  const loginReturnTo = `${location.pathname}${location.search}${location.hash}`;

  return (
    <section className="product-reviews" aria-labelledby="product-reviews-heading">
      <p className="eyebrow" id="product-reviews-heading">Reviews</p>
      <div className="reviews-summary">
        <span className="reviews-summary__score">{reviewCount ? averageRating.toFixed(1) : '–'}</span>
        <StarRating value={averageRating} ariaLabel={reviewCount ? `Average rating ${averageRating} out of 5` : 'No ratings yet'} />
        <span className="reviews-summary__count">{reviewCount ? `${reviewCount} review${reviewCount > 1 ? 's' : ''}` : 'No reviews yet'}</span>
      </div>

      {loading && <p className="reviews-status">Loading reviews…</p>}
      {error && <p className="field-error" role="alert">Could not load reviews. Please try again later.</p>}

      {!loading && !error && reviews.length > 0 && (
        <ul className="review-list">
          {reviews.map((review) => (
            <li className="review" key={review.id ?? `${review.author}-${review.createdAt}`}>
              <div className="review__head">
                <span className="review__author">{review.author}</span>
                <span className="review__date">{formatDate(review.createdAt)}</span>
              </div>
              <StarRating value={review.rating} ariaLabel={`Rated ${review.rating} out of 5`} />
              {review.comment && <p className="review__comment">{review.comment}</p>}
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && reviews.length === 0 && (
        <p className="reviews-status">Be the first to review this product.</p>
      )}

      <div className="review-form-wrapper">
        {isAuthenticated ? (
          <form className="review-form" onSubmit={submit} noValidate>
            <p className="review-form__title">Write a review</p>
            <StarRating value={rating} onChange={setRating} ariaLabel="Your rating" />
            <textarea
              className="review-form__comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="What did you like or dislike?"
              aria-label="Your review"
              maxLength={1000}
            />
            {(formError || submitError) && <p className="field-error" role="alert">{formError || submitError}</p>}
            <Button type="submit" disabled={submitting} aria-live="polite">
              {submitting ? 'Submitting…' : 'Submit review'}
            </Button>
          </form>
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