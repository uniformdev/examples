/**
 * Shared configuration for the /pagination-datasource demo.
 *
 * The URL the visitor sees is `/<locale>/pagination-datasource/<page>` where
 * `<page>` is a 1-indexed page number. The Uniform project map node, however,
 * uses `:offset` as its dynamic path segment, because that's what the blog
 * entries data resource binds to. The middleware translates the page number
 * to the offset before Uniform sees it; the component does the reverse to
 * compute the current page from the offset that lands on it.
 *
 * Keep PAGE_SIZE in sync with the data resource's `limit` variable bound in
 * the composition (currently 5).
 */

export const PAGE_SIZE = 5;

const PATH_MARKER = "/pagination-datasource/";

/**
 * If `pathname` is `/{locale}/pagination-datasource/{page}`, return the same
 * path with `{page}` replaced by the corresponding offset. Otherwise return
 * the path unchanged. The trailing portion after the page number (if any) is
 * preserved.
 */
export const rewritePaginationDatasourcePath = (pathname: string): string => {
  const markerIdx = pathname.indexOf(PATH_MARKER);
  if (markerIdx === -1) return pathname;

  const head = pathname.slice(0, markerIdx + PATH_MARKER.length);
  const tail = pathname.slice(markerIdx + PATH_MARKER.length);
  const match = tail.match(/^(\d+)(\/.*)?$/);
  if (!match) return pathname;

  const page = parseInt(match[1]!, 10);
  const rest = match[2] ?? "";
  const offset = Math.max(0, (page - 1) * PAGE_SIZE);
  return `${head}${offset}${rest}`;
};

/**
 * Convert an offset that arrived on the server (via Uniform dynamic inputs)
 * back into the 1-indexed page number the visitor would have typed.
 */
export const offsetToPage = (offset: number): number =>
  Math.max(1, Math.floor(offset / PAGE_SIZE) + 1);
