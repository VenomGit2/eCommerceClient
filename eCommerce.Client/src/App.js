import { useEffect, useState } from 'react';
import AppFooter from './components/AppFooter';
import AppHeader from './components/AppHeader';
import Loader from './components/common/Loader';
import AuthContainer from './containers/AuthContainer';
import CartContainer from './containers/CartContainer';
import AppRoutes from './routes/AppRoutes';
import RouteErrorBoundary from './routes/RouteErrorBoundary';
import ScrollToTop from './routes/ScrollToTop';
import ThemeProvider from './themes/ThemeProvider';
import { subscribeToApiLoading } from './hooks/useAxios';

export default function App() {
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => subscribeToApiLoading(setApiLoading), []);

  return (
    <ThemeProvider>
      <AuthContainer>
        <CartContainer>
          <ScrollToTop />
          <div className="app-shell">
            {apiLoading && <Loader label="Loading..." />}
            <AppHeader />
            <main className="page-container" id="main-content">
              <RouteErrorBoundary><AppRoutes /></RouteErrorBoundary>
            </main>
            <AppFooter />
          </div>
        </CartContainer>
      </AuthContainer>
    </ThemeProvider>
  );
}
