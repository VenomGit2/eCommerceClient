import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Input from '../../components/common/Input';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import { ROUTES } from '../../routes/routePaths';
import { createOrder } from '../../services/orderService';
export default function CheckoutPage() {
  const { items, clearCart } = useCart(); const { session } = useAuth(); const navigate = useNavigate();
  const [details, setDetails] = useState({ shippingAddress: '' }); const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false);
  if (!items.length) return <Navigate to={ROUTES.cart} replace />;
  const submit = async (event) => { event.preventDefault(); setSubmitting(true); setError(''); try { await createOrder({ ...details, items }, session?.token); clearCart(); navigate(`${ROUTES.checkout}/success`, { replace: true }); } catch (requestError) { setError(requestError.message); } finally { setSubmitting(false); } };
  return <section className="form-page"><h1>Checkout</h1>{error && <ErrorMessage message={error} />}<form onSubmit={submit}><Input label="Shipping address" autoComplete="street-address" required value={details.shippingAddress} onChange={(e) => setDetails({ shippingAddress: e.target.value })} /><Button type="submit" disabled={submitting}>{submitting ? 'Placing order…' : 'Place order'}</Button></form></section>;
}

