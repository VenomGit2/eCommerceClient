import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';
import { ROUTES } from '../routes/routePaths';
import Button from './common/Button';
import RatingBadge from './common/RatingBadge';
import WishlistButton from './WishlistButton';

export default function ProductCard({ product, onAdd, isInCart = false }) {
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState('');
  const {
    id,
    name,
    imageUrl,
    price,
    currency,
    category,
    rating,
    ratingsCount,
    reviewCount,
    discountPercentage,
  } = product;

  useEffect(() => {
    if (!added) return undefined;
    const timer = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [added]);

  const addToCart = async () => {
    if (adding || added) return;
    setAdding(true);
    setError('');
    try {
      await onAdd(product);
      setAdded(true);
    } catch (requestError) {
      setError(requestError.message || 'Could not add this item to the cart.');
    } finally {
      setAdding(false);
    }
  };

  const buyNow = async () => {
    if (buying) return;
    setBuying(true);
    setError('');
    try {
      if (!isInCart) await onAdd(product);
      navigate(ROUTES.checkout);
    } catch (requestError) {
      setError(requestError.message || 'Could not continue to checkout.');
      setBuying(false);
    }
  };

  const exploreProduct = (event) => {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width;
    const vertical = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty('--card-rotate-x', `${(vertical - 0.5) * -14}deg`);
    event.currentTarget.style.setProperty('--card-rotate-y', `${(horizontal - 0.5) * 18}deg`);
  };

  const resetProduct = (event) => {
    event.currentTarget.style.removeProperty('--card-rotate-x');
    event.currentTarget.style.removeProperty('--card-rotate-y');
  };

  return (
    <article className="card product-card">
      <div className="product-card__visual">
        <Link className="product-card__media" to={`/products/${encodeURIComponent(id)}`} aria-label={`View ${name}`} onPointerMove={exploreProduct} onPointerLeave={resetProduct}>
          {discountPercentage > 10 && <span className="product-card__badge">-{Math.round(discountPercentage)}%</span>}
          <span className="product-card__3d-hint" aria-hidden="true">Explore 3D</span>
          <span className="product-card__view" aria-hidden="true">View details <span>↗</span></span>
          {imageUrl
            ? <img src={imageUrl} alt={name || 'Product'} loading="lazy" width="360" height="360" />
            : <span className="product-card__placeholder" aria-hidden="true">{name?.charAt(0)}</span>}
        </Link>
        <WishlistButton product={product} className="product-card__wishlist" />
      </div>
      <div className="card__body">
        {category && <span className="product-card__category">{category}</span>}
        <div className="product-card__title-row">
          <h2><Link to={`/products/${encodeURIComponent(id)}`}>{name}</Link></h2>
          {isInCart || added
            ? <Link className="button button--ghost product-card__quick-add is-added" to={ROUTES.cart}>In cart ✓</Link>
            : <Button variant="ghost" className="product-card__quick-add" onClick={addToCart} disabled={id == null || adding} aria-live="polite">
              {adding ? 'Adding…' : 'Add to cart +'}
            </Button>}
        </div>
        <div className="product-card__meta">
          <strong>{formatCurrency(price, currency)}</strong>
          {(rating || ratingsCount || reviewCount) && (
            <RatingBadge
              value={rating}
              ratingsCount={ratingsCount ?? reviewCount ?? 0}
              reviewCount={reviewCount ?? 0}
              size="sm"
            />
          )}
        </div>
        <Button className="product-card__action product-card__buy-now" onClick={buyNow} disabled={id == null || buying}>
          {buying ? 'Opening checkout…' : <>Buy now <span aria-hidden="true">→</span></>}
        </Button>
        {error && <p className="field-error" role="alert">{error}</p>}
      </div>
    </article>
  );
}
