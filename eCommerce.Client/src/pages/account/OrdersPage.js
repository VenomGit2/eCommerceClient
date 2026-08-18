import OrdersExperience from './OrdersExperience';
import useAsync from '../../hooks/useAsync';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';
import useRazorpayPayment from '../../hooks/useRazorpayPayment';
import useOrderCancellation from '../../hooks/useOrderCancellation';
import { getOrders } from '../../services/orderService';
import { getCollection } from '../../utils/apiResponse';

export default function OrdersPage() {
  const API = useAxios();
  const { session } = useAuth();
  const { data, loading, error, reload } = useAsync(
    (signal) => getOrders(API, signal),
    [API, session?.token],
  );
  const orders = getCollection(data);
  const { pay, payingOrderId, paymentError } = useRazorpayPayment();
  const { cancel, cancellingOrderId, cancellationError } = useOrderCancellation();

  return <OrdersExperience
    orders={orders}
    loading={loading}
    error={error}
    reload={reload}
    payment={{ pay, payingOrderId, paymentError }}
    cancellation={{ cancel, cancellingOrderId, cancellationError }}
  />;
}
