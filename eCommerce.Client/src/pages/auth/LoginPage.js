import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routePaths';

export default function LoginPage() {
  const { login, status, error } = useAuth();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const requestedReturnPath = query.get('returnTo');
  const returnPath = requestedReturnPath?.startsWith('/')
    ? requestedReturnPath
    : location.state?.from?.pathname || ROUTES.account;
  const loginRequired = query.get('reason') === 'login-required';
  const [authenticationMessage] = useState(() => (
    sessionStorage.getItem('authenticationMessage')
    || 'Your session has expired or login is required. Please sign in to continue.'
  ));

  useEffect(() => {
    if (loginRequired) sessionStorage.removeItem('authenticationMessage');
  }, [loginRequired]);

  return <section className="form-page">
    <h1>Sign in</h1>
    {loginRequired && <ErrorMessage message={authenticationMessage} />}
    {error && <ErrorMessage message={error} />}
    <p>Continue to securely sign in or register.</p>
    <Button type="button" disabled={status === 'loading'} onClick={() => login(returnPath)}>
      {status === 'loading' ? 'Redirecting...' : 'Sign in'}
    </Button>
  </section>;
}
