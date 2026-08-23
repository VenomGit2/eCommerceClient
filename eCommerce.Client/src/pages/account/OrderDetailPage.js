import { Link, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingState from '../../components/common/LoadingState';
import OrderProductImage from '../../components/orders/OrderProductImage';
import OrderStatusBadge from '../../components/orders/OrderStatusBadge';
import CancelOrderAction from '../../components/orders/CancelOrderAction';
import useAsync from '../../hooks/useAsync';
import useAxios from '../../hooks/useAxios';
import useRazorpayPayment from '../../hooks/useRazorpayPayment';
import useOrderCancellation from '../../hooks/useOrderCancellation';
import { ROUTES } from '../../routes/routePaths';
import { getOrder } from '../../services/orderService';
import { getEntity } from '../../utils/apiResponse';
import { formatCurrency } from '../../utils/currency';
import { canCancelOrder } from '../../utils/orderStatus';
import AccountTabs from '../../components/common/AccountTabs';

const paymentMethodLabels = {
  card: 'Card',
  upi: 'UPI',
  netbanking: 'Net banking',
  wallet: 'Wallet',
  emi: 'EMI',
  paylater: 'Pay later',
};

const displayValue = (value, fallback = 'Available after payment') => value || fallback;

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const API = useAxios();
  const { data, loading, error, reload } = useAsync(
    (signal) => getOrder(API, orderId, signal),
    [API, orderId],
  );
  const order = getEntity(data);
  const { pay, payingOrderId, paymentError } = useRazorpayPayment();
  const { cancel, cancellingOrderId, cancellationError } = useOrderCancellation();

  if (loading) return <LoadingState>Loading order details...</LoadingState>;
  if (error || !order) return <section><Link className="order-detail__back" to={ROUTES.orders}>Back to orders</Link><ErrorMessage message={error?.message || 'This order could not be found.'} onRetry={reload} /></section>;

  const items = order.orderItems ?? [];
  const itemCount = items.reduce((total, item) => total + Number(item.quantity || 0), 0);
  const method = paymentMethodLabels[String(order.paymentMethod || '').toLowerCase()] || order.paymentMethod;
  const hasCompletedPayment = order.paymentStatus === 'Paid';
  const showPaymentSection = order.inventoryStatus !== 'Cancelled' || hasCompletedPayment;

  return (
    <article className="order-detail">
      <AccountTabs />
      <Link className="order-detail__back" to={ROUTES.orders}>Back to orders</Link>
      <header className="order-detail__hero">
        <div>
          <p className="eyebrow">Order details</p>
          <h1>Order #{String(order.orderID).slice(0, 8).toUpperCase()}</h1>
          <p>Placed on <time dateTime={order.orderDate}>{new Date(order.orderDate).toLocaleString()}</time></p>
        </div>
        <div className="order-detail__status-group"><OrderStatusBadge type="inventory" status={order.inventoryStatus} paymentStatus={order.paymentStatus} />{showPaymentSection && <OrderStatusBadge type="payment" status={order.paymentStatus} transactionID={order.transactionID} />}</div>
      </header>
      {paymentError && <ErrorMessage message={paymentError} />}
      {cancellationError && <ErrorMessage message={cancellationError} />}

      <div className="order-detail__layout">
        <section className="order-detail__items" aria-labelledby="ordered-items-heading">
          <div className="order-detail__section-heading"><h2 id="ordered-items-heading">Items</h2><span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span></div>
          <ul>
            {items.map((item) => (
              <li key={item.productID}>
                <Link className="order-detail__image" to={`${ROUTES.products}/${item.productID}`} aria-label={`View ${item.productName}`}><OrderProductImage item={item} /></Link>
                <div className="order-detail__product-copy">
                  <h3><Link to={`${ROUTES.products}/${item.productID}`}>{item.productName || 'Product'}</Link></h3>
                  <p>{formatCurrency(item.unitPrice)} × {item.quantity}</p>
                </div>
                <strong className="order-detail__line-total">{formatCurrency(item.totalPrice)}</strong>
              </li>
            ))}
          </ul>
        </section>

        <aside className="order-detail__sidebar">
          {showPaymentSection && <section className="order-detail__panel" aria-labelledby="payment-heading">
            <h2 id="payment-heading">Payment</h2>
            <dl>
              <div><dt>Status</dt><dd><OrderStatusBadge type="payment" status={order.paymentStatus} transactionID={order.transactionID} /></dd></div>
              <div><dt>Payment mode</dt><dd>{displayValue(method)}</dd></div>
              <div><dt>Transaction ID</dt><dd className="order-detail__transaction">{displayValue(order.transactionID)}</dd></div>
            </dl>
            {order.inventoryStatus === 'Reserved' && order.paymentStatus !== 'Paid' && (
              <Button className="order-detail__pay" onClick={() => pay(order, reload)} disabled={payingOrderId === order.orderID}>{payingOrderId === order.orderID ? 'Opening…' : `Pay ${formatCurrency(order.totalBill)}`}</Button>
            )}
            {canCancelOrder(order) && <div className="order-detail__cancel"><CancelOrderAction orderId={order.orderID} cancelling={cancellingOrderId === order.orderID} onConfirm={(id) => cancel(id, reload)} /></div>}
          </section>}
          <section className="order-detail__panel order-detail__total" aria-labelledby="summary-heading">
            <h2 id="summary-heading">Summary</h2>
            <dl><div><dt>Items</dt><dd>{itemCount}</dd></div><div><dt>Order total</dt><dd>{formatCurrency(order.totalBill)}</dd></div></dl>
          </section>
        </aside>
      </div>

      <footer className="order-detail__reference"><span>Full order reference</span><code>{order.orderID}</code></footer>
    </article>
  );
}
