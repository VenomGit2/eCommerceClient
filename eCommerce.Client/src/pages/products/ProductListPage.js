import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import useCart from '../../hooks/useCart';
import useProductCategory from '../../hooks/useProductCategory';
import useProductSearch from '../../hooks/useProductSearch';
import useProducts from '../../hooks/useProducts';
import { PRODUCT_CATEGORIES, formatCategoryLabel } from '../../utils/productCategories';

export default function ProductListPage() {
  const { products, loading, error, reload } = useProducts();
  const { addItem, items: cartItems } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const initialSelectionHandled = useRef(false);
  const productSearch = useProductSearch();
  const categorySearch = useProductCategory();

  useEffect(() => {
    if (initialSelectionHandled.current) return;
    initialSelectionHandled.current = true;
    if (query) productSearch.search(query);
    else if (selectedCategory) categorySearch.loadCategory(selectedCategory);
  }, [query, selectedCategory, productSearch, categorySearch]);

  const submitSearch = (event) => {
    event.preventDefault();
    const productId = searchTerm.trim();
    if (!productId) return;
    categorySearch.clearCategory();
    setSearchParams({ q: productId });
    productSearch.search(productId);
  };

  const selectCategory = (event) => {
    const category = event.target.value;
    setSearchTerm('');
    productSearch.clear();
    if (!category) {
      categorySearch.clearCategory();
      setSearchParams({});
      return;
    }
    setSearchParams({ category });
    categorySearch.loadCategory(category);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSearchParams({});
    productSearch.clear();
    categorySearch.clearCategory();
  };

  const displayedProducts = productSearch.hasSearched
    ? (productSearch.product ? [productSearch.product] : [])
    : categorySearch.category
      ? categorySearch.products
      : products;
  const resultsLoading = productSearch.loading || categorySearch.loading;
  const resultsError = productSearch.error || categorySearch.error;
  const hasActiveFilter = productSearch.hasSearched || Boolean(categorySearch.category);

  if (loading) return <Loader label="Loading products" />;
  if (error) return <ErrorMessage message={error.message} onRetry={reload} />;

  return <section>
    <div className="catalog-heading">
      <div><p className="eyebrow">The full edit</p><h1>Shop all</h1><p>{products.length} products selected for better everyday living.</p></div>
      <form className="catalog-search" role="search" onSubmit={submitSearch}>
        <label className="sr-only" htmlFor="product-id-search">Search by product ID</label>
        <input id="product-id-search" type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Enter product ID" />
        <button type="submit" aria-label="Search products" disabled={!searchTerm.trim() || productSearch.loading}><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg></button>
      </form>
    </div>

    <div className="catalog-toolbar">
      <div className="category-filter">
        <label htmlFor="product-category-filter">Category</label>
        <select id="product-category-filter" value={categorySearch.category} onChange={selectCategory} disabled={resultsLoading}>
          <option value="">All products</option>
          {PRODUCT_CATEGORIES.map((category) => <option key={category} value={category}>{formatCategoryLabel(category)}</option>)}
        </select>
      </div>
      <span aria-live="polite">{resultsLoading ? 'Loading category…' : `${displayedProducts.length} ${displayedProducts.length === 1 ? 'product' : 'products'}`}</span>
      {hasActiveFilter && <button type="button" onClick={clearFilters}>Clear filters</button>}
    </div>

    {resultsLoading
      ? <Loader label={categorySearch.category ? `Loading ${formatCategoryLabel(categorySearch.category)}` : 'Searching products'} />
      : resultsError
        ? <ErrorMessage message={resultsError.message} onRetry={() => categorySearch.category ? categorySearch.loadCategory(categorySearch.category) : productSearch.search(searchTerm)} />
        : displayedProducts.length
          ? <div className="product-grid">{displayedProducts.map((product, index) => <ProductCard key={product.id ?? index} product={product} onAdd={addItem} isInCart={cartItems.some((item) => String(item.id) === String(product.id))} />)}</div>
          : <EmptyState title="No products found" message={categorySearch.category ? `There are no products in ${formatCategoryLabel(categorySearch.category)}.` : 'Check the product ID and try again.'} />}
  </section>;
}
