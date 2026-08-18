import { Link } from 'react-router-dom';
import QuantityControl from '../../components/QuantityControl';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import useCart from '../../hooks/useCart';
import { ROUTES } from '../../routes/routePaths';
import { formatCurrency } from '../../utils/currency';
import emptyCartImage from '../../assets/empty-cart.svg';

export default function CartPage() {
  const { items, total, setQuantity, removeItem } = useCart();
  if (!items.length) return <EmptyState title="Your cart is empty" message="Add a product to begin." action={<><img className="empty-state__image" src={emptyCartImage} alt="" /><Link className="button button--primary" to={ROUTES.products}>Browse products</Link></>} />;

  return (
    <section>
      <h1>Your cart</h1>
      <ul className="cart-list">
        {items.map((item) => {
          const productPath = `${ROUTES.products}/${encodeURIComponent(item.id)}`;
          const imageUrl = item.imageUrl;
          return (
            <li key={item.id} className="cart-item">
              <Link className="cart-item__media" to={productPath} aria-label={`View ${item.name} details`}>
                {imageUrl
                  ? <img src={imageUrl} alt={item.name || 'Product'} loading="lazy" width="160" height="160" />
                  : <span className="product-image-placeholder" role="img" aria-label={`No image available for ${item.name || 'this product'}`}><span aria-hidden="true">No image</span></span>}
                <span className="cart-item__view" aria-hidden="true">View ↗</span>
              </Link>
              <div className="cart-item__details">
                <h2><Link to={productPath}>{item.name}</Link></h2>
                <p>{formatCurrency(item.price, item.currency)}</p>
              </div>
              <QuantityControl label={`Quantity for ${item.name}`} value={item.quantity} onChange={(quantity) => setQuantity(item.id, quantity)} />
              <Button variant="ghost" onClick={() => removeItem(item.id)}>Remove</Button>
            </li>
          );
        })}
      </ul>
      <div className="cart-summary"><strong>Total: {formatCurrency(total)}</strong><Link className="button button--primary" to={ROUTES.checkout}>Checkout</Link></div>
    </section>
  );
}
