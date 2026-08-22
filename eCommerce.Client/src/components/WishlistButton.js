import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useWishlist from '../hooks/useWishlist';
import { ROUTES } from '../routes/routePaths';

function HeartIcon({ filled }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" fill={filled ? 'currentColor' : 'none'} /></svg>;
}

export default function WishlistButton({ product, className = '', showLabel = false }) {
  const [animating, setAnimating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isPending, isSaved, loading, ready, toggleItem } = useWishlist();
  const saved = isSaved(product?.id);
  const pending = isAuthenticated && (!ready || loading || isPending(product?.id));

  const toggle = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated) {
      const returnTo = `${location.pathname}${location.search}${location.hash}`;
      navigate(`${ROUTES.login}?reason=login-required&returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }
    try {
      await toggleItem(product);
      setAnimating(true);
    } catch {
      // The shared wishlist state exposes the request error to the page.
    }
  };

  const label = pending ? 'Checking wishlist' : saved ? `Remove ${product?.name || 'product'} from wishlist` : `Add ${product?.name || 'product'} to wishlist`;
  return (
    <button
      type="button"
      className={`wishlist-button ${saved ? 'is-saved' : ''} ${animating ? 'is-animating' : ''} ${showLabel ? 'wishlist-button--labelled' : ''} ${className}`.trim()}
      aria-label={label}
      aria-pressed={saved}
      disabled={product?.id == null || pending}
      onClick={toggle}
      onAnimationEnd={() => setAnimating(false)}
    >
      {pending ? <span className="wishlist-button__spinner" aria-hidden="true" /> : <HeartIcon filled={saved} />}
      {showLabel && <span>{pending ? 'Updating…' : saved ? 'Saved to wishlist' : 'Save to wishlist'}</span>}
    </button>
  );
}
