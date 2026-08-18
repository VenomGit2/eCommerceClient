import { useState } from 'react';
import { cancelOrder } from '../services/orderService';
import useAxios from './useAxios';

export default function useOrderCancellation() {
  const API = useAxios();
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [cancellationError, setCancellationError] = useState('');

  const cancel = async (orderId, onCancelled) => {
    setCancellingOrderId(orderId);
    setCancellationError('');
    try {
      await cancelOrder(API, orderId);
      await onCancelled?.();
    } catch (error) {
      setCancellationError(error.message || 'The order could not be cancelled.');
      throw error;
    } finally {
      setCancellingOrderId(null);
    }
  };

  return { cancel, cancellingOrderId, cancellationError };
}
