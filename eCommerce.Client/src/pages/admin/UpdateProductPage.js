import { useState } from 'react';
import AdminProductTabs from './AdminProductTabs';
import ProductFormFields from './ProductFormFields';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Input from '../../components/common/Input';
import { getProduct, updateProduct } from '../../services/productService';
import useAxios from '../../hooks/useAxios';

const emptyProduct = { productId: '', productName: '', category: 'Other', unitPrice: '', quantityInStock: '', description: '' };

export default function UpdateProductPage() {
  const API = useAxios();
  const [product, setProduct] = useState(emptyProduct);
  const [originalProduct, setOriginalProduct] = useState(null);
  const [lookup, setLookup] = useState({ status: 'idle', message: '' }); // idle | checking | found | not-found
  const [state, setState] = useState({ submitting: false, error: '', success: '' });

  const changeProductId = (event) => {
    setProduct((current) => ({ ...current, productId: event.target.value }));
    // Any edit to the ID invalidates a previous lookup, so fields lock again until re-checked.
    if (lookup.status !== 'idle') setLookup({ status: 'idle', message: '' });
    if (originalProduct) setOriginalProduct(null);
    setState((current) => ({ ...current, error: '', success: '' }));
  };

  const checkProduct = async () => {
    const trimmedId = product.productId.trim();
    if (!trimmedId) {
      setLookup({ status: 'not-found', message: 'Enter a product ID to look up.' });
      return;
    }

    setLookup({ status: 'checking', message: '' });
    try {
      const found = await getProduct(API, trimmedId);
      if (!found) {
        setOriginalProduct(null);
        setLookup({ status: 'not-found', message: 'No product found with this ID.' });
        return;
      }

      setOriginalProduct(found);
      setProduct({
        productId: trimmedId,
        productName: found.productName ?? '',
        category: found.category ?? 'Other',
        unitPrice: found.unitPrice ?? '',
        quantityInStock: found.quantityInStock ?? '',
        description: found.description ?? '',
      });
      setLookup({ status: 'found', message: 'Product available' });
    } catch (error) {
      setOriginalProduct(null);
      setLookup({ status: 'not-found', message: error.message || 'Could not look up this product.' });
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (lookup.status !== 'found' || !originalProduct) return;

    setState({ submitting: true, error: '', success: '' });
    try {
      const { productId, ...details } = product;
      // Any field left blank keeps its previously fetched value instead of being sent empty/zero.
      const merged = {
        productName: details.productName.trim() ? details.productName : originalProduct.productName,
        category: details.category || originalProduct.category,
        unitPrice: details.unitPrice === '' ? originalProduct.unitPrice : Number(details.unitPrice),
        quantityInStock: details.quantityInStock === '' ? originalProduct.quantityInStock : Number(details.quantityInStock),
        description: details.description === '' ? originalProduct.description : details.description,
      };

      await updateProduct(API, productId.trim(), merged);
      setOriginalProduct((current) => ({ ...current, ...merged }));
      setState({ submitting: false, error: '', success: 'Product updated successfully.' });
    } catch (error) {
      setState({ submitting: false, error: error.message, success: '' });
    }
  };

  const fieldsLocked = lookup.status !== 'found';

  return (
    <section className="admin-page">
      <div className="admin-page__heading"><p className="eyebrow">Administration</p><h1>Update product</h1></div>
      <AdminProductTabs />
      {state.error && <ErrorMessage message={state.error} />}
      {state.success && <p className="notice notice--success" role="status">{state.success}</p>}
      <form className="admin-product-form" onSubmit={submit}>
        <div className="field product-id-lookup">
          <Input
            label="Product ID"
            value={product.productId}
            onChange={changeProductId}
            disabled={lookup.status === 'found'}
            required
          />
          <Button
            type="button"
            variant="ghost"
            className="product-id-lookup__check"
            onClick={checkProduct}
            disabled={lookup.status === 'checking' || lookup.status === 'found'}
            aria-label={lookup.status === 'checking' ? 'Checking product' : 'Check product'}
          >
            {lookup.status === 'checking'
              ? <span className="wishlist-button__spinner" aria-hidden="true" />
              : (
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              )}
          </Button>
          {lookup.status === 'found' && <span className="product-id-lookup__status product-id-lookup__status--found">{lookup.message}</span>}
          {lookup.status === 'not-found' && <span className="product-id-lookup__status product-id-lookup__status--missing">{lookup.message}</span>}
        </div>
        <ProductFormFields product={product} setProduct={setProduct} fieldsDisabled={fieldsLocked} />
        <Button type="submit" disabled={state.submitting || fieldsLocked}>{state.submitting ? 'Updating product…' : 'Update product'}</Button>
      </form>
    </section>
  );
}