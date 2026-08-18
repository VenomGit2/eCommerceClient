import Button from './Button';

export default function ErrorFallback({
  title = 'Something went wrong',
  message = 'We could not display this page. Please try again.',
  onRetry,
  action,
}) {
  return (
    <section className="empty-state" role="alert">
      <h1>{title}</h1>
      <p>{message}</p>
      <div className="error-fallback__actions">
        {onRetry && <Button onClick={onRetry}>Try again</Button>}
        {action}
      </div>
    </section>
  );
}
