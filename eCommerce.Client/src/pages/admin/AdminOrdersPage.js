import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import Table from '../../components/common/Table';
import useAsync from '../../hooks/useAsync';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';
import { getOrders } from '../../services/orderService';
import { getCollection } from '../../utils/apiResponse';
import { formatCurrency } from '../../utils/currency';
import AdminProductTabs from './AdminProductTabs';
import OrderStatusBadge from '../../components/orders/OrderStatusBadge';
import CancelOrderAction from '../../components/orders/CancelOrderAction';
import useOrderCancellation from '../../hooks/useOrderCancellation';
import AdminOrderProducts from './AdminOrderProducts';

export default function AdminOrdersPage() {
  const API = useAxios();
  const { session } = useAuth();
  const result = useAsync(
    (signal) => getOrders(API, signal),
    [API, session?.token],
  );
  const orders = getCollection(result.data);
  const { cancel, cancellingOrderId, cancellationError } = useOrderCancellation();

  if (result.loading) return <section className="admin-page"><div className="admin-page__heading"><p className="eyebrow">Administration</p><h1>Orders</h1></div><AdminProductTabs /><div className="section-status" role="status"><span className="loader__spinner" aria-hidden="true" />Loading orders…</div></section>;
  if (result.error) return <section className="admin-page"><div className="admin-page__heading"><p className="eyebrow">Administration</p><h1>Orders</h1></div><AdminProductTabs /><ErrorMessage message={result.error.message} onRetry={result.reload} /></section>;

  const columns = [
    { key: 'orderID', label: 'Order', render: (order) => <code className="admin-order-reference" title={order.orderID}>#{String(order.orderID).slice(0, 8).toUpperCase()}</code> },
    { key: 'userID', label: 'Customer name', render: (order) => <span className="admin-order-customer"><span>Customer</span><strong>{order.userName || order.customerName || order.email || 'Unknown customer'}</strong><small>User ID {order.userID}</small></span> },
    { key: 'orderItems', label: 'Products', render: (order) => <AdminOrderProducts items={order.orderItems} /> },
    { key: 'orderDate', label: 'Date', render: (order) => <time className="admin-order-date" dateTime={order.orderDate}>{new Date(order.orderDate).toLocaleString()}</time> },
    { key: 'totalBill', label: 'Total', render: (order) => <span className="admin-order-total">{formatCurrency(order.totalBill)}</span> },
    { key: 'inventoryStatus', label: 'Order status', render: (order) => <><OrderStatusBadge type="inventory" status={order.inventoryStatus} paymentStatus={order.paymentStatus} />{order.inventoryStatus === 'Cancelled' && order.paymentStatus === 'Paid' && <small className="admin-refund-warning">Refund required</small>}</> },
    { key: 'paymentStatus', label: 'Payment', render: (order) => <OrderStatusBadge type="payment" status={order.paymentStatus} transactionID={order.transactionID} /> },
    { key: 'actions', label: 'Actions', render: (order) => order.inventoryStatus === 'Cancelled' ? '—' : <CancelOrderAction orderId={order.orderID} cancelling={cancellingOrderId === order.orderID} onConfirm={(id) => cancel(id, result.reload)} title="Cancel customer order?" description={order.paymentStatus === 'Paid' ? 'This cancels fulfilment and returns stock. The payment remains recorded as paid and is not refunded automatically. Process the Razorpay refund separately.' : 'This cancels the customer order and returns any reserved stock. This action cannot be undone.'} /> },
  ];

  return <section className="admin-page"><div className="admin-page__heading"><p className="eyebrow">Administration</p><h1>Orders</h1></div><AdminProductTabs />{cancellationError && <ErrorMessage message={cancellationError} />}{orders.length ? <Table caption="Customer orders" rows={orders} columns={columns} rowKey="orderID" /> : <EmptyState title="No orders available" />}</section>;
}
