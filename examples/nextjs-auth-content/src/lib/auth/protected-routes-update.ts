import { fetchAccessConfig } from './protected-routes';
import {
  clearEdgeConfigMarker,
  isMarkerActive,
  readEdgeConfigMarkerAndAccessConfig,
  routeAccessRulesEqual,
  updateEdgeConfig,
  writeEdgeConfigMarker,
} from './protected-routes-config';
import { delay } from '../../utils/delay';

const DEBOUNCE_WINDOW_MS = 15_000;

/**
 * Debounced sync: claims a short-lived Edge Config marker, waits {@link DEBOUNCE_WINDOW_MS}, then
 * compares Uniform-sourced access rules with Edge Config and either clears the marker (no change)
 * or upserts `accessConfig` (and clears the marker when `clearMarker` is passed to the updater).
 */
export async function processCompositionUpdate(): Promise<void> {
  try {
    // Read marker and current access config in a single batched read
    const { marker } = await readEdgeConfigMarkerAndAccessConfig();

    // If another request is already handling the update, skip
    if (isMarkerActive(marker)) {
      console.info('Webhook debounce: update already pending, skipping');
      return;
    }

    if (marker) {
      console.info('Webhook debounce: expired marker found, proceeding');
    }

    // Claim the update by writing the marker
    let currentMarker: string | undefined;
    try {
      currentMarker = await writeEdgeConfigMarker();
    } catch (error) {
      console.error('Webhook debounce: failed to write marker, will not update', error);
    }

    if (currentMarker) {
      console.info(
        `Webhook debounce: [${currentMarker}] claiming update marker, sleeping ${DEBOUNCE_WINDOW_MS / 1000}s`
      );
      // Sleep for the debounce window
      await delay(DEBOUNCE_WINDOW_MS);
      // Fresh access rules from Uniform (source of truth)
      const freshAccessConfig = await fetchAccessConfig();

      // Re-read current accessConfig from Edge Config (fresh, not stale cached value)
      const { accessConfig: latestAccessConfig, marker: latestMarker } = await readEdgeConfigMarkerAndAccessConfig();

      // Compare and update only if changed
      if (currentMarker === latestMarker && routeAccessRulesEqual(freshAccessConfig, latestAccessConfig)) {
        console.info(`Webhook debounce: [${currentMarker}] accessConfig unchanged, clearing marker`);
        await clearEdgeConfigMarker();
      } else {
        console.info(`Webhook debounce: [${currentMarker}] updating ${freshAccessConfig.length} accessConfig`);
        await updateEdgeConfig(freshAccessConfig, { clearMarker: true });
      }
    }
  } catch (error) {
    console.error('Webhook debounce: processing error', error);
    // Attempt to clear the marker so the next webhook can retry
    try {
      await clearEdgeConfigMarker();
    } catch (clearError) {
      console.error('Webhook debounce: failed to clear marker after error', clearError);
    }
  }
}
