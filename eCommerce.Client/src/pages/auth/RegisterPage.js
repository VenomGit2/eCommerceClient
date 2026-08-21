import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../../components/common/ErrorMessage';
import { ROUTES } from '../../routes/routePaths';

export default function RegisterPage() {
  const authority = process.env.REACT_APP_OPENID_AUTHORITY;

  useEffect(() => {
    if (!authority) return;

    const registrationUrl = new URL('/UserMgmt/Register', authority);
    registrationUrl.searchParams.set(
      'returnUrl',
      `${window.location.origin}${ROUTES.login}`,
    );
    window.location.replace(registrationUrl.toString());
  }, [authority]);

  if (!authority) {
    return (
      <section className="form-page">
        <h1>Create account</h1>
        <ErrorMessage message="The Identity Provider is not configured." />
        <p><Link to={ROUTES.login}>Return to sign in</Link>.</p>
      </section>
    );
  }

  return (
    <section className="form-page">
      <h1>Create account</h1>
      <p>Redirecting to secure registration…</p>
    </section>
  );
}
