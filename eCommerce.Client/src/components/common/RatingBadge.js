const formatCount = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return '0';
  return num.toLocaleString('en-IN');
};

const StarIcon = ({ size = 12 }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="currentColor" stroke="currentColor" strokeWidth="0.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function RatingBadge({
  value = 0,
  ratingsCount = 0,
  reviewCount = 0,
  size = 'sm',
  showCounts = true,
  className = '',
  ariaLabel,
}) {
  const hasRating = Number(value) > 0;
  const showCountsValue = showCounts && (ratingsCount > 0 || reviewCount > 0);
  const starSize = size === 'lg' ? 14 : 11;
  const classes = [
    'rating-badge',
    `rating-badge--${size}`,
    hasRating ? 'rating-badge--filled' : 'rating-badge--empty',
    className,
  ].filter(Boolean).join(' ');

  const accessibleLabel = ariaLabel
    || `Rated ${Number(value).toFixed(1)} out of 5, ${formatCount(ratingsCount)} ratings and ${formatCount(reviewCount)} reviews`;

  return (
    <span className={classes} aria-label={accessibleLabel}>
      {hasRating && (
        <span className="rating-badge__pill">
          <span className="rating-badge__value">{Number(value).toFixed(1)}</span>
          <span className="rating-badge__star" aria-hidden="true">
            <StarIcon size={starSize} />
          </span>
        </span>
      )}
      {showCountsValue && (
        <span className="rating-badge__counts">
          {ratingsCount > 0 && (
            <span className="rating-badge__count">{formatCount(ratingsCount)} Ratings</span>
          )}
          {ratingsCount > 0 && reviewCount > 0 && (
            <span className="rating-badge__separator" aria-hidden="true">&</span>
          )}
          {reviewCount > 0 && (
            <span className="rating-badge__count">{formatCount(reviewCount)} Reviews</span>
          )}
        </span>
      )}
      {!hasRating && !showCountsValue && (
        <span className="rating-badge__counts rating-badge__counts--empty">No ratings yet</span>
      )}
    </span>
  );
}
