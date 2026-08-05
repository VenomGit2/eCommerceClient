import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import useCart from '../../hooks/useCart';
import useProducts from '../../hooks/useProducts';
import { ROUTES } from '../../routes/routePaths';

export default function HomePage() {
  const { products, loading, error, reload } = useProducts();
  const { addItem, items: cartItems } = useCart();
  const heroProduct = products[0];

  return (
    <div className="comet-home">
      <section className="comet-hero">
        <div className="comet-hero__copy">
          <p>NEW SEASON / 2026</p>
          <h1>OWN<br />YOUR<br />EVERYDAY</h1>
          <Link className="comet-link" to={ROUTES.products}>SHOP THE COLLECTION <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="comet-hero__product">
          <span className="comet-hero__stamp">NEW<br />DROP</span>
          {heroProduct?.imageUrl
            ? <img src={heroProduct.imageUrl} alt={heroProduct.name || 'Featured product'} width="700" height="700" />
            : <span className="comet-hero__placeholder" aria-hidden="true">{heroProduct?.name?.charAt(0) || 'C'}</span>}
          <div className="comet-hero__caption">
            <span>{heroProduct?.name || 'THE NEW EDIT'}</span>
            <Link to={heroProduct?.id != null ? `/products/${encodeURIComponent(heroProduct.id)}` : ROUTES.products}>DISCOVER <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="comet-products" aria-labelledby="new-launches-title">
        <div className="comet-section-title">
          <h2 id="new-launches-title">NEW LAUNCHES</h2>
          <Link to={ROUTES.products}>VIEW ALL <span aria-hidden="true">→</span></Link>
        </div>
        {loading
          ? <Loader label="Loading new launches" />
          : error
            ? <ErrorMessage message={error.message} onRetry={reload} />
            : <div className="product-grid comet-product-grid">{products.slice(0, 8).map((product) => <ProductCard key={product.id} product={product} onAdd={addItem} isInCart={cartItems.some((item) => String(item.id) === String(product.id))} />)}</div>}
      </section>
    </div>
  );
}
