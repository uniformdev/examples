/**
 * Delays execution for a specified duration with optional jitter.
 *
 * @param ms - Base delay duration in milliseconds
 * @param jitter - Optional jitter factor (0-1). If provided, adds random variance to the delay.
 *                 For example, jitter of 0.5 means delay can vary between 50% and 150% of the base duration.
 * @returns Promise that resolves after the delay
 *
 * @example
 * // Fixed delay of 1 second
 * await delay(1000);
 *
 * @example
 * // Delay between 500ms and 1500ms (1000ms ± 50%)
 * await delay(1000, 0.5);
 */
export async function delay(ms: number, jitter?: number): Promise<void> {
  let actualDelay = ms;

  if (jitter !== undefined && jitter > 0) {
    // Add random variance: delay * (1 - jitter) to delay * (1 + jitter)
    const minDelay = ms * (1 - jitter);
    const maxDelay = ms * (1 + jitter);
    actualDelay = minDelay + Math.random() * (maxDelay - minDelay);
  }

  return new Promise(resolve => setTimeout(resolve, Math.max(1, actualDelay)));
}
