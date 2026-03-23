import { parse as parseCookieHeader } from "cookie";
import type { IncomingMessage } from "http";
import type { ParsedUrlQuery } from "querystring";

/**
 * Rebuilds the Uniform visitor cookie (`ufvd`) so every A/B test entry uses the
 * forced variant ID. Logic matches the App Router guide:
 * https://support.uniform.dev/articles/7480824760-how-to-setup-force-variation-in-app-router-projects
 */
export const FORCE_AB_TEST_VARIANT_QUERY_PARAM =
  "uniform_force_ab_test_variant_id";

function firstQueryValue(
  query: ParsedUrlQuery,
  key: string
): string | undefined {
  const v = query[key];
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

/** Reads `uniform_force_ab_test_variant_id` from a Next.js `query` object. */
export function getForcedAbTestVariantFromQuery(
  query: ParsedUrlQuery
): string | undefined {
  return firstQueryValue(query, FORCE_AB_TEST_VARIANT_QUERY_PARAM);
}

/** Parse `Cookie` header into name/value pairs (Node SSR). */
export function cookieHeaderToPairs(
  cookieHeader: string | undefined
): { name: string; value: string }[] {
  if (!cookieHeader) return [];
  const parsed = parseCookieHeader(cookieHeader);
  return Object.entries(parsed).map(([name, value]) => ({
    name,
    value: value ?? "",
  }));
}

/**
 * Mutates `req.headers.cookie` when the force-variation query param is present.
 * Use this on the **Node** request before Uniform reads cookies (e.g. in
 * `_document.getInitialProps`).
 *
 * **Not sufficient alone in `getServerSideProps` for `<UniformContext />`:** in
 * Pages Router, `_document` runs `createUniformContext` before `getServerSideProps`,
 * so you must patch in `_document` (or keep middleware) for SSR personalization.
 * You can still call this from `getServerSideProps` if your own code needs the
 * same patched `req`.
 */
export function applyForcedAbTestVariantToIncomingMessage(
  req: IncomingMessage,
  query: ParsedUrlQuery
): void {
  const forced = getForcedAbTestVariantFromQuery(query);
  if (!forced || !req.headers) return;

  const newCookieHeader = buildCookieHeaderWithForcedAbTestVariant(
    cookieHeaderToPairs(req.headers.cookie),
    forced
  );
  if (newCookieHeader) {
    req.headers.cookie = newCookieHeader;
  }
}

/**
 * Returns a full `Cookie` header value with `ufvd` rewritten, or `null` if
 * there is no `ufvd` cookie or nothing to change.
 */
export function buildCookieHeaderWithForcedAbTestVariant(
  allCookies: { name: string; value: string }[],
  forcedVariantId: string
): string | null {
  const ufvdCookie = allCookies.find((c) => c.name === "ufvd");
  if (!ufvdCookie) {
    return null;
  }

  let decodedUfvd: string;
  try {
    decodedUfvd = decodeURIComponent(ufvdCookie.value);
  } catch {
    decodedUfvd = ufvdCookie.value;
  }

  const separatorIndex = decodedUfvd.indexOf("~");
  const abTestData =
    separatorIndex === -1 ? decodedUfvd : decodedUfvd.slice(0, separatorIndex);
  const additionalData =
    separatorIndex === -1 ? "" : decodedUfvd.slice(separatorIndex) + "~";

  const updatedAbTestData = abTestData
    .split("!")
    .map((testEntry) => {
      if (!testEntry) return "";
      const dashIndex = testEntry.indexOf("-");
      const testKey =
        dashIndex === -1 ? testEntry : testEntry.slice(0, dashIndex);
      return testKey ? testKey + "-" + forcedVariantId : "";
    })
    .filter(Boolean)
    .join("!");

  const newUfvdValue = encodeURIComponent(updatedAbTestData + additionalData);

  return allCookies
    .map(({ name, value }) =>
      name === "ufvd" ? `${name}=${newUfvdValue}` : `${name}=${value}`
    )
    .join("; ");
}
