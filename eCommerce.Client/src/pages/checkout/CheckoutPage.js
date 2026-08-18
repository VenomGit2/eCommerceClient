import { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import useAxios from '../../hooks/useAxios';
import { ROUTES } from '../../routes/routePaths';
import { createOrder } from '../../services/orderService';
import { getEntity } from '../../utils/apiResponse';

function getCheckoutErrorMessage(error) {
  const apiMessage = error?.details?.error
    || error?.details?.message
    || error?.message;

  if (apiMessage === 'One or more products could not be validated.') {
    return 'We could not verify one or more products in your cart. A product may no longer be available, or the catalog service may be temporarily unavailable. Please review your cart and try again.';
  }

  if (error?.status >= 500) {
    return 'We could not place your order because a required service is temporarily unavailable. Your cart is safe. Please try again.';
  }

  return apiMessage || 'We could not place your order. Please try again.';
}

export default function CheckoutPage() {
  const API = useAxios();
  const { items, clearCart } = useCart();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submissionStarted = useRef(false);

  if (!items.length) return <Navigate to={ROUTES.cart} replace />;

  const submit = async (event) => {
    event.preventDefault();
    if (submissionStarted.current) return;

    submissionStarted.current = true;
    setSubmitting(true);
    setError('');

    const user = session?.data?.data ?? session?.data?.user ?? session?.data ?? session?.user ?? session;
    const userID = user?.sub
    const payload = {
      userID,
      orderDate: new Date().toISOString(),
      orderItems: items.map((item) => ({
        productID: item.productID ?? item.productId ?? item.id,
        unitPrice: Number(item.unitPrice ?? item.price),
        quantity: Number(item.quantity),
      })),
    };

    try {
      if (!userID) throw new Error('The signed-in username is missing. Please sign out and sign in again.');
      if (payload.orderItems.some((item) => !item.productID)) {
        throw new Error('A cart item is missing its product ID.');
      }
      const response = await createOrder(API, payload);
      if (response?.success === false || response?.error) {
        throw new Error(response.error || 'Failed to add your order.');
      }
      clearCart();
      navigate(`${ROUTES.checkout}/success`, {
        replace: true,
        state: { order: getEntity(response) },
      });
    } catch (requestError) {
      setError(getCheckoutErrorMessage(requestError));
    } finally {
      submissionStarted.current = false;
      setSubmitting(false);
    }
  };

  return <section className="form-page"><h1>Checkout</h1>{error && <ErrorMessage message={error} />}<form onSubmit={submit} aria-busy={submitting}><Button type="submit" disabled={submitting}>{submitting ? 'Placing order…' : 'Place order'}</Button>{submitting && <p className="form-status" role="status">Please wait while we verify your products and create the order.</p>}</form></section>;
}
