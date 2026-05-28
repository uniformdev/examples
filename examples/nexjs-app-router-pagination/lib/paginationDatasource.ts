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

const PATH_BASE = "/pagination-datasource";

/**
 * Rewrite the visitor-facing path into the offset-based path Uniform expects.
 *
 * Handles three shapes:
 *   - `/{locale}/pagination-datasource`        → `/{locale}/pagination-datasource/0`
 *   - `/{locale}/pagination-datasource/`       → `/{locale}/pagination-datasource/0`
 *   - `/{locale}/pagination-datasource/{page}` → `/{locale}/pagination-datasource/{offset}`
 *
 * Any unrelated path is returned unchanged.
 */
export const rewritePaginationDatasourcePath = (pathname: string): string => {
  const baseIdx = pathname.indexOf(PATH_BASE);
  if (baseIdx === -1) return pathname;

  // Ensure the marker is followed by '/' or end-of-string so we don't match
  // unrelated paths like "/pagination-datasource-other".
  const afterBaseIdx = baseIdx + PATH_BASE.length;
  const charAfter = pathname[afterBaseIdx];
  if (charAfter !== undefined && charAfter !== "/") return pathname;

  const head = pathname.slice(0, afterBaseIdx);
  const tail = pathname.slice(afterBaseIdx); // includes leading "/" if present

  // No page in URL: treat as page 1 / offset 0 so the Route API matches the
  // `:offset` project map node instead of 404-ing.
  if (tail === "" || tail === "/") {
    return `${head}/0`;
  }

  const match = tail.match(/^\/(\d+)(\/.*)?$/);
  if (!match) return pathname;

  const page = parseInt(match[1]!, 10);
  const rest = match[2] ?? "";
  const offset = Math.max(0, (page - 1) * PAGE_SIZE);
  return `${head}/${offset}${rest}`;
};

/**
 * Convert an offset that arrived on the server (via Uniform dynamic inputs)
 * back into the 1-indexed page number the visitor would have typed.
 */
export const offsetToPage = (offset: number): number => {
  if (!Number.isFinite(offset) || offset < 0) return 1;
  return Math.floor(offset / PAGE_SIZE) + 1;
};
