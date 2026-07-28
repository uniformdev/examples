import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UniformPlaygroundComponent } from '@uniformdev/canvas-angular';

/**
 * Playground route for live-previewing component/composition patterns in the Canvas
 * editor. The `/api/preview` endpoint redirects here when the editor requests a
 * pattern preview (`is_incontext_editing_playground=true`); the pattern arrives over
 * the canvas channel.
 */
@Component({
  selector: 'app-playground',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UniformPlaygroundComponent],
  template: `<uniform-playground />`,
})
export class PlaygroundComponent {}
