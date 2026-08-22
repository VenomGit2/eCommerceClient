import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import ErrorMessage from '../../components/common/ErrorMessage';
import useCart from '../../hooks/useCart';
import useProducts from '../../hooks/useProducts';
import { ROUTES } from '../../routes/routePaths';

export default function HomePage() {
  const { products, loading, error, reload } = useProducts();
  const { addItem, items: cartItems } = useCart();
  const heroProduct = products[0];
  const sceneRef = useRef(null);

  const moveScene = (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = ((event.clientX - bounds.left) / bounds.width) - 0.5;
    const vertical = ((event.clientY - bounds.top) / bounds.height) - 0.5;
    sceneRef.current?.style.setProperty('--scene-rotate-x', `${vertical * -18}deg`);
    sceneRef.current?.style.setProperty('--scene-rotate-y', `${horizontal * 24}deg`);
  };

  const resetScene = () => {
    sceneRef.current?.style.removeProperty('--scene-rotate-x');
    sceneRef.current?.style.removeProperty('--scene-rotate-y');
  };

  return (
    <div className="comet-home">
      <section className="comet-hero">
        <div className="comet-hero__copy">
          <p><span className="comet-hero__live" aria-hidden="true" /> NEW SEASON / 2026</p>
          <h1>OWN<br />YOUR<br />EVERYDAY</h1>
          <p className="comet-hero__intro">Everyday objects, selected for the way they look, feel, and live in your space.</p>
          <Link className="comet-link" to={ROUTES.products}>SHOP THE COLLECTION <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="comet-hero__product" onPointerMove={moveScene} onPointerLeave={resetScene}>
          <div className="comet-hero__scene" ref={sceneRef}>
            <span className="comet-hero__orbit comet-hero__orbit--one" aria-hidden="true" />
            <span className="comet-hero__orbit comet-hero__orbit--two" aria-hidden="true" />
            <span className="comet-hero__glow" aria-hidden="true" />
            <div className="comet-hero__object">
              {heroProduct?.imageUrl
                ? <img src={heroProduct.imageUrl} alt={heroProduct.name || 'Featured product'} width="700" height="700" />
                : <span className="comet-hero__placeholder" aria-hidden="true">{heroProduct?.name?.charAt(0) || 'C'}</span>}
            </div>
            <span className="comet-hero__platform" aria-hidden="true" />
          </div>
          <span className="comet-hero__stamp">NEW<br />DROP</span>
          <span className="comet-hero__hint" aria-hidden="true">MOVE TO EXPLORE <span>3D</span></span>
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
          ? null
          : error
            ? <ErrorMessage message={error.message} onRetry={reload} />
            : <div className="product-grid comet-product-grid">{products.slice(0, 8).map((product) => <ProductCard key={product.id} product={product} onAdd={addItem} isInCart={cartItems.some((item) => String(item.id) === String(product.id))} />)}</div>}
      </section>
    </div>
  );
}
