/**
 * Escapes text for safe HTML interpolation in server-rendered fragments.
 * Coerces non-strings (e.g. missing composition fields from the API) so callers never pass `undefined`.
 */
export function escapeHtml(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
