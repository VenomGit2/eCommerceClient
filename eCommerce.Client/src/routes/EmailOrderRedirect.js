import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from './routePaths';

export default function EmailOrderRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const orderId = new URLSearchParams(location.search).get('openOrder');
    if (orderId && /^[0-9a-f-]{36}$/i.test(orderId)) {
      navigate(`${ROUTES.orders}/${encodeURIComponent(orderId)}`, { replace: true });
    }
  }, [location.search, navigate]);

  return null;
}
