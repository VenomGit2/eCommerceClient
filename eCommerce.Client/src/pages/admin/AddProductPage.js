import { useState } from 'react';
import AdminProductTabs from './AdminProductTabs';
import ProductFormFields from './ProductFormFields';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import { createProduct } from '../../services/productService';
import useAxios from '../../hooks/useAxios';

const initialProduct = { productName: '', category: 'Other', unitPrice: '', quantityInStock: '' };

export default function AddProductPage() {
  const API = useAxios();
  const [product, setProduct] = useState(initialProduct);
  const [state, setState] = useState({ submitting: false, error: '', success: '' });

  const submit = async (event) => {
    event.preventDefault();
    setState({ submitting: true, error: '', success: '' });
    try {
      await createProduct(API, { ...product, unitPrice: Number(product.unitPrice), quantityInStock: Number(product.quantityInStock) });
      setProduct(initialProduct);
      setState({ submitting: false, error: '', success: 'Product added successfully.' });
    } catch (error) {
      setState({ submitting: false, error: error.message, success: '' });
    }
  };

  return <section className="admin-page"><div className="admin-page__heading"><p className="eyebrow">Administration</p><h1>Add product</h1></div><AdminProductTabs />{state.error && <ErrorMessage message={state.error} />}{state.success && <p className="notice notice--success" role="status">{state.success}</p>}<form className="admin-product-form" onSubmit={submit}><ProductFormFields product={product} setProduct={setProduct} /><Button type="submit" disabled={state.submitting}>{state.submitting ? 'Adding product…' : 'Add product'}</Button></form></section>;
}
