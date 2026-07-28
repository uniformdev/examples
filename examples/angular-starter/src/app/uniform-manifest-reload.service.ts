import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

import { uniformManifestRevision } from '../uniform/manifest-source';

/** How often to poll the server for a newer manifest while the tab is visible. */
const POLL_INTERVAL_MS = 30_000;

export type ManifestCheckState = 'idle' | 'checking' | 'error';

/**
 * Detects that a newer Context manifest has been published and reloads the app onto it.
 *
 * `Context` takes its manifest at construction and exposes it read-only, so picking up a
 * republished manifest means building a new Context — which in practice means a fresh
 * render. Reloading the document does exactly that: `server.ts` renders the request with
 * the manifest it holds now, and the browser hydrates from it. This mirrors the Next.js
 * SDK, where `revalidateTag('manifest')` also only takes effect on the next render.
 *
 * The server side of the loop is `/api/uniform-webhook`, which drops the server's cached
 * manifest as soon as Uniform emits `manifest.published`.
 */
@Injectable({ providedIn: 'root' })
export class UniformManifestReloadService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly serverRevision = signal<string | null>(null);

  /** Content hash of the manifest this browser session was rendered with. */
  readonly currentRevision = uniformManifestRevision;

  readonly state = signal<ManifestCheckState>('idle');

  /** True when the server holds a manifest newer than the one this session is running on. */
  readonly updateAvailable = computed(() => {
    const latest = this.serverRevision();

    return latest !== null && latest !== this.currentRevision();
  });

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    const timer = setInterval(() => {
      // Skip background tabs: polling them wastes requests and the user cannot act on
      // the result until they come back anyway.
      if (document.visibilityState === 'visible') {
        void this.check();
      }
    }, POLL_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        void this.check();
      }
    };

    document.addEventListener('visibilitychange', onVisible);

    inject(DestroyRef).onDestroy(() => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    });
  }

  /** Asks the server which manifest revision it would render with right now. */
  async check(): Promise<void> {
    if (!this.isBrowser || this.state() === 'checking') {
      return;
    }

    this.state.set('checking');

    try {
      const response = await fetch('/api/uniform-manifest?meta=true');

      if (!response.ok) {
        throw new Error(`Unexpected status ${response.status}`);
      }

      const { revision } = (await response.json()) as { revision: string };

      this.serverRevision.set(revision);
      this.state.set('idle');
    } catch (error) {
      console.error('[demo] Failed to check for a newer Uniform Context manifest', error);
      this.state.set('error');
    }
  }

  /**
   * Forces the server to refetch the manifest from Uniform, then re-checks.
   * The `manifest.published` webhook does this automatically; this is the manual path
   * for when no webhook is configured (typically local development).
   */
  async refreshServerManifest(): Promise<void> {
    if (!this.isBrowser) {
      return;
    }

    this.state.set('checking');

    try {
      const response = await fetch('/api/uniform-manifest/refresh', { method: 'POST' });

      if (!response.ok) {
        throw new Error(`Unexpected status ${response.status}`);
      }

      const { revision } = (await response.json()) as { revision: string };

      this.serverRevision.set(revision);
      this.state.set('idle');
    } catch (error) {
      console.error('[demo] Failed to refresh the Uniform Context manifest', error);
      this.state.set('error');
    }
  }

  /** Re-renders the app against the server's current manifest. */
  applyUpdate(): void {
    if (this.isBrowser) {
      location.reload();
    }
  }
}
