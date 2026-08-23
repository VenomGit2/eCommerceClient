export default function LoadingState({ children = 'Loading...' }) {
  return (
    <div className="section-status" role="status">
      <span className="loader__spinner" aria-hidden="true" />
      {children}
    </div>
  );
}
