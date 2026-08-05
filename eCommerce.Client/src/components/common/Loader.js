export default function Loader({ label = 'Loading' }) {
  return <div className="loader" role="status"><span className="loader__spinner" aria-hidden="true" />{label}</div>;
}

