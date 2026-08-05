import Button from './common/Button';
export default function QuantityControl({ value, onChange, label }) {
  return <div className="quantity" aria-label={label}><Button variant="secondary" onClick={() => onChange(value - 1)} aria-label="Decrease quantity">−</Button><output aria-live="polite">{value}</output><Button variant="secondary" onClick={() => onChange(value + 1)} aria-label="Increase quantity">+</Button></div>;
}

