export function canCancelOrder(order) {
  const hasPaymentInProgress = order?.paymentStatus === 'Pending' && Boolean(order?.transactionID);
  return order?.inventoryStatus === 'Reserved'
    && order?.paymentStatus !== 'Paid'
    && !hasPaymentInProgress;
}
