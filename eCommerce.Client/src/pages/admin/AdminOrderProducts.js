import OrderProductImage from '../../components/orders/OrderProductImage';

export default function AdminOrderProducts({ items = [] }) {
  if (!items.length) return <span className="admin-order-products__empty">No products</span>;

  return (
    <ul className="admin-order-products" aria-label={`${items.length} ordered products`}>
      {items.map((item, index) => (
        <li key={`${item.productID}-${index}`}>
          <OrderProductImage item={item} className="admin-order-products__image" />
          <span>
            <strong>{item.productName || 'Product unavailable'}</strong>
            <small>Qty {item.quantity}</small>
          </span>
        </li>
      ))}
    </ul>
  );
}
