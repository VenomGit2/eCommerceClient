import OrdersExperience from './OrdersExperience';
import useRazorpayPayment from '../../hooks/useRazorpayPayment';
import useOrderCancellation from '../../hooks/useOrderCancellation';
import usePaginatedOrders from '../../hooks/pagination/usePaginatedOrders';

export default function OrdersPage() {
  const { orders, page, changePage, loading, error, reload } = usePaginatedOrders();
  const { pay, payingOrderId, paymentError } = useRazorpayPayment();
  const { cancel, cancellingOrderId, cancellationError } = useOrderCancellation();

  return (
    <OrdersExperience
      orders={orders}
      loading={loading}
      error={error}
      reload={reload}
      payment={{ pay, payingOrderId, paymentError }}
      cancellation={{ cancel, cancellingOrderId, cancellationError }}
      pagination={{
        currentPage: page.pageNumber,
        totalPages: page.totalPages,
        totalItems: page.totalItems,
        onPageChange: changePage,
      }}
    />
  );
}
