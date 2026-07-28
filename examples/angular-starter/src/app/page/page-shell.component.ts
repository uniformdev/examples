import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UniformSlotComponent } from '@uniformdev/canvas-angular';

/**
 * Renderer for the `page` Canvas component type. Pages are normally rendered by
 * `PageComponent` via `<uniform-composition>`, but the playground renders pattern
 * roots through the component resolver — registering this shell makes composition
 * patterns (root type `page`) previewable there.
 */
@Component({
  selector: 'app-page-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UniformSlotComponent],
  template: `<uniform-slot name="content" />`,
})
export class PageShellComponent {}
