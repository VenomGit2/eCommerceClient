import { Link } from 'react-router-dom';
import AccountTabs from '../../components/common/AccountTabs';
import Button from '../../components/common/Button';
import CopyButton from '../../components/common/CopyButton';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingState from '../../components/common/LoadingState';
import CancelOrderAction from '../../components/orders/CancelOrderAction';
import OrderProductImage from '../../components/orders/OrderProductImage';
import OrderStatusBadge from '../../components/orders/OrderStatusBadge';
import Pagination from '../../components/pagination/Pagination';
import { ROUTES } from '../../routes/routePaths';
import { formatCurrency } from '../../utils/currency';
import { canCancelOrder } from '../../utils/orderStatus';

const formatOrderNumber = (orderId) => String(orderId || '').slice(0, 8).toUpperCase();

function OrderCard({ order, payment, cancellation, reload }) {
  const { pay, payingOrderId } = payment;
  const { cancel, cancellingOrderId } = cancellation;
  const items = order.orderItems ?? [];
  const orderNumber = formatOrderNumber(order.orderID);
  const awaitingPayment = order.inventoryStatus === 'Reserved' && order.paymentStatus !== 'Paid';
  const showPaymentStatus = order.inventoryStatus !== 'Cancelled' || order.paymentStatus === 'Paid';

  return (
    <article className="order-card">
      <Link
        className="order-card__link"
        to={`${ROUTES.orders}/${order.orderID}`}
        aria-label={`View order ${orderNumber}`}
      >
        <div className="order-card__topline">
          <div>
            <span className="order-card__label">Order</span>
            <div className="order-card__number-row">
              <strong>#{orderNumber}</strong>
              <CopyButton
                value={String(order.orderID)}
                iconOnly
                label="Copy order ID"
                aria-label="Copy order ID"
                title="Copy order ID"
              />
            </div>
          </div>
          <time dateTime={order.orderDate}>{new Date(order.orderDate).toLocaleDateString()}</time>
        </div>

        <div className="order-card__body">
          <div className="order-card__products" aria-label={`${items.length} ordered products`}>
            {items.slice(0, 3).map((item) => (
              <div className="order-card__product" key={item.productID}>
                <OrderProductImage item={item} />
                <div>
                  <strong>{item.productName || 'Product'}</strong>
                  <span>Qty {item.quantity}</span>
                </div>
              </div>
            ))}
            {items.length > 3 && <span className="order-card__more">+{items.length - 3} more</span>}
          </div>

          <div className="order-card__summary">
            <div className="order-card__statuses">
              <OrderStatusBadge
                type="inventory"
                status={order.inventoryStatus}
                paymentStatus={order.paymentStatus}
              />
              {showPaymentStatus && (
                <OrderStatusBadge
                  type="payment"
                  status={order.paymentStatus}
                  transactionID={order.transactionID}
                />
              )}
            </div>
            <div className="order-card__total">
              <span>Total</span>
              <strong>{formatCurrency(order.totalBill)}</strong>
            </div>
          </div>
        </div>
        <span className="order-card__view">View order details</span>
      </Link>

      {awaitingPayment && (
        <div className="order-card__action">
          <Button
            onClick={() => pay(order, reload)}
            disabled={payingOrderId === order.orderID}
          >
            {payingOrderId === order.orderID ? 'Opening...' : 'Pay now'}
          </Button>
          {canCancelOrder(order) && (
            <CancelOrderAction
              orderId={order.orderID}
              cancelling={cancellingOrderId === order.orderID}
              onConfirm={(id) => cancel(id, reload)}
            />
          )}
        </div>
      )}
    </article>
  );
}

export default function OrdersExperience({
  orders,
  loading,
  error,
  reload,
  payment,
  cancellation,
  pagination,
}) {
  const showOrders = !loading && !error && orders.length > 0;

  return (
    <section className="orders-page" aria-busy={loading}>
      <AccountTabs />
      <header className="orders-page__header">
        <div>
          <p className="eyebrow">Your account</p>
          <h1>Orders</h1>
        </div>
        {!loading && !error && (
          <p>{pagination.totalItems} {pagination.totalItems === 1 ? 'order' : 'orders'}</p>
        )}
      </header>

      {payment.paymentError && <ErrorMessage message={payment.paymentError} />}
      {cancellation.cancellationError && <ErrorMessage message={cancellation.cancellationError} />}
      {loading && <LoadingState>Loading your orders...</LoadingState>}
      {!loading && error && <ErrorMessage message={error.message} onRetry={reload} />}
      {!loading && !error && !orders.length && (
        <EmptyState title="No orders yet" message="Your purchases will appear here." />
      )}

      {showOrders && (
        <div className="order-card-list">
          {orders.map((order) => (
            <OrderCard
              key={order.orderID}
              order={order}
              payment={payment}
              cancellation={cancellation}
              reload={reload}
            />
          ))}
        </div>
      )}

      {showOrders && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
          label="Order history pages"
        />
      )}
    </section>
  );
}
