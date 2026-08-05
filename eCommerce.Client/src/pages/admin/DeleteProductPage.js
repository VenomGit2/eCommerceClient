import { useState } from 'react';
import AdminProductTabs from './AdminProductTabs';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Input from '../../components/common/Input';
import { deleteProduct } from '../../services/productService';

export default function DeleteProductPage() {
  const [productId, setProductId] = useState('');
  const [state, setState] = useState({ submitting: false, error: '', success: '' });

  const submit = async (event) => {
    event.preventDefault();
    setState({ submitting: true, error: '', success: '' });
    try {
      await deleteProduct(productId.trim());
      setProductId('');
      setState({ submitting: false, error: '', success: 'Product deleted successfully.' });
    } catch (error) {
      setState({ submitting: false, error: error.message, success: '' });
    }
  };

  return <section><p className="eyebrow">Administration</p><h1>Delete product</h1><AdminProductTabs /><div className="danger-panel"><h2>Permanent action</h2><p>Enter the product ID to permanently remove it from the catalog.</p>{state.error && <ErrorMessage message={state.error} />}{state.success && <p className="notice notice--success" role="status">{state.success}</p>}<form className="admin-product-form" onSubmit={submit}><Input label="Product ID" required value={productId} onChange={(event) => setProductId(event.target.value)} /><Button className="button--danger" type="submit" disabled={state.submitting || !productId.trim()}>{state.submitting ? 'Deleting product…' : 'Delete product'}</Button></form></div></section>;
}

