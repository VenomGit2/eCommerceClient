const createPageItems = (currentPage, totalPages) => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  const ordered = [...pages].filter((page) => page > 0 && page <= totalPages).sort((a, b) => a - b);

  return ordered.flatMap((page, index) => (
    index > 0 && page - ordered[index - 1] > 1 ? [`ellipsis-${page}`, page] : [page]
  ));
};

export default function Pagination({ currentPage, totalPages, onPageChange, label = 'Pagination' }) {
  if (totalPages <= 1) return null;
  const pageItems = createPageItems(currentPage, totalPages);

  return (
    <nav className="pagination" aria-label={label}>
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </button>

      <div className="pagination__pages">
        {pageItems.map((item) => (
          typeof item === 'string'
            ? <span className="pagination__ellipsis" key={item} aria-hidden="true">...</span>
            : (
              <button
                type="button"
                key={item}
                onClick={() => onPageChange(item)}
                aria-current={item === currentPage ? 'page' : undefined}
                aria-label={`Page ${item}`}
              >
                {item}
              </button>
            )
        ))}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </button>
    </nav>
  );
}
