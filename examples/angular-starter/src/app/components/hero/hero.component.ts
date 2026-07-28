import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { ComponentParameter } from '@uniformdev/canvas';
import { UniformRichTextComponent, UniformTextDirective } from '@uniformdev/canvas-angular';

/**
 * Demo Canvas component: renders the `title` text parameter and the `description`
 * parameter, which may be plain text or a Canvas rich text value. Both are annotated
 * for editing in the Canvas editor.
 */
@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UniformRichTextComponent, UniformTextDirective],
  template: `
    <section class="hero" [attr.data-testid]="'hero'" [attr.data-hero-title]="title()">
      <!-- uniformText renders the parameter value and makes it inline-editable in Canvas -->
      <h2 uniformText="title" placeholder="Enter title"></h2>
      @if (isRichText()) {
        <!-- uniformRichText renders the node tree and annotates it for the editor -->
        <div
          class="hero-description"
          uniformRichText="description"
          placeholder="Enter description"
        ></div>
      } @else if (plainDescription(); as description) {
        <p class="hero-description">{{ description }}</p>
      }
    </section>
  `,
  styles: `
    .hero {
      border: 1px solid #d0d0d0;
      border-radius: 8px;
      padding: 1rem 1.5rem;
      margin: 0.75rem 0;
    }
    .hero h2 {
      margin: 0 0 0.25rem;
    }
    .hero-description {
      color: #555;
    }
    .hero-description p {
      margin: 0 0 0.25rem;
    }
  `,
})
export class HeroComponent {
  readonly parameters = input<Record<string, ComponentParameter>>({});

  protected readonly title = computed(() => (this.parameters()['title']?.value as string) ?? '');

  private readonly description = computed(() => this.parameters()['description']?.value);

  /** Rich text renders through `<uniform-rich-text>`; plain string values render as a paragraph. */
  protected readonly isRichText = computed(() => typeof this.description() === 'object');

  protected readonly plainDescription = computed(() =>
    typeof this.description() === 'string' ? (this.description() as string) : undefined
  );
}
