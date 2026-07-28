import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { RootComponentInstance } from '@uniformdev/canvas';
import { UniformCompositionComponent, UniformSlotComponent } from '@uniformdev/canvas-angular';

import type { UniformRouteResult } from '../uniform-route.resolver';

/**
 * Catch-all page: renders the composition resolved for the current route
 * (bound via `withComponentInputBinding` from the `route` resolver key).
 */
@Component({
  selector: 'app-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UniformCompositionComponent, UniformSlotComponent],
  template: `
    @if (composition(); as composition) {
      <uniform-composition [data]="composition" [matchedRoute]="matchedRoute()">
        <uniform-slot name="content" />
      </uniform-composition>
    } @else {
      <h2>Page not found</h2>
      <p>No composition matched this route.</p>
    }
  `,
})
export class PageComponent {
  /** Resolved Uniform route data (see `uniformRouteResolver`; redirects are handled in the resolver). */
  readonly route = input.required<UniformRouteResult>();

  protected readonly composition = computed<RootComponentInstance | undefined>(() => {
    const result = this.route();

    return result.type === 'composition' ? result.compositionApiResponse.composition : undefined;
  });

  /** The project map route this composition was matched for (Context analytics metadata). */
  protected readonly matchedRoute = computed(() => {
    const result = this.route();

    return result.type === 'composition' ? (result.matchedRoute ?? '') : '';
  });
}
