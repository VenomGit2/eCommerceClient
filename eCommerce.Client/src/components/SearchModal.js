import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAiSearch from '../hooks/useAiSearch';
import useRecentSearches from '../hooks/useRecentSearches';
import { ROUTES } from '../routes/routePaths';

export default function SearchModal({ open, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [term, setTerm] = useState('');
  const aiSearch = useAiSearch();
  const { clear: clearAiSearch } = aiSearch;
  const { recentSearches, addRecentSearch, clearRecentSearches } = useRecentSearches();

  useEffect(() => {
    if (open) {
      setTerm('');
      clearAiSearch();
      const focusTimer = setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(focusTimer);
    }
    return undefined;
  }, [open, clearAiSearch]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const goToProduct = (product) => {
    addRecentSearch(product);
    onClose();
    navigate(`${ROUTES.products}/${encodeURIComponent(product.id)}`);
  };

  const submitSearch = async (event) => {
    event.preventDefault();
    const query = term.trim();
    if (!query) return;
    await aiSearch.search(query);
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
            onChange={(event) => {
              setTerm(event.target.value);
              if (!event.target.value.trim()) aiSearch.clear();
            }}
            placeholder="Search products, brands, or describe what you need"
            aria-label="Search products"
          />
          <button type="submit" className="search-modal__submit" disabled={!term.trim() || aiSearch.loading} aria-label="Search with AI">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 .8 3.2A6.7 6.7 0 0 0 17.8 11l3.2 1-3.2 1a6.7 6.7 0 0 0-5 4.8L12 21l-.8-3.2A6.7 6.7 0 0 0 6.2 13L3 12l3.2-1a6.7 6.7 0 0 0 5-4.8L12 3Z" /></svg>
            <span>{aiSearch.loading ? 'Searching' : 'Search'}</span>
          </button>
          <button type="button" className="search-modal__close" onClick={onClose} aria-label="Close search">
            Esc
          </button>
        </form>

        {aiSearch.loading && <p className="search-modal__status">Finding the best matches…</p>}
        {aiSearch.error && <p className="search-modal__status search-modal__status--muted">{aiSearch.error}</p>}
        {aiSearch.searched && !aiSearch.loading && !aiSearch.error && aiSearch.products.length === 0 && (
          <p className="search-modal__status search-modal__status--muted">No matching products found.</p>
        )}
        {aiSearch.note && <p className="search-modal__status search-modal__status--muted">{aiSearch.note}</p>}
        {aiSearch.products.length > 0 && (
          <ul className="search-modal__list">
            {aiSearch.products.map((item) => (
              <li key={item.id}>
                <button type="button" className="search-modal__item" onClick={() => goToProduct(item)}>
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt="" className="search-modal__item-image" />
                    : <span className="search-modal__item-placeholder" aria-hidden="true">{item.name.charAt(0)}</span>}
                  <span className="search-modal__item-name">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {!aiSearch.searched && !aiSearch.loading && recentSearches.length > 0 && (
          <div className="search-modal__section">
            <div className="search-modal__section-head">
              <span>Recent searches</span>
              <button type="button" className="search-modal__clear" onClick={clearRecentSearches}>Clear</button>
            </div>
            <ul className="search-modal__list">
              {recentSearches.map((item) => (
                <li key={item.id}>
                  <button type="button" className="search-modal__item" onClick={() => goToProduct(item)}>
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
      </div>
    </div>
  );
}
