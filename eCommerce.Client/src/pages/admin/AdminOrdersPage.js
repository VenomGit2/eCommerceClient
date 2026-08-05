import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import Table from '../../components/common/Table';
import useAsync from '../../hooks/useAsync';
import useAuth from '../../hooks/useAuth';
import { getOrders } from '../../services/orderService';
import { getCollection } from '../../utils/apiResponse';
import { formatCurrency } from '../../utils/currency';

export default function AdminOrdersPage() {
  const { session } = useAuth();
  const result = useAsync(
    (signal) => getOrders(session?.token, signal),
    [session?.token],
  );
  const orders = getCollection(result.data);

  if (result.loading) return <Loader label="Loading orders" />;
  if (result.error) return <ErrorMessage message={result.error.message} onRetry={result.reload} />;

  const columns = [
    { key: 'orderID', label: 'Order' },
    { key: 'userID', label: 'Customer' },
    { key: 'orderDate', label: 'Date', render: (order) => new Date(order.orderDate).toLocaleString() },
    { key: 'totalBill', label: 'Total', render: (order) => formatCurrency(order.totalBill) },
  ];

  return <section><p className="eyebrow">Administration</p><h1>Orders</h1>{orders.length ? <Table caption="Customer orders" rows={orders} columns={columns} rowKey="orderID" /> : <EmptyState title="No orders available" />}</section>;
}
