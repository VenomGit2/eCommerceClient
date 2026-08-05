export function formatCurrency(value, currency = 'USD', locale) {
  if (typeof value !== 'number') return '';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

