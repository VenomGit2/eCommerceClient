import { useState } from 'react';
import useAxios from './useAxios';
import {
  createRazorpayCheckout,
  loadRazorpayCheckout,
  verifyRazorpayCheckout,
} from '../services/paymentService';

export default function useRazorpayPayment() {
  const API = useAxios();
  const [payingOrderId, setPayingOrderId] = useState(null);
  const [paymentError, setPaymentError] = useState('');

  const pay = async (order, onPaymentVerified) => {
    setPayingOrderId(order.orderID);
    setPaymentError('');

    try {
      await loadRazorpayCheckout();
      const checkout = await createRazorpayCheckout(API, order.orderID);
      if (!checkout) throw new Error('The payment session was not created.');

      const razorpay = new window.Razorpay({
        key: checkout.keyId,
        order_id: checkout.razorpayOrderId,
        amount: checkout.amount,
        currency: checkout.currency,
        name: checkout.name,
        description: checkout.description,
        handler: async (response) => {
          try {
            await verifyRazorpayCheckout(API, {
              orderId: order.orderID,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            await onPaymentVerified?.();
          } catch (verificationError) {
            setPaymentError(verificationError.message);
          } finally {
            setPayingOrderId(null);
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentError('Payment was cancelled. You can try again when ready.');
            setPayingOrderId(null);
          },
        },
        theme: { color: '#111827' },
      });

      razorpay.on('payment.failed', (response) => {
        setPaymentError(response.error?.description || 'Razorpay could not complete the payment.');
        setPayingOrderId(null);
      });
      razorpay.open();
    } catch (paymentStartError) {
      setPaymentError(paymentStartError.message);
      setPayingOrderId(null);
    }
  };

  return { pay, payingOrderId, paymentError };
}
