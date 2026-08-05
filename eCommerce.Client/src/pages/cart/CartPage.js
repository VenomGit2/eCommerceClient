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
  return <section><h1>Your cart</h1><ul className="cart-list">{items.map((item) => <li key={item.id} className="cart-item"><div><h2>{item.name}</h2><p>{formatCurrency(item.price, item.currency)}</p></div><QuantityControl label={`Quantity for ${item.name}`} value={item.quantity} onChange={(quantity) => setQuantity(item.id, quantity)} /><Button variant="ghost" onClick={() => removeItem(item.id)}>Remove</Button></li>)}</ul><div className="cart-summary"><strong>Total: {formatCurrency(total)}</strong><Link className="button button--primary" to={ROUTES.checkout}>Checkout</Link></div></section>;
}
