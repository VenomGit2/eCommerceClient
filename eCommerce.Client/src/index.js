import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';
import ErrorFallback from './components/common/ErrorFallback';
import './style/global.css';
import './style/storefront.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary
      fallback={() => (
        <main className="page-container">
          <ErrorFallback
            message="The store could not start. Please reload the page."
            onRetry={() => window.location.reload()}
          />
        </main>
      )}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
