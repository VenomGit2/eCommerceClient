import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadMoreButton from '../../components/pagination/LoadMoreButton';
import useCart from '../../hooks/useCart';
import usePageMeta from '../../hooks/usePageMeta';
import useProducts from '../../hooks/useProducts';
import { PRODUCT_CATEGORIES, formatCategoryLabel } from '../../utils/productCategories';

export default function ProductListPage() {
  const { addItem, items: cartItems } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';

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

  usePageMeta(
    {
      title: 'Shop All',
      description: `Browse ${totalItems || 'all'} products selected for better everyday living.`,
      url: `${process.env.REACT_APP_SITE_URL || 'https://ecommerceclient.insanedk46.workers.dev'}/products`,
    },
    [totalItems],
  );

  const cartProductIds = useMemo(
    () => new Set(cartItems.map((item) => String(item.id))),
    [cartItems],
  );

  const selectCategory = (event) => {
    const category = event.target.value;
    setSearchParams(category ? { category } : {});
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  if (loading) return null;
  if (error && !products.length) return <ErrorMessage message={error.message} onRetry={reload} />;

  let results;
  if (!products.length) {
    const message = selectedCategory
      ? `There are no products in ${formatCategoryLabel(selectedCategory)}.`
      : 'Check back soon for new arrivals.';
    results = <EmptyState title="No products found" message={message} />;
  } else {
    results = (
      <>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={addItem}
              isInCart={cartProductIds.has(String(product.id))}
            />
          ))}
        </div>
        {error && <ErrorMessage message={error.message} onRetry={loadMore} />}
        {hasMore && (
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
      </div>

      <div className="catalog-toolbar">
        <div className="category-filter">
          <label htmlFor="product-category-filter">Category</label>
          <select
            id="product-category-filter"
            value={selectedCategory}
            onChange={selectCategory}
          >
            <option value="">All products</option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>{formatCategoryLabel(category)}</option>
            ))}
          </select>
        </div>
        <span aria-live="polite">
          Showing {products.length} of {totalItems} products
        </span>
        {selectedCategory && <button type="button" onClick={clearFilters}>Clear filters</button>}
      </div>

      {results}
    </section>
  );
}