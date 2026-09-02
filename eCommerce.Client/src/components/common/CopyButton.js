import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import Button from './Button';

function CopyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function CopyButton({
  value,
  label = 'Copy',
  copiedLabel = 'Copied',
  iconOnly = false,
  className = '',
  'aria-label': ariaLabel,
  title,
}) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const copy = async (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      showToast('Copied to clipboard.');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Unable to copy. Please copy it manually.', { tone: 'error' });
    }
  };

  const buttonTitle = copied ? copiedLabel : (title || (iconOnly ? (ariaLabel || label) : undefined));

  return (
    <Button
      variant="ghost"
      className={`copy-button ${iconOnly ? 'copy-button--icon' : ''} ${copied ? 'is-copied' : ''} ${className}`.trim()}
      onClick={copy}
      aria-label={ariaLabel || (iconOnly ? label : undefined)}
      title={buttonTitle}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {!iconOnly && <span>{copied ? copiedLabel : label}</span>}
    </Button>
  );
}
