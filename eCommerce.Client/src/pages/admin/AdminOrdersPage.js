import CopyButton from '../../components/common/CopyButton';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingState from '../../components/common/LoadingState';
import Table from '../../components/common/Table';
import CancelOrderAction from '../../components/orders/CancelOrderAction';
import OrderStatusBadge from '../../components/orders/OrderStatusBadge';
import Pagination from '../../components/pagination/Pagination';
import useOrderCancellation from '../../hooks/useOrderCancellation';
import usePaginatedOrders from '../../hooks/pagination/usePaginatedOrders';
import { formatCurrency } from '../../utils/currency';
import AdminOrderProducts from './AdminOrderProducts';
import AdminProductTabs from './AdminProductTabs';

function OrdersLayout({ children }) {
  return (
    <section className="admin-page">
      <div className="admin-page__heading">
        <p className="eyebrow">Administration</p>
        <h1>Orders</h1>
      </div>
      <AdminProductTabs />
      {children}
    </section>
  );
}

export default function AdminOrdersPage() {
  const { orders, page, changePage, loading, error, reload } = usePaginatedOrders();
  const { cancel, cancellingOrderId, cancellationError } = useOrderCancellation();

  if (loading) {
    return <OrdersLayout><LoadingState>Loading orders...</LoadingState></OrdersLayout>;
  }

  if (error) {
    return <OrdersLayout><ErrorMessage message={error.message} onRetry={reload} /></OrdersLayout>;
  }

  const columns = [
    {
      key: 'orderID',
      label: 'Order',
      render: (order) => (
        <span className="admin-order-id-cell">
          <code className="admin-order-reference" title={order.orderID}>
            #{String(order.orderID).slice(0, 8).toUpperCase()}
          </code>
          <CopyButton
            value={String(order.orderID)}
            iconOnly
            label="Copy order ID"
            aria-label="Copy order ID"
            title="Copy order ID"
          />
        </span>
      ),
    },
    {
      key: 'userID',
      label: 'Customer name',
      render: (order) => (
        <span className="admin-order-customer">
          <span>Customer</span>
          <strong>{order.userName || order.customerName || order.email || 'Unknown customer'}</strong>
          <small>User ID {order.userID}</small>
        </span>
      ),
    },
    {
      key: 'orderItems',
      label: 'Products',
      render: (order) => <AdminOrderProducts items={order.orderItems} />,
    },
    {
      key: 'orderDate',
      label: 'Date',
      render: (order) => (
        <time className="admin-order-date" dateTime={order.orderDate}>
          {new Date(order.orderDate).toLocaleString()}
        </time>
      ),
    },
    {
      key: 'totalBill',
      label: 'Total',
      render: (order) => <span className="admin-order-total">{formatCurrency(order.totalBill)}</span>,
    },
    {
      key: 'inventoryStatus',
      label: 'Order status',
      render: (order) => (
        <>
          <OrderStatusBadge
            type="inventory"
            status={order.inventoryStatus}
            paymentStatus={order.paymentStatus}
          />
          {order.inventoryStatus === 'Cancelled' && order.paymentStatus === 'Paid' && (
            <small className="admin-refund-warning">Refund required</small>
          )}
        </>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (order) => (
        <OrderStatusBadge
          type="payment"
          status={order.paymentStatus}
          transactionID={order.transactionID}
        />
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (order) => {
        if (order.inventoryStatus === 'Cancelled') return '—';

        const description = order.paymentStatus === 'Paid'
          ? 'This cancels fulfilment and returns stock. The payment remains recorded as paid and is not refunded automatically. Process the Razorpay refund separately.'
          : 'This cancels the customer order and returns any reserved stock. This action cannot be undone.';

        return (
          <CancelOrderAction
            orderId={order.orderID}
            cancelling={cancellingOrderId === order.orderID}
            onConfirm={(id) => cancel(id, reload)}
            title="Cancel customer order?"
            description={description}
          />
        );
      },
    },
  ];

  if (!orders.length) {
    return (
      <OrdersLayout>
        {cancellationError && <ErrorMessage message={cancellationError} />}
        <EmptyState title="No orders available" />
      </OrdersLayout>
    );
  }

  return (
    <OrdersLayout>
      {cancellationError && <ErrorMessage message={cancellationError} />}
      <Table caption="Customer orders" rows={orders} columns={columns} rowKey="orderID" />
      <Pagination
        currentPage={page.pageNumber}
        totalPages={page.totalPages}
        onPageChange={changePage}
        label="Customer order pages"
      />
    </OrdersLayout>
  );
}
