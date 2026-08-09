import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import Table from '../../components/common/Table';
import useAsync from '../../hooks/useAsync';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';
import { getOrders } from '../../services/orderService';
import { getCollection } from '../../utils/apiResponse';
import { formatCurrency } from '../../utils/currency';

export default function OrdersPage() {
  const API = useAxios();
  const { session } = useAuth();
  const { data, loading, error, reload } = useAsync(
    (signal) => getOrders(API, signal),
    [API, session?.token],
  );
  const orders = getCollection(data);

  if (loading) return null;
  if (error) return <ErrorMessage message={error.message} onRetry={reload} />;

  const columns = [
    { key: 'orderID', label: 'Order' },
    { key: 'orderDate', label: 'Date', render: (order) => new Date(order.orderDate).toLocaleString() },
    { key: 'orderItems', label: 'Products', render: (order) => order.orderItems?.length ?? 0 },
    { key: 'totalBill', label: 'Total', render: (order) => formatCurrency(order.totalBill) },
  ];

  return <section><h1>Orders</h1>{orders.length ? <Table caption="Order history" rows={orders} columns={columns} rowKey="orderID" /> : <EmptyState title="No orders yet" message="Your completed orders will appear here." />}</section>;
}
