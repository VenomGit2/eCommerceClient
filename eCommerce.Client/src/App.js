import AppFooter from './components/AppFooter';
import AppHeader from './components/AppHeader';
import AuthContainer from './containers/AuthContainer';
import CartContainer from './containers/CartContainer';
import AppRoutes from './routes/AppRoutes';
import ThemeProvider from './themes/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
      <AuthContainer>
        <CartContainer>
          <div className="app-shell">
            <AppHeader />
            <main className="page-container" id="main-content"><AppRoutes /></main>
            <AppFooter />
          </div>
        </CartContainer>
      </AuthContainer>
    </ThemeProvider>
  );
}

