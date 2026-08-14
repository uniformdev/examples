/**
 * Shared error helpers for automations.
 */

/**
 * Extracts a human-readable message from an unknown thrown value. Automations
 * catch `unknown` everywhere and log a string; this collapses the repeated
 * `error instanceof Error ? error.message : String(error)` dance into one call.
 */
export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
