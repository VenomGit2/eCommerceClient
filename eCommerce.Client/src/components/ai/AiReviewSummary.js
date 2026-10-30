import { useCallback } from 'react';
import useAsync from '../../hooks/useAsync';
import useAxios from '../../hooks/useAxios';
import { getAiReviewSummary } from '../../services/aiService';

export default function AiReviewSummary({ productId }) {
  const API = useAxios();
  const load = useCallback((signal) => getAiReviewSummary(API, productId, signal), [API, productId]);
  const { data, loading, error } = useAsync(load, [load]);

  // The summary is a secondary feature, so a failure must never disturb the product page.
  if (error || (!loading && (!data || data.reviewCount === 0))) return null;

  return (
    <section className="ai-summary" aria-labelledby="ai-summary-title" aria-busy={loading}>
      <h2 id="ai-summary-title">What customers say</h2>
      {loading
        ? <p className="ai-summary__status">Summarizing reviews…</p>
        : <>
          <p>{data.summary}</p>
          {(data.pros.length > 0 || data.cons.length > 0) && (
            <div className="ai-summary__lists">
              {data.pros.length > 0 && <div><h3>Pros</h3><ul>{data.pros.map((item) => <li key={item}>{item}</li>)}</ul></div>}
              {data.cons.length > 0 && <div><h3>Cons</h3><ul>{data.cons.map((item) => <li key={item}>{item}</li>)}</ul></div>}
            </div>
          )}
          <small>Based on {data.reviewCount} {data.reviewCount === 1 ? 'review' : 'reviews'}{data.generatedByAi ? ', summarized by AI.' : '.'}</small>
        </>}
    </section>
  );
}
