import Input from '../../components/common/Input';
import { PRODUCT_CATEGORIES, formatCategoryLabel } from '../../utils/productCategories';

export default function ProductFormFields({ product, setProduct, includeProductId = false }) {
  const updateField = (field) => (event) => setProduct((current) => ({ ...current, [field]: event.target.value }));

  return (
    <>
      {includeProductId && <Input label="Product ID" required value={product.productId} onChange={updateField('productId')} />}
      <Input label="Product name" required value={product.productName} onChange={updateField('productName')} />
      <div className="field">
        <label htmlFor="product-category">Category</label>
        <select id="product-category" value={product.category} onChange={updateField('category')}>
          {PRODUCT_CATEGORIES.map((category) => <option key={category} value={category}>{formatCategoryLabel(category)}</option>)}
        </select>
      </div>
      <Input label="Unit price" type="number" min="0" step="0.01" required value={product.unitPrice} onChange={updateField('unitPrice')} />
      <Input label="Quantity in stock" type="number" min="0" step="1" required value={product.quantityInStock} onChange={updateField('quantityInStock')} />
      <div className="field">
        <label htmlFor="product-description">Description</label>
        <textarea
          id="product-description"
          rows={8}
          placeholder={'Write in plain paragraphs.\n\nStart a new line for a new paragraph.\nLines starting with "- " become bullet points.'}
          value={product.description ?? ''}
          onChange={updateField('description')}
        />
        <p className="field__help">Use blank lines for new paragraphs and "- " at the start of a line for bullet points. This will be formatted automatically on the product page.</p>
      </div>
    </>
  );
}