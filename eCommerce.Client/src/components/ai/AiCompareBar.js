import { useState } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import useAiCompare from '../../hooks/useAiCompare';
import { formatCurrency } from '../../utils/currency';

export const MAX_COMPARE_PRODUCTS = 4;

export default function AiCompareBar({ selected, onClear }) {
  const [open, setOpen] = useState(false);
  const { result, loading, error, compare, reset } = useAiCompare();

  if (selected.length === 0) return null;

  const openComparison = () => {
    setOpen(true);
    compare(selected.map((product) => product.id));
  };

  const close = () => {
    setOpen(false);
    reset();
  };

  return (
    <>
      <div className="ai-compare-bar" role="region" aria-label="Product comparison">
        <span>{selected.length} selected{selected.length < 2 ? ' (choose at least 2)' : ''}</span>
        <Button onClick={openComparison} disabled={selected.length < 2}>Compare with AI</Button>
        <Button variant="ghost" onClick={onClear}>Clear</Button>
      </div>

      <Modal open={open} title="Product comparison" onClose={close}>
        <div className="ai-compare">
          {loading && <p aria-live="polite">Comparing products…</p>}
          {error && <p className="field-error" role="alert">{error}</p>}
          {result && <>
            <table className="ai-compare__table">
              <thead>
                <tr><th scope="col">Product</th><th scope="col">Price</th><th scope="col">Rating</th><th scope="col">Stock</th></tr>
              </thead>
              <tbody>
                {result.products.map((product) => (
                  <tr key={product.id}>
                    <th scope="row">{product.name}</th>
                    <td>{formatCurrency(product.price, product.currency)}</td>
                    <td>{product.rating ? `${product.rating.toFixed(1)} (${product.reviewCount})` : 'No ratings'}</td>
                    <td>{product.quantityInStock > 0 ? `${product.quantityInStock} left` : 'Out of stock'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="ai-compare__analysis">{result.analysis}</p>
          </>}
        </div>
      </Modal>
    </>
  );
}
