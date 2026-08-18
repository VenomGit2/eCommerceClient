import { Link, useLocation } from 'react-router-dom';
import ErrorBoundary from '../components/common/ErrorBoundary';
import ErrorFallback from '../components/common/ErrorFallback';
import { ROUTES } from './routePaths';

export default function RouteErrorBoundary({ children }) {
  const location = useLocation();

  return (
    <ErrorBoundary
      resetKey={location.key}
      fallback={({ resetErrorBoundary }) => (
        <ErrorFallback
          onRetry={resetErrorBoundary}
          action={<Link className="button button--secondary" to={ROUTES.home}>Return home</Link>}
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
