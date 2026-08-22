import { useEffect, useRef, useState } from 'react';
import AdminProductTabs from './AdminProductTabs';
import ProductFormFields from './ProductFormFields';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import { createProduct } from '../../services/productService';
import useAxios from '../../hooks/useAxios';

const initialProduct = { productName: '', category: 'Other', unitPrice: '', quantityInStock: '' };
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function AddProductPage() {
  const API = useAxios();
  const [product, setProduct] = useState(initialProduct);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [state, setState] = useState({ submitting: false, error: '', success: '' });
  const imageInputRef = useRef(null);

  useEffect(() => () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const selectImage = (event) => {
    const selectedImage = event.target.files?.[0];
    setState((current) => ({ ...current, error: '', success: '' }));

    if (!selectedImage) {
      setImage(null);
      setImagePreview('');
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(selectedImage.type)) {
      event.target.value = '';
      setImage(null);
      setImagePreview('');
      setState((current) => ({ ...current, error: 'Choose a JPEG, PNG, or WebP image.' }));
      return;
    }

    if (selectedImage.size > MAX_IMAGE_SIZE) {
      event.target.value = '';
      setImage(null);
      setImagePreview('');
      setState((current) => ({ ...current, error: 'Product images must be 5 MB or smaller.' }));
      return;
    }

    setImage(selectedImage);
    setImagePreview(URL.createObjectURL(selectedImage));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!image) {
      setState({ submitting: false, error: 'Choose a product image before adding the product.', success: '' });
      imageInputRef.current?.focus();
      return;
    }

    setState({ submitting: true, error: '', success: '' });
    try {
      await createProduct(
        API,
        { ...product, unitPrice: Number(product.unitPrice), quantityInStock: Number(product.quantityInStock) },
        image,
      );
      setProduct(initialProduct);
      setImage(null);
      setImagePreview('');
      if (imageInputRef.current) imageInputRef.current.value = '';
      setState({ submitting: false, error: '', success: 'Product added successfully.' });
    } catch (error) {
      setState({ submitting: false, error: error.message, success: '' });
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page__heading"><p className="eyebrow">Administration</p><h1>Add product</h1></div>
      <AdminProductTabs />
      {state.error && <ErrorMessage message={state.error} />}
      {state.success && <p className="notice notice--success" role="status">{state.success}</p>}
      <form className="admin-product-form" onSubmit={submit}>
        <ProductFormFields product={product} setProduct={setProduct} />
        <div className="field product-image-field">
          <label htmlFor="product-image">Product image</label>
          <div className="product-image-field__control">
            {imagePreview
              ? <img className="product-image-field__preview" src={imagePreview} alt="Selected product preview" />
              : <div className="product-image-field__placeholder" aria-hidden="true"><span>+</span><small>Image preview</small></div>}
            <div>
              <input ref={imageInputRef} id="product-image" type="file" accept="image/jpeg,image/png,image/webp" required onChange={selectImage} />
              <p className="product-image-field__help">JPEG, PNG, or WebP. Maximum 5 MB.</p>
              {image && <p className="product-image-field__name">{image.name}</p>}
            </div>
          </div>
        </div>
        <Button type="submit" disabled={state.submitting}>{state.submitting ? 'Adding product…' : 'Add product'}</Button>
      </form>
    </section>
  );
}
