export default function LoadMoreButton({
  loading,
  onClick,
  children = 'Load more',
  loadingLabel = 'Loading more...',
}) {
  return (
    <div className="load-more">
      <button
        className="button button--secondary"
        type="button"
        onClick={onClick}
        disabled={loading}
      >
        {loading ? loadingLabel : children}
      </button>
    </div>
  );
}
