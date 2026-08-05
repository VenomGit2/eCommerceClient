import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Input from '../../components/common/Input';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routePaths';
export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { login, status, error } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const submit = async (event) => { event.preventDefault(); try { await login(credentials); navigate(location.state?.from?.pathname || ROUTES.account, { replace: true }); } catch {} };
  return <section className="form-page"><h1>Sign in</h1>{error && <ErrorMessage message={error} />}<form onSubmit={submit}><Input label="Email" type="email" autoComplete="email" required value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} /><Input label="Password" type="password" autoComplete="current-password" required value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} /><Button type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Signing in…' : 'Sign in'}</Button></form><p>New customer? <Link to={ROUTES.register}>Create an account</Link>.</p></section>;
}
