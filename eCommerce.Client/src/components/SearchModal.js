import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useProductSearch from '../hooks/useProductSearch';
import useRecentSearches from '../hooks/useRecentSearches';
import { ROUTES } from '../routes/routePaths';

export default function SearchModal({ open, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [term, setTerm] = useState('');
  const { loading, error, search, clear } = useProductSearch();
  const { recentSearches, addRecentSearch, clearRecentSearches } = useRecentSearches();

  useEffect(() => {
    if (open) {
      setTerm('');
      clear();
      const focusTimer = setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(focusTimer);
    }
    return undefined;
  }, [open, clear]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const goToProduct = (productId) => {
    onClose();
    navigate(`${ROUTES.products}/${encodeURIComponent(productId)}`);
  };

  const submitSearch = async (event) => {
    event.preventDefault();
    const productId = term.trim();
    if (!productId) return;
    const product = await search(productId);
    if (product) {
      addRecentSearch(product);
      goToProduct(product.id);
    }
  };

  return (
    <div className="search-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="search-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        onClick={(event) => event.stopPropagation()}
      >
        <form className="search-modal__form" onSubmit={submitSearch}>
          <svg className="search-modal__icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            className="search-modal__input"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Enter product ID"
            aria-label="Product ID"
          />
          <button type="button" className="search-modal__close" onClick={onClose} aria-label="Close search">
            Esc
          </button>
        </form>

        {loading && <p className="search-modal__status">Searching…</p>}
        {error && !loading && <p className="search-modal__status search-modal__status--error">No product found with this ID.</p>}

        {!loading && recentSearches.length > 0 && (
          <div className="search-modal__section">
            <div className="search-modal__section-head">
              <span>Recent searches</span>
              <button type="button" className="search-modal__clear" onClick={clearRecentSearches}>Clear</button>
            </div>
            <ul className="search-modal__list">
              {recentSearches.map((item) => (
                <li key={item.id}>
                  <button type="button" className="search-modal__item" onClick={() => goToProduct(item.id)}>
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt="" className="search-modal__item-image" />
                      : <span className="search-modal__item-placeholder" aria-hidden="true">{item.name.charAt(0)}</span>}
                    <span className="search-modal__item-name">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!loading && recentSearches.length === 0 && !error && (
          <p className="search-modal__status search-modal__status--muted">
            Type a product ID and press Enter to jump straight to it.
          </p>
        )}
      </div>
    </div>
  );
}