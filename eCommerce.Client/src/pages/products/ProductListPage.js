import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingState from '../../components/common/LoadingState';
import LoadMoreButton from '../../components/pagination/LoadMoreButton';
import useCart from '../../hooks/useCart';
import useProductSearch from '../../hooks/useProductSearch';
import useProducts from '../../hooks/useProducts';
import { PRODUCT_CATEGORIES, formatCategoryLabel } from '../../utils/productCategories';

export default function ProductListPage() {
  const { addItem, items: cartItems } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || '';
  const [searchTerm, setSearchTerm] = useState(query);

  const {
    products,
    totalItems,
    hasMore,
    loading,
    loadingMore,
    error,
    reload,
    loadMore,
  } = useProducts({ category: selectedCategory });
  const {
    product: searchedProduct,
    loading: searchLoading,
    error: searchError,
    hasSearched,
    search,
    clear: clearSearch,
  } = useProductSearch();

  useEffect(() => {
    setSearchTerm(query);
    if (query) {
      search(query);
    } else {
      clearSearch();
    }
  }, [clearSearch, query, search]);

  const cartProductIds = useMemo(
    () => new Set(cartItems.map((item) => String(item.id))),
    [cartItems],
  );
  const displayedProducts = hasSearched
    ? (searchedProduct ? [searchedProduct] : [])
    : products;
  const hasActiveFilter = hasSearched || Boolean(selectedCategory);

  const submitSearch = (event) => {
    event.preventDefault();
    const productId = searchTerm.trim();
    if (!productId) return;

    if (productId === query) {
      search(productId);
    } else {
      setSearchParams({ q: productId });
    }
  };

  const selectCategory = (event) => {
    const category = event.target.value;
    setSearchParams(category ? { category } : {});
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  if (loading) return <LoadingState>Loading products...</LoadingState>;
  if (error && !products.length) return <ErrorMessage message={error.message} onRetry={reload} />;

  let results;
  if (searchLoading) {
    results = null;
  } else if (searchError) {
    results = <ErrorMessage message={searchError.message} onRetry={() => search(searchTerm)} />;
  } else if (!displayedProducts.length) {
    const message = selectedCategory
      ? `There are no products in ${formatCategoryLabel(selectedCategory)}.`
      : 'Check the product ID and try again.';
    results = <EmptyState title="No products found" message={message} />;
  } else {
    results = (
      <>
        <div className="product-grid">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={addItem}
              isInCart={cartProductIds.has(String(product.id))}
            />
          ))}
        </div>
        {error && <ErrorMessage message={error.message} onRetry={loadMore} />}
        {!hasSearched && hasMore && (
          <LoadMoreButton loading={loadingMore} onClick={loadMore} loadingLabel="Loading more products...">
            Load more products
          </LoadMoreButton>
        )}
      </>
    );
  }

  return (
    <section>
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">The full edit</p>
          <h1>Shop all</h1>
          <p>{totalItems} products selected for better everyday living.</p>
        </div>
        <form className="catalog-search" role="search" onSubmit={submitSearch}>
          <label className="sr-only" htmlFor="product-id-search">Search by product ID</label>
          <input
            id="product-id-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Enter product ID"
          />
          <button
            type="submit"
            aria-label="Search products"
            disabled={!searchTerm.trim() || searchLoading}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </button>
        </form>
      </div>

      <div className="catalog-toolbar">
        <div className="category-filter">
          <label htmlFor="product-category-filter">Category</label>
          <select
            id="product-category-filter"
            value={selectedCategory}
            onChange={selectCategory}
            disabled={searchLoading}
          >
            <option value="">All products</option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>{formatCategoryLabel(category)}</option>
            ))}
          </select>
        </div>
        <span aria-live="polite">
          {searchLoading
            ? 'Searching products...'
            : `Showing ${displayedProducts.length} of ${hasSearched ? displayedProducts.length : totalItems} products`}
        </span>
        {hasActiveFilter && <button type="button" onClick={clearFilters}>Clear filters</button>}
      </div>

      {results}
    </section>
  );
}
