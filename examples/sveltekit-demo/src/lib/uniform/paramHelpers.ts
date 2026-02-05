/**
 * Uniform Parameter Helpers
 * 
 * Utility functions to transform Uniform's parameter types into
 * simple values that components expect. Use these in adapter components
 * to normalize Uniform data.
 */

import type { LinkParamValue, AssetParamValue } from "@uniformdev/canvas";
import { flattenValues } from "@uniformdev/canvas";

/**
 * Extract href from a Uniform Link parameter.
 * Handles both internal (project map) and external (URL) links.
 * 
 * @example
 * const href = linkHref(ctaLink); // "/products/neural" or "https://example.com"
 */
export function linkHref(link: LinkParamValue | undefined): string {
  return link?.path ?? "";
}

/**
 * Extract URL from a Uniform Asset parameter.
 * Flattens the asset array and returns the first asset's URL.
 * 
 * @example
 * const imageUrl = assetUrl(heroImage); // "https://cdn.example.com/image.jpg"
 */
export function assetUrl(asset: AssetParamValue | undefined): string {
  return flattenValues(asset, { toSingle: true })?.url ?? "";
}

/**
 * Get full asset details from a Uniform Asset parameter.
 * Returns the flattened asset object with url, width, height, etc.
 * 
 * @example
 * const img = assetDetails(heroImage);
 * // { url: "...", width: 1920, height: 1080, title: "Hero" }
 */
export function assetDetails(asset: AssetParamValue | undefined) {
  return flattenValues(asset, { toSingle: true });
}

/**
 * Convert Uniform checkbox parameter to boolean.
 * Uniform checkboxes can be undefined, boolean, or string ("true"/"false").
 * 
 * @param value - The checkbox parameter value
 * @param defaultValue - Value to use when undefined (default: true)
 * 
 * @example
 * const enabled = checkbox(animationsEnabled);        // defaults to true
 * const hidden = checkbox(hideElement, false);        // defaults to false
 */
export function checkbox(
  value: boolean | string | undefined | null,
  defaultValue: boolean = true
): boolean {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  if (typeof value === "string") {
    return value === "true";
  }
  return Boolean(value);
}
