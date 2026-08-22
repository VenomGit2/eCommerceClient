import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import WishlistButton from '../../components/WishlistButton';
import useAsync from '../../hooks/useAsync';
import useCart from '../../hooks/useCart';
import useAxios from '../../hooks/useAxios';
import { ROUTES } from '../../routes/routePaths';
import { getProduct } from '../../services/productService';
import { getEntity } from '../../utils/apiResponse';
import { formatCurrency } from '../../utils/currency';

export default function ProductDetailPage() {
  const API = useAxios();
  const { productId } = useParams();
  const { addItem, items } = useCart();
  const [cartState, setCartState] = useState({ adding: false, error: '' });
  const loadProduct = useCallback((signal) => getProduct(API, productId, signal), [API, productId]);
  const { data, loading, error, reload } = useAsync(loadProduct, [loadProduct]);
  const product = getEntity(data);

  if (loading) return null;
  if (error) return <ErrorMessage message={error.message} onRetry={reload} />;
  if (!product) return <ErrorMessage message="Product not found." />;

  const isInCart = items.some((item) => String(item.id) === String(product.id));
  const addToCart = async () => {
    if (cartState.adding || isInCart) return;
    setCartState({ adding: true, error: '' });
    try {
      await addItem(product);
      setCartState({ adding: false, error: '' });
    } catch (requestError) {
      setCartState({ adding: false, error: requestError.message || 'Could not add this item to the cart.' });
    }
  };

  return (
    <article className="product-detail">
      {product.imageUrl
        ? <img src={product.imageUrl} alt={product.name || 'Product'} />
        : <div className="product-detail__placeholder" aria-hidden="true">{product.name?.charAt(0)}</div>}
      <div>
        <p className="eyebrow">Product</p>
        <h1>{product.name}</h1>
        {product.description && <p>{product.description}</p>}
        <p className="price">{formatCurrency(product.price, product.currency)}</p>
        {isInCart
          ? <Link className="button button--primary" to={ROUTES.cart}>Go to cart <span aria-hidden="true">→</span></Link>
          : <Button onClick={addToCart} disabled={product.id == null || cartState.adding} aria-live="polite">{cartState.adding ? 'Adding…' : 'Add to cart'}</Button>}
        <WishlistButton product={product} className="product-detail__wishlist" />
        {cartState.error && <p className="field-error" role="alert">{cartState.error}</p>}
      </div>
    </article>
  );
}
