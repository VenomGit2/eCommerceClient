import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import Table from '../../components/common/Table';
import useProducts from '../../hooks/useProducts';
import useAuth from '../../hooks/useAuth';
import AdminProductTabs from './AdminProductTabs';
export default function AdminProductsPage() {
  const { isSuperadmin } = useAuth();
  const { products, loading, error, reload } = useProducts();
  if (loading) return <Loader label="Loading products" />; if (error) return <ErrorMessage message={error.message} onRetry={reload} />;
  return <section><p className="eyebrow">Administration</p><h1>Products</h1>{isSuperadmin && <AdminProductTabs />}{products.length ? <Table caption="Product catalog" rows={products} columns={[{ key: 'id', label: 'ID' }, { key: 'name', label: 'Name' }, { key: 'price', label: 'Price' }]} /> : <EmptyState title="No products available" />}</section>;
}
