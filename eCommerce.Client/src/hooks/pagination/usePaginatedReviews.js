import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAsync from '../useAsync';
import useAuth from '../useAuth';
import useAxios from '../useAxios';
import { getReviews } from '../../services/reviewService';
import { getPage } from '../../utils/apiResponse';

const REVIEW_PAGE_SIZE = 20;

export default function usePaginatedReviews() {
  const API = useAxios();
  const { session } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedPage = Math.max(Number.parseInt(searchParams.get('page'), 10) || 1, 1);
  const result = useAsync(
    (signal) => getReviews(API, signal),
    [API, session?.token, requestedPage],
  );
  const page = getPage(result.data);

  useEffect(() => {
    if (!result.loading && page.totalPages > 0 && requestedPage > page.totalPages) {
      setSearchParams(page.totalPages > 1 ? { page: String(page.totalPages) } : {}, { replace: true });
    }
  }, [page.totalPages, requestedPage, result.loading, setSearchParams]);

  const changePage = (nextPage) => {
    setSearchParams(nextPage > 1 ? { page: String(nextPage) } : {});
  };

  return { ...result, reviews: page.items, page, changePage };
}
