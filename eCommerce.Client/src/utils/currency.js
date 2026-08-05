export function formatCurrency(value, currency = 'INR', locale = 'en-IN') {
  if (typeof value !== 'number') return '';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}
