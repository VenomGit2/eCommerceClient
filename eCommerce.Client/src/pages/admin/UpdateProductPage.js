import { useState } from 'react';
import AdminProductTabs from './AdminProductTabs';
import ProductFormFields from './ProductFormFields';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import { updateProduct } from '../../services/productService';
import useAxios from '../../hooks/useAxios';

const initialProduct = { productId: '', productName: '', category: 'Other', unitPrice: '', quantityInStock: '' };

export default function UpdateProductPage() {
  const API = useAxios();
  const [product, setProduct] = useState(initialProduct);
  const [state, setState] = useState({ submitting: false, error: '', success: '' });

  const submit = async (event) => {
    event.preventDefault();
    setState({ submitting: true, error: '', success: '' });
    try {
      const { productId, ...details } = product;
      await updateProduct(API, productId.trim(), { ...details, unitPrice: Number(details.unitPrice), quantityInStock: Number(details.quantityInStock) });
      setState({ submitting: false, error: '', success: 'Product updated successfully.' });
    } catch (error) {
      setState({ submitting: false, error: error.message, success: '' });
    }
  };

  return <section className="admin-page"><div className="admin-page__heading"><p className="eyebrow">Administration</p><h1>Update product</h1></div><AdminProductTabs />{state.error && <ErrorMessage message={state.error} />}{state.success && <p className="notice notice--success" role="status">{state.success}</p>}<form className="admin-product-form" onSubmit={submit}><ProductFormFields product={product} setProduct={setProduct} includeProductId /><Button type="submit" disabled={state.submitting}>{state.submitting ? 'Updating product…' : 'Update product'}</Button></form></section>;
}
