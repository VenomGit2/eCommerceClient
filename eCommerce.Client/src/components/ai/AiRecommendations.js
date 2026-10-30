import ProductCard from '../ProductCard';
import useAsync from '../../hooks/useAsync';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';
import { getAiRecommendations } from '../../services/aiService';

export default function AiRecommendations({ onAdd, cartProductIds }) {
  const API = useAxios();
  const { isAuthenticated } = useAuth();
  // Recommendations differ by sign-in state, so a login or logout must refetch them.
  const { data, loading, error } = useAsync(
    (signal) => getAiRecommendations(API, signal),
    [API, isAuthenticated],
  );

  if (loading || error || !data?.items.length) return null;

  return (
    <section className="comet-products" aria-labelledby="ai-recommendations-title">
      <div className="comet-section-title">
        <h2 id="ai-recommendations-title">{data.headline || 'RECOMMENDED'}</h2>
      </div>
      <div className="product-grid comet-product-grid">
        {data.items.map(({ product, reason }) => (
          <div key={product.id} className="ai-recommendation">
            <ProductCard product={product} onAdd={onAdd} isInCart={cartProductIds.has(String(product.id))} />
            <p className="ai-recommendation__reason">{reason}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
