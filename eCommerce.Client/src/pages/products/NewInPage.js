import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import useCart from '../../hooks/useCart';
import useProducts from '../../hooks/useProducts';
import { ROUTES } from '../../routes/routePaths';

const getAddedTime = (product) => {
  const value = product.createdAt ?? product.dateAdded ?? product.createdDate;
  const time = value ? new Date(value).getTime() : 0;
  return Number.isNaN(time) ? 0 : time;
};

export default function NewInPage() {
  const { products, loading, error, reload } = useProducts();
  const { addItem, items: cartItems } = useCart();
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');

  const categories = useMemo(() => [
    'All',
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ], [products]);

  const displayedProducts = useMemo(() => {
    const filtered = category === 'All'
      ? products
      : products.filter((product) => product.category === category);
    return [...filtered].sort((first, second) => {
      if (sort === 'price-low') return Number(first.price) - Number(second.price);
      if (sort === 'price-high') return Number(second.price) - Number(first.price);
      if (sort === 'name') return String(first.name).localeCompare(String(second.name));
      return getAddedTime(second) - getAddedTime(first);
    });
  }, [products, category, sort]);

  const featuredProduct = products[0];

  return (
    <div className="new-in-page">
      <section className="new-in-hero" aria-labelledby="new-in-title">
        <div className="new-in-hero__copy">
          <p className="eyebrow">Just landed / Catalog 2026</p>
          <h1 id="new-in-title">NEW<br />IN</h1>
          <p>Fresh arrivals, considered essentials and the latest additions to the Circuit &amp; Grain catalog.</p>
          <a className="comet-link" href="#new-in-collection">Explore the drop <span aria-hidden="true">↓</span></a>
        </div>
        <Link className="new-in-hero__feature" to={featuredProduct?.id ? `${ROUTES.products}/${encodeURIComponent(featuredProduct.id)}` : ROUTES.products}>
          <span className="new-in-hero__count">{String(products.length).padStart(2, '0')} pieces</span>
          {featuredProduct?.imageUrl
            ? <img src={featuredProduct.imageUrl} alt={featuredProduct.name || 'Featured new product'} width="680" height="680" />
            : <span className="new-in-hero__placeholder" aria-hidden="true">N</span>}
          <span className="new-in-hero__caption"><strong>{featuredProduct?.name || 'Explore the collection'}</strong><span>View product ↗</span></span>
        </Link>
      </section>

      <section id="new-in-collection" className="new-in-collection" aria-labelledby="new-in-collection-title">
        <div className="new-in-intro">
          <div><p className="eyebrow">The latest edit</p><h2 id="new-in-collection-title">Fresh from the catalog</h2></div>
          <p>Every newly available product, in one place. Filter the edit or sort it your way.</p>
        </div>

        <div className="new-in-toolbar">
          <div className="new-in-filters" aria-label="Filter new products by category">
            {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <div className="new-in-sort">
            <span aria-live="polite">{displayedProducts.length} {displayedProducts.length === 1 ? 'item' : 'items'}</span>
            <label htmlFor="new-in-sort">Sort by</label>
            <select id="new-in-sort" value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="newest">Newest first</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {loading
          ? null
          : error
            ? <ErrorMessage message={error.message} onRetry={reload} />
            : displayedProducts.length
              ? <div className="product-grid new-in-grid">{displayedProducts.map((product, index) => <ProductCard key={product.id ?? index} product={product} onAdd={addItem} isInCart={cartItems.some((item) => String(item.id) === String(product.id))} />)}</div>
              : <EmptyState title="No arrivals in this category" message="Choose another category to continue browsing." />}
      </section>
    </div>
  );
}
