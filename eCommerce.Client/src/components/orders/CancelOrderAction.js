import { useState } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import ErrorMessage from '../common/ErrorMessage';

export default function CancelOrderAction({
  orderId,
  cancelling,
  onConfirm,
  title = 'Cancel this order?',
  description = 'The reserved items will be returned to stock. This action cannot be undone.',
}) {
  const [confirming, setConfirming] = useState(false);
  const [actionError, setActionError] = useState('');

  const confirmCancellation = async () => {
    setActionError('');
    try {
      await onConfirm(orderId);
      setConfirming(false);
    } catch (error) {
      setActionError(error.message || 'The order could not be cancelled. Please try again.');
    }
  };

  const openConfirmation = () => {
    setActionError('');
    setConfirming(true);
  };

  return (
    <>
      <Button variant="secondary" className="button--cancel" onClick={openConfirmation}>Cancel order</Button>
      <Modal open={confirming} title={title} onClose={() => !cancelling && setConfirming(false)}>
        <p>{description}</p>
        {actionError && <ErrorMessage message={actionError} />}
        <div className="modal__actions">
          <Button variant="ghost" onClick={() => setConfirming(false)} disabled={cancelling}>Keep order</Button>
          <Button variant="danger" onClick={confirmCancellation} disabled={cancelling}>
            {cancelling ? 'Cancelling…' : 'Yes, cancel order'}
          </Button>
        </div>
      </Modal>
    </>
  );
}
