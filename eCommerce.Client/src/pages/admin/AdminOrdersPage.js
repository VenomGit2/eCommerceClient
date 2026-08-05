import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import Table from '../../components/common/Table';
import useAsync from '../../hooks/useAsync';
import useAuth from '../../hooks/useAuth';
import { getOrders } from '../../services/orderService';
import { getCollection } from '../../utils/apiResponse';
export default function AdminOrdersPage() {
  const { session } = useAuth(); const result = useAsync((signal) => getOrders(session?.token, signal), [session?.token]); const orders = getCollection(result.data);
  if (result.loading) return <Loader label="Loading orders" />; if (result.error) return <ErrorMessage message={result.error.message} onRetry={result.reload} />;
  return <section><p className="eyebrow">Administration</p><h1>Orders</h1>{orders.length ? <Table caption="Customer orders" rows={orders} columns={[{ key: 'id', label: 'Order' }, { key: 'userId', label: 'Customer' }, { key: 'total', label: 'Total' }]} /> : <EmptyState title="No orders available" />}</section>;
}
