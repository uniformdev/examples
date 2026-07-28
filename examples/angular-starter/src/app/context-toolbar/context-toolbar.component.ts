import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { injectQuirks, injectScores, injectUniformContext } from '@uniformdev/context-angular';

import { UniformManifestReloadService } from '../uniform-manifest-reload.service';

/**
 * Debug toolbar: shows live visitor scores/quirks (proving signal reactivity), lets you
 * trigger enrichment updates or forget the visitor without a reload, and surfaces the
 * Context manifest revision the session is running on so a republished manifest is
 * visible rather than silently ignored.
 */
@Component({
  selector: 'app-context-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe],
  template: `
    <aside class="toolbar" data-testid="context-toolbar">
      <strong>Uniform Context</strong>
      <div class="row">
        <button type="button" data-testid="btn-launch-signal" (click)="triggerLaunchCampaign()">
          Trigger launch campaign (+50 launchCampaign)
        </button>
        <button type="button" data-testid="btn-forget" (click)="forget()">Forget me</button>
      </div>
      <div class="row">
        <span>Scores: <code data-testid="scores">{{ scores() | json }}</code></span>
        <span>Quirks: <code data-testid="quirks">{{ quirks() | json }}</code></span>
      </div>
      <div class="row">
        <span>Manifest: <code data-testid="manifest-revision">{{ manifest.currentRevision() }}</code></span>
        @if (manifest.updateAvailable()) {
          <button type="button" data-testid="btn-apply-manifest" (click)="manifest.applyUpdate()">
            A newer manifest was published — reload
          </button>
        } @else {
          <button
            type="button"
            data-testid="btn-refresh-manifest"
            [disabled]="manifest.state() === 'checking'"
            (click)="manifest.refreshServerManifest()"
          >
            {{ manifest.state() === 'checking' ? 'Checking…' : 'Check for manifest updates' }}
          </button>
        }
      </div>
      <p class="hint">
        Tip: append <code>?utm_campaign=launch</code> to the URL to trigger the query-string
        signal from the manifest (server-rendered).
      </p>
    </aside>
  `,
  styles: `
    .toolbar {
      border: 1px dashed #999;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      margin: 1rem 0;
      font-size: 0.9rem;
      background: #fafafa;
    }
    .row {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin: 0.5rem 0;
      flex-wrap: wrap;
    }
    .hint {
      margin: 0.25rem 0 0;
      color: #777;
    }
  `,
})
export class ContextToolbarComponent {
  private readonly context = injectUniformContext();
  protected readonly scores = injectScores();
  protected readonly quirks = injectQuirks();
  protected readonly manifest = inject(UniformManifestReloadService);

  /** Simulates visiting with `?utm_campaign=launch`, activating the `launchCampaign` signal. */
  protected triggerLaunchCampaign(): void {
    void this.context.update({
      url: new URL('/?utm_campaign=launch', window.location.origin),
    });
  }

  protected forget(): void {
    void this.context.forget(true);
  }
}
