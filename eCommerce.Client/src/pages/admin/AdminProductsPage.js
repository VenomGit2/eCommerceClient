import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingState from '../../components/common/LoadingState';
import Table from '../../components/common/Table';
import LoadMoreButton from '../../components/pagination/LoadMoreButton';
import useProducts from '../../hooks/useProducts';
import AdminProductTabs from './AdminProductTabs';

const PRODUCT_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'price', label: 'Price' },
];

function ProductsLayout({ children }) {
  return (
    <section className="admin-page">
      <div className="admin-page__heading">
        <p className="eyebrow">Administration</p>
        <h1>Products</h1>
      </div>
      <AdminProductTabs />
      {children}
    </section>
  );
}

export default function AdminProductsPage() {
  const {
    products,
    loading,
    loadingMore,
    hasMore,
    error,
    reload,
    loadMore,
  } = useProducts();

  if (loading) {
    return <ProductsLayout><LoadingState>Loading products...</LoadingState></ProductsLayout>;
  }

  if (error && !products.length) {
    return <ProductsLayout><ErrorMessage message={error.message} onRetry={reload} /></ProductsLayout>;
  }

  if (!products.length) {
    return <ProductsLayout><EmptyState title="No products available" /></ProductsLayout>;
  }

  return (
    <ProductsLayout>
      <Table caption="Product catalog" rows={products} columns={PRODUCT_COLUMNS} />
      {error && <ErrorMessage message={error.message} onRetry={loadMore} />}
      {hasMore && (
        <LoadMoreButton loading={loadingMore} onClick={loadMore} loadingLabel="Loading more products...">
          Load more products
        </LoadMoreButton>
      )}
    </ProductsLayout>
  );
}
