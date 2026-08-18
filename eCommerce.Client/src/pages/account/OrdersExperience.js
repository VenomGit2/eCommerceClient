import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import OrderProductImage from '../../components/orders/OrderProductImage';
import OrderStatusBadge from '../../components/orders/OrderStatusBadge';
import CancelOrderAction from '../../components/orders/CancelOrderAction';
import { ROUTES } from '../../routes/routePaths';
import { formatCurrency } from '../../utils/currency';
import { canCancelOrder } from '../../utils/orderStatus';
import AccountTabs from '../../components/common/AccountTabs';

const formatOrderNumber = (orderId) => String(orderId || '').slice(0, 8).toUpperCase();

export default function OrdersExperience({ orders, loading, error, reload, payment, cancellation }) {
  const { pay, payingOrderId, paymentError } = payment;
  const { cancel, cancellingOrderId, cancellationError } = cancellation;

  return (
    <section className="orders-page" aria-busy={loading}>
      <AccountTabs />
      <header className="orders-page__header">
        <div><p className="eyebrow">Your account</p><h1>Orders</h1></div>
        {!loading && !error && <p>{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>}
      </header>
      {paymentError && <ErrorMessage message={paymentError} />}
      {cancellationError && <ErrorMessage message={cancellationError} />}
      {loading && <div className="section-status" role="status"><span className="loader__spinner" aria-hidden="true" />Loading your orders…</div>}
      {!loading && error && <ErrorMessage message={error.message} onRetry={reload} />}
      {!loading && !error && !orders.length && <EmptyState title="No orders yet" message="Your purchases will appear here." />}
      {!loading && !error && orders.length > 0 && (
        <div className="order-card-list">
          {orders.map((order) => {
            const items = order.orderItems ?? [];
            const showPaymentStatus = order.inventoryStatus !== 'Cancelled' || order.paymentStatus === 'Paid';
            return (
              <article className="order-card" key={order.orderID}>
                <Link className="order-card__link" to={`${ROUTES.orders}/${order.orderID}`} aria-label={`View order ${formatOrderNumber(order.orderID)}`}>
                  <div className="order-card__topline">
                    <div><span className="order-card__label">Order</span><strong>#{formatOrderNumber(order.orderID)}</strong></div>
                    <time dateTime={order.orderDate}>{new Date(order.orderDate).toLocaleDateString()}</time>
                  </div>
                  <div className="order-card__body">
                    <div className="order-card__products" aria-label={`${items.length} ordered products`}>
                      {items.slice(0, 3).map((item) => (
                        <div className="order-card__product" key={item.productID}>
                          <OrderProductImage item={item} />
                          <div><strong>{item.productName || 'Product'}</strong><span>Qty {item.quantity}</span></div>
                        </div>
                      ))}
                      {items.length > 3 && <span className="order-card__more">+{items.length - 3} more</span>}
                    </div>
                    <div className="order-card__summary">
                      <div className="order-card__statuses"><OrderStatusBadge type="inventory" status={order.inventoryStatus} paymentStatus={order.paymentStatus} />{showPaymentStatus && <OrderStatusBadge type="payment" status={order.paymentStatus} transactionID={order.transactionID} />}</div>
                      <div className="order-card__total"><span>Total</span><strong>{formatCurrency(order.totalBill)}</strong></div>
                    </div>
                  </div>
                  <span className="order-card__view">View order details</span>
                </Link>
                {order.inventoryStatus === 'Reserved' && order.paymentStatus !== 'Paid' && (
                  <div className="order-card__action">
                    <Button onClick={() => pay(order, reload)} disabled={payingOrderId === order.orderID}>{payingOrderId === order.orderID ? 'Opening…' : 'Pay now'}</Button>
                    {canCancelOrder(order) && <CancelOrderAction orderId={order.orderID} cancelling={cancellingOrderId === order.orderID} onConfirm={(id) => cancel(id, reload)} />}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
