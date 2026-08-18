import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ErrorMessage from '../../components/common/ErrorMessage';
import useAxios from '../../hooks/useAxios';
import useRazorpayPayment from '../../hooks/useRazorpayPayment';
import { ROUTES } from '../../routes/routePaths';
import { getOrder } from '../../services/orderService';
import { getEntity } from '../../utils/apiResponse';

export default function CheckoutSuccessPage() {
  const location = useLocation();
  const API = useAxios();
  const [order, setOrder] = useState(location.state?.order);
  const [inventoryError, setInventoryError] = useState('');
  const { pay, paymentError } = useRazorpayPayment();
  const paymentOpened = useRef(false);
  const orderItems = order?.orderItems ?? [];

  const refreshOrder = async () => {
    if (!order?.orderID) return;
    const response = await getOrder(API, order.orderID);
    setOrder(getEntity(response));
  };

  useEffect(() => {
    if (!order?.orderID || order.inventoryStatus !== 'Pending') return undefined;

    const intervalId = window.setInterval(async () => {
      try {
        await refreshOrder();
      } catch (error) {
        setInventoryError(error.message);
        window.clearInterval(intervalId);
      }
    }, 1500);

    return () => window.clearInterval(intervalId);
  }, [order?.orderID, order?.inventoryStatus]);

  useEffect(() => {
    if (order?.inventoryStatus !== 'Reserved'
      || order.paymentStatus === 'Paid'
      || paymentOpened.current) return;

    paymentOpened.current = true;
    pay(order, refreshOrder);
  }, [order?.inventoryStatus, order?.paymentStatus]);

  return (
    <section className="empty-state checkout-success">
      <p className="eyebrow">Order received</p>
      <h1>Thank you for your order</h1>
      {order?.inventoryStatus === 'Pending' && (
        <p role="status">Preparing your order&hellip;</p>
      )}
      {order?.inventoryStatus === 'Reserved' && order.paymentStatus !== 'Paid' && (
        <p role="status">Opening secure payment&hellip;</p>
      )}
      {order?.inventoryStatus === 'Rejected' && (
        <ErrorMessage message="One or more items are no longer available. You have not been charged." />
      )}
      {order?.paymentStatus === 'Paid' && <p role="status">Payment completed successfully.</p>}
      {inventoryError && <ErrorMessage message={inventoryError} />}
      {paymentError && <ErrorMessage message={paymentError} />}
      {orderItems.length > 0 && (
        <div className="checkout-success__products">
          <h2>Products ordered</h2>
          <ul className="order-products">
            {orderItems.map((item, index) => (
              <li key={item.productID ?? index}>
                <span>{item.productName || 'Unknown product'}</span>
                <small>Quantity: {item.quantity}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p>You can review its progress in your account.</p>
      <Link className="button button--primary" to={ROUTES.orders}>View orders</Link>
    </section>
  );
}
