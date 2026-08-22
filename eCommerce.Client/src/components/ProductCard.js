import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';
import Button from './common/Button';
import WishlistButton from './WishlistButton';

export default function ProductCard({ product, onAdd, isInCart = false }) {
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const { id, name, imageUrl, price, currency, category, rating, discountPercentage } = product;

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

  const exploreProduct = (event) => {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width;
    const vertical = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty('--card-rotate-x', `${(vertical - 0.5) * -14}deg`);
    event.currentTarget.style.setProperty('--card-rotate-y', `${(horizontal - 0.5) * 18}deg`);
    event.currentTarget.style.setProperty('--card-light-x', `${horizontal * 100}%`);
    event.currentTarget.style.setProperty('--card-light-y', `${vertical * 100}%`);
  };

  const resetProduct = (event) => {
    event.currentTarget.style.removeProperty('--card-rotate-x');
    event.currentTarget.style.removeProperty('--card-rotate-y');
    event.currentTarget.style.removeProperty('--card-light-x');
    event.currentTarget.style.removeProperty('--card-light-y');
  };

  return (
    <article className="card product-card">
      <WishlistButton product={product} className="product-card__wishlist" />
      <Link className="product-card__media" to={`/products/${encodeURIComponent(id)}`} aria-label={`View ${name}`} onPointerMove={exploreProduct} onPointerLeave={resetProduct}>
        {discountPercentage > 10 && <span className="product-card__badge">-{Math.round(discountPercentage)}%</span>}
        <span className="product-card__3d-hint" aria-hidden="true">Explore 3D</span>
        <span className="product-card__view" aria-hidden="true">View details <span>↗</span></span>
        {imageUrl
          ? <img src={imageUrl} alt={name || 'Product'} loading="lazy" width="360" height="360" />
          : <span className="product-card__placeholder" aria-hidden="true">{name?.charAt(0)}</span>}
      </Link>
      <div className="card__body">
        {category && <span className="product-card__category">{category}</span>}
        <h2><Link to={`/products/${encodeURIComponent(id)}`}>{name}</Link></h2>
        <div className="product-card__meta">
          <strong>{formatCurrency(price, currency)}</strong>
          {rating && <span aria-label={`Rated ${rating} out of 5`}><span aria-hidden="true">★</span> {rating}</span>}
        </div>
        {isInCart
          ? <Link className="button button--primary product-card__action is-in-cart" to="/cart">Go to cart <span aria-hidden="true">→</span></Link>
          : <Button className={`product-card__action ${added ? 'is-added' : ''}`} onClick={addToCart} disabled={id == null || adding || added} aria-live="polite">
            {adding ? 'Adding…' : added ? 'Added to cart ✓' : 'Add to cart'}
          </Button>}
        {error && <p className="field-error" role="alert">{error}</p>}
      </div>
    </article>
  );
}
