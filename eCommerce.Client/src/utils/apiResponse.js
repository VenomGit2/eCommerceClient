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
