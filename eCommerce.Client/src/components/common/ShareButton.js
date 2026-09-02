import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import Button from './Button';
import Modal from './Modal';

function ShareIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
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

function buildShareTargets(url, text, subject) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  const encodedSubject = encodeURIComponent(subject || text);
  return [
    { key: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/?text=${encodedText}` },
    { key: 'telegram', label: 'Telegram', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}` },
    { key: 'x', label: 'X (Twitter)', href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}` },
    { key: 'facebook', label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { key: 'email', label: 'Email', href: `mailto:?subject=${encodedSubject}&body=${encodedUrl}` },
  ];
}

export default function ShareButton({
  title = '',
  text = '',
  url,
  label = 'Share',
  dialogTitle = 'Share',
  className = '',
  'aria-label': ariaLabel,
  variant = 'primary',
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = text || title;
  const targets = buildShareTargets(shareUrl, shareText, title);
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const copy = async (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast('Copied to clipboard.');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Unable to copy. Please copy it manually.', { tone: 'error' });
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title, text: shareText, url: shareUrl });
    } catch (shareError) {
      if (shareError && shareError.name === 'AbortError') return; // user dismissed the native sheet
      showToast('Sharing is not available here. Choose an option below instead.', { tone: 'error' });
      setOpen(true);
    }
  };

  const handleClick = () => {
    if (canNativeShare) {
      share();
      return;
    }
    setOpen(true);
  };

  const buttonTitle = copied ? 'Copied' : (ariaLabel || label);

  return (
    <>
      <Button
        variant={variant}
        className={`share-button ${className} ${copied ? 'is-copied' : ''}`.trim()}
        onClick={handleClick}
        aria-label={ariaLabel}
        aria-haspopup={canNativeShare ? undefined : 'dialog'}
        title={buttonTitle}
      >
        {copied ? <CheckIcon /> : <ShareIcon />}
        <span>{copied ? 'Copied' : label}</span>
      </Button>
      <Modal open={open} title={dialogTitle} onClose={() => setOpen(false)}>
        <div className="share-options">
          <p className="share-options__hint">Choose how you want to share this.</p>
          <ul className="share-options__list">
            {targets.map((target) => (
              <li key={target.key}>
                <a
                  className="share-option"
                  href={target.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                >
                  {target.label}
                  <span aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="share-options__copy">
            <Button
              variant="ghost"
              className={`copy-button ${copied ? 'is-copied' : ''}`}
              onClick={copy}
              aria-label="Copy link"
              title={copied ? 'Copied' : 'Copy link'}
            >
              {copied ? <CheckIcon /> : <ShareIcon />}
              <span>{copied ? 'Copied' : 'Copy link'}</span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
