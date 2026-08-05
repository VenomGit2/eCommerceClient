import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import Table from '../../components/common/Table';
import useAsync from '../../hooks/useAsync';
import useAuth from '../../hooks/useAuth';
import { getOrders } from '../../services/orderService';
import { getCollection } from '../../utils/apiResponse';
export default function OrdersPage() {
  const { session } = useAuth(); const { data, loading, error, reload } = useAsync((signal) => getOrders(session?.token, signal), [session?.token]); const orders = getCollection(data);
  if (loading) return <Loader label="Loading orders" />; if (error) return <ErrorMessage message={error.message} onRetry={reload} />;
  return <section><h1>Orders</h1>{orders.length ? <Table caption="Order history" rows={orders} columns={[{ key: 'id', label: 'Order' }, { key: 'totalProducts', label: 'Products' }, { key: 'total', label: 'Total' }]} /> : <EmptyState title="No orders yet" message="Your completed orders will appear here." />}</section>;
}
