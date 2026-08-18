export function resolveProductImageUrl(imageUrl, baseUrl) {
  if (!imageUrl) return null;

  try {
    return new URL(imageUrl, baseUrl).toString();
  } catch {
    return null;
  }
}
