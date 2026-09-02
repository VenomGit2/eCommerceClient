import { useState } from 'react';

function Star({ filled }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function StarRating({
  value = 0,
  onChange,
  max = 5,
  className = '',
  ariaLabel,
}) {
  const [hovered, setHovered] = useState(0);
  const interactive = typeof onChange === 'function';
  const shown = interactive && hovered ? hovered : value;

  if (!interactive) {
    return (
      <span className={`star-rating ${className}`.trim()} role="img" aria-label={ariaLabel || `Rated ${value} out of ${max}`}>
        {Array.from({ length: max }, (_, index) => <Star key={index} filled={index < Math.round(value)} />)}
      </span>
    );
  }

  return (
    <span className={`star-rating star-rating--input ${className}`.trim()} role="radiogroup" aria-label={ariaLabel || 'Choose a rating'}>
      {Array.from({ length: max }, (_, index) => {
        const rating = index + 1;
        return (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={`${rating} star${rating > 1 ? 's' : ''}`}
            className={index < shown ? 'is-active' : ''}
            onClick={() => onChange(rating)}
            onMouseEnter={() => setHovered(rating)}
            onMouseLeave={() => setHovered(0)}
          >
            <Star filled={index < shown} />
          </button>
        );
      })}
    </span>
  );
}