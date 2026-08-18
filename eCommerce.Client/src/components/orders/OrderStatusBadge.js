const inventoryLabels = {
  Pending: 'Preparing order',
  Reserved: 'Ready for payment',
  Rejected: 'Item unavailable',
  Cancelled: 'Cancelled',
};

const paymentLabels = {
  NotStarted: 'Awaiting payment',
  Pending: 'Payment processing',
  Paid: 'Paid',
};

function StatusIcon({ name }) {
  const paths = {
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    warning: <><path d="M12 3 2.5 20h19L12 3Z" /><path d="M12 9v4M12 17h.01" /></>,
    cancelled: <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6m0-6-6 6" /></>,
  };

  return (
    <svg className="order-status__icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export default function OrderStatusBadge({ type, status, paymentStatus, transactionID }) {
  const labels = type === 'payment' ? paymentLabels : inventoryLabels;
  const fallback = type === 'payment' ? 'Awaiting payment' : 'Preparing order';
  const preparedCheckoutOnly = type === 'payment' && status === 'Pending' && !transactionID;
  const label = preparedCheckoutOnly
    ? 'Awaiting payment'
    : type === 'inventory' && status === 'Reserved' && paymentStatus === 'Paid'
      ? 'Order confirmed'
      : labels[status] || fallback;
  const normalizedStatus = String(status || 'pending').toLowerCase();
  const icon = normalizedStatus === 'cancelled'
    ? 'cancelled'
    : normalizedStatus === 'rejected'
      ? 'warning'
      : normalizedStatus === 'paid' || normalizedStatus === 'reserved'
        ? 'check'
        : 'clock';

  return (
    <span className={`order-status order-status--${normalizedStatus}`}>
      <StatusIcon name={icon} />
      {label}
    </span>
  );
}
