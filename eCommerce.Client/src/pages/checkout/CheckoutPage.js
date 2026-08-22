import { useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import useAxios from '../../hooks/useAxios';
import { ROUTES } from '../../routes/routePaths';
import { createOrder } from '../../services/orderService';
import { getEntity } from '../../utils/apiResponse';
import { formatCurrency } from '../../utils/currency';

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
  const { items, total, clearCart } = useCart();
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

  const itemCount = items.reduce((count, item) => count + Number(item.quantity || 0), 0);
  const currency = items[0]?.currency || 'INR';

  return (
    <section className="checkout-page">
      <header className="checkout-page__header">
        <div><p className="eyebrow">Final review</p><h1>Checkout</h1></div>
        <p>Review your products before continuing to secure payment.</p>
      </header>
      {error && <ErrorMessage message={error} />}
      <div className="checkout-layout">
        <section className="checkout-review" aria-labelledby="checkout-products-heading">
          <div className="checkout-review__heading">
            <div><p className="eyebrow">Your basket</p><h2 id="checkout-products-heading">Products</h2></div>
            <Link className="checkout-edit-link" to={ROUTES.cart}>Edit cart ↗</Link>
          </div>
          <ul className="checkout-review__list">
            {items.map((item) => {
              const productId = item.productID ?? item.productId ?? item.id;
              const unitPrice = Number(item.unitPrice ?? item.price) || 0;
              const quantity = Number(item.quantity) || 0;
              const productPath = `${ROUTES.products}/${encodeURIComponent(productId)}`;
              return (
                <li className="checkout-review__item" key={productId}>
                  <Link className="checkout-review__media" to={productPath} aria-label={`View ${item.name} details`}>
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.name || 'Product'} width="128" height="128" />
                      : <span className="product-image-placeholder" aria-hidden="true">No image</span>}
                  </Link>
                  <div className="checkout-review__details">
                    <h3><Link to={productPath}>{item.name || 'Product'}</Link></h3>
                    {item.category && <p>{item.category}</p>}
                    <dl>
                      <div><dt>Unit price</dt><dd>{formatCurrency(unitPrice, item.currency || currency)}</dd></div>
                      <div><dt>Quantity</dt><dd>{quantity}</dd></div>
                    </dl>
                  </div>
                  <div className="checkout-review__line-total">
                    <span>Line total</span>
                    <strong>{formatCurrency(unitPrice * quantity, item.currency || currency)}</strong>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <aside className="checkout-summary" aria-labelledby="checkout-summary-heading">
          <p className="eyebrow">Order summary</p>
          <h2 id="checkout-summary-heading">Ready to order?</h2>
          <dl>
            <div><dt>Products</dt><dd>{itemCount}</dd></div>
            <div><dt>Subtotal</dt><dd>{formatCurrency(total, currency)}</dd></div>
          </dl>
          <div className="checkout-summary__total"><span>Total</span><strong>{formatCurrency(total, currency)}</strong></div>
          <form onSubmit={submit} aria-busy={submitting}>
            <Button type="submit" disabled={submitting}>{submitting ? 'Verifying order…' : 'Continue to secure payment'}</Button>
            <p className="checkout-summary__note">We verify availability first, then open the secure payment window. You are not charged by this button alone.</p>
            {submitting && <p className="form-status" role="status">Please wait while we verify your products and create the order.</p>}
          </form>
        </aside>
      </div>
    </section>
  );
}
