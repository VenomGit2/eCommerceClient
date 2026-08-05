import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';
import Button from './common/Button';

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

  return (
    <article className="card product-card">
      <Link className="product-card__media" to={`/products/${encodeURIComponent(id)}`} aria-label={`View ${name}`}>
        {discountPercentage > 10 && <span className="product-card__badge">-{Math.round(discountPercentage)}%</span>}
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
