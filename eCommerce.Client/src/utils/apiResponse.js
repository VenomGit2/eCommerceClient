export function getCollection(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.products)) return response.products;
  if (Array.isArray(response?.carts)) return response.carts;
  if (Array.isArray(response?.users)) return response.users;
  return [];
}

export function getEntity(response) {
  return response?.data ?? response ?? null;
}

export function getPage(response) {
  const page = response?.data ?? response ?? {};
  return {
    items: getCollection(page),
    pageNumber: Number(page.pageNumber) || 1,
    pageSize: Number(page.pageSize) || 0,
    totalItems: Number(page.totalItems ?? page.totalRecords) || 0,
    totalPages: Number(page.totalPages) || 0,
    hasMore: Boolean(page.hasMore),
  };
}
