import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Input from '../../components/common/Input';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../routes/routePaths';
export default function RegisterPage() {
  const [details, setDetails] = useState({ email: '', password: '', personName: '', gender: 'Other' }); const { register, status, error } = useAuth(); const navigate = useNavigate();
  const submit = async (event) => { event.preventDefault(); try { await register({ ...details, email: details.email.trim(), personName: details.personName.trim() }); navigate(ROUTES.login, { replace: true }); } catch {} };
  return <section className="form-page"><h1>Create account</h1>{error && <ErrorMessage message={error} />}<form onSubmit={submit}><Input label="Full name" autoComplete="name" required value={details.personName} onChange={(e) => setDetails({ ...details, personName: e.target.value })} /><Input label="Email" type="email" autoComplete="email" required value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} /><div className="field"><label htmlFor="register-gender">Gender</label><select id="register-gender" value={details.gender} onChange={(e) => setDetails({ ...details, gender: e.target.value })}><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div><Input label="Password" type="password" minLength="8" autoComplete="new-password" required value={details.password} onChange={(e) => setDetails({ ...details, password: e.target.value })} /><Button type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Creating…' : 'Create account'}</Button></form><p>Already registered? <Link to={ROUTES.login}>Sign in</Link>.</p></section>;
}
