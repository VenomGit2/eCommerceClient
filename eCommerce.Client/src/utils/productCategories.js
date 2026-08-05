export const PRODUCT_CATEGORIES = ['Electronics', 'HomeAppliances', 'Furniture', 'Accessories', 'Other'];

export function formatCategoryLabel(category) {
  return category === 'HomeAppliances' ? 'Home appliances' : category;
}
