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
  const items = getCollection(page);
  const pageNumber = Number(page.pageNumber) || 1;
  const pageSize = Number(page.pageSize) || items.length;
  const totalItems = Number(page.totalItems ?? page.totalRecords) || items.length;
  const totalPages = Number(page.totalPages)
    || (totalItems > 0 ? Math.ceil(totalItems / Math.max(pageSize, 1)) : 0);

  return {
    items,
    pageNumber,
    pageSize,
    totalItems,
    totalPages,
    hasMore: page.hasMore ?? pageNumber < totalPages,
  };
}
