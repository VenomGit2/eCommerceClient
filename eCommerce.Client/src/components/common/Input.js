import { useId } from 'react';
export default function Input({ label, error, id, className = '', ...props }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  return (
    <div className={`field ${className}`.trim()}>
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} aria-invalid={Boolean(error)} aria-describedby={error ? `${inputId}-error` : undefined} {...props} />
      {error && <span className="field__error" id={`${inputId}-error`}>{error}</span>}
    </div>
  );
}

