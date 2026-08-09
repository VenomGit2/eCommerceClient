import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import useAxios from '../../hooks/useAxios';
import { ROUTES } from '../../routes/routePaths';
import { createOrder } from '../../services/orderService';

export default function CheckoutPage() {
  const API = useAxios();
  const { items, clearCart } = useCart();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!items.length) return <Navigate to={ROUTES.cart} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const user = session?.data?.data ?? session?.data?.user ?? session?.data ?? session?.user ?? session;
    const userID = user?.preferred_username
      ?? user?.username
      ?? user?.userName
      ?? user?.name
      ?? user?.email;
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
      navigate(`${ROUTES.checkout}/success`, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return <section className="form-page"><h1>Checkout</h1>{error && <ErrorMessage message={error} />}<form onSubmit={submit}><Button type="submit" disabled={submitting}>{submitting ? 'Placing order…' : 'Place order'}</Button></form></section>;
}
