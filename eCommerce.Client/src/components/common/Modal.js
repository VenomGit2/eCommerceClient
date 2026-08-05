import { useEffect, useRef } from 'react';
import Button from './Button';
export default function Modal({ open, title, children, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    const handleCancel = (event) => { event.preventDefault(); onClose(); };
    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [open, onClose]);
  return <dialog ref={dialogRef} className="modal"><div className="modal__header"><h2>{title}</h2><Button variant="ghost" onClick={onClose} aria-label="Close dialog">×</Button></div>{children}</dialog>;
}

