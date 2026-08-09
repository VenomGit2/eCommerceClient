import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import Table from '../../components/common/Table';
import useProducts from '../../hooks/useProducts';
import AdminProductTabs from './AdminProductTabs';
export default function AdminProductsPage() {
  const { products, loading, error, reload } = useProducts();
  if (loading) return null; if (error) return <ErrorMessage message={error.message} onRetry={reload} />;
  return <section><p className="eyebrow">Administration</p><h1>Products</h1><AdminProductTabs />{products.length ? <Table caption="Product catalog" rows={products} columns={[{ key: 'id', label: 'ID' }, { key: 'name', label: 'Name' }, { key: 'price', label: 'Price' }]} /> : <EmptyState title="No products available" />}</section>;
}
