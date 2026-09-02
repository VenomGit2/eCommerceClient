import { useEffect, useState } from 'react';
import AppFooter from './components/AppFooter';
import AppHeader from './components/AppHeader';
import BackToTopButton from './components/common/BackToTopButton';
import CookieBanner from './components/common/CookieBanner';
import KeyboardShortcuts from './components/common/KeyboardShortcuts';
import Loader from './components/common/Loader';
import SmoothScroll from './components/common/SmoothScroll';
import AuthContainer from './containers/AuthContainer';
import CartContainer from './containers/CartContainer';
import WishlistContainer from './containers/WishlistContainer';
import ToastProvider from './context/ToastContext';
import AppRoutes from './routes/AppRoutes';
import RouteErrorBoundary from './routes/RouteErrorBoundary';
import ScrollToTop from './routes/ScrollToTop';
import ThemeProvider from './themes/ThemeProvider';
import { subscribeToApiLoading } from './hooks/useAxios';
import useCookieNotice from './hooks/useCookieNotice';

export default function App() {
  const [apiLoading, setApiLoading] = useState(false);
  const { isVisible: isCookieNoticeVisible, dismiss: dismissCookieNotice } = useCookieNotice();

  useEffect(() => subscribeToApiLoading(setApiLoading), []);

  return (
    <ThemeProvider>
      <ToastProvider>
      <AuthContainer>
        <CartContainer>
          <WishlistContainer>
            <SmoothScroll />
            <KeyboardShortcuts />
            <ScrollToTop />
            <div className="app-shell">
              {apiLoading && <Loader label="Loading..." />}
              <AppHeader />
              <main className="page-container" id="main-content">
                <RouteErrorBoundary><AppRoutes /></RouteErrorBoundary>
              </main>
              <AppFooter />
              {isCookieNoticeVisible && <CookieBanner onAccept={dismissCookieNotice} />}
              <BackToTopButton />
            </div>
          </WishlistContainer>
        </CartContainer>
      </AuthContainer>
      </ToastProvider>
    </ThemeProvider>
  );
}
