import { Route, Routes } from 'react-router-dom';
import AccountPage from '../pages/account/AccountPage';
import OrdersPage from '../pages/account/OrdersPage';
import OrderDetailPage from '../pages/account/OrderDetailPage';
import WishlistPage from '../pages/account/WishlistPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AddProductPage from '../pages/admin/AddProductPage';
import DeleteProductPage from '../pages/admin/DeleteProductPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import UpdateProductPage from '../pages/admin/UpdateProductPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import CartPage from '../pages/cart/CartPage';
import CheckoutPage from '../pages/checkout/CheckoutPage';
import CheckoutSuccessPage from '../pages/checkout/CheckoutSuccessPage';
import ForbiddenPage from '../pages/errors/ForbiddenPage';
import NotFoundPage from '../pages/errors/NotFoundPage';
import HomePage from '../pages/home/HomePage';
import ProductDetailPage from '../pages/products/ProductDetailPage';
import ProductListPage from '../pages/products/ProductListPage';
import NewInPage from '../pages/products/NewInPage';
import AdminRoute from './AdminRoute';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { ROUTES } from './routePaths';
import StorefrontRoute from './StorefrontRoute';

export default function AppRoutes() {
  return <Routes>
    <Route element={<StorefrontRoute />}>
      <Route path={ROUTES.home} element={<HomePage />} />
      <Route path={ROUTES.newIn} element={<NewInPage />} />
      <Route path={ROUTES.products} element={<ProductListPage />} />
      <Route path={`${ROUTES.products}/:productId`} element={<ProductDetailPage />} />
      <Route path={ROUTES.cart} element={<CartPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.checkout} element={<CheckoutPage />} /><Route path={`${ROUTES.checkout}/success`} element={<CheckoutSuccessPage />} />
        <Route path={ROUTES.account} element={<AccountPage />} /><Route path={ROUTES.orders} element={<OrdersPage />} /><Route path={`${ROUTES.orders}/:orderId`} element={<OrderDetailPage />} /><Route path={ROUTES.wishlist} element={<WishlistPage />} />
      </Route>
    </Route>
    <Route element={<PublicRoute />}><Route path={ROUTES.login} element={<LoginPage />} /><Route path={ROUTES.register} element={<RegisterPage />} /></Route>
    <Route element={<AdminRoute />}><Route path={ROUTES.admin} element={<AdminDashboardPage />} /><Route path={ROUTES.adminProducts} element={<AdminProductsPage />} /><Route path={ROUTES.adminAddProduct} element={<AddProductPage />} /><Route path={ROUTES.adminUpdateProduct} element={<UpdateProductPage />} /><Route path={ROUTES.adminDeleteProduct} element={<DeleteProductPage />} /><Route path={ROUTES.adminOrders} element={<AdminOrdersPage />} /></Route>
    <Route path={ROUTES.forbidden} element={<ForbiddenPage />} /><Route path="*" element={<NotFoundPage />} />
  </Routes>;
}
