import { ResolveComponentFunction, type ResolveComponentResult } from '@uniformdev/canvas-next-rsc-v2';

import { DefaultNotFoundComponent } from './default';
import { HeroComponent } from './hero';
import { Page } from './page';

export const resolveComponent: ResolveComponentFunction = ({ component }) => {
  let result: ResolveComponentResult | undefined;

  if (component.type === 'page') {
    result = {
      component: Page,
    };
  } else if (component.type === 'hero') {
    result = {
      component: HeroComponent,
    };
  }

  return (
    result || {
      component: DefaultNotFoundComponent,
    }
  );
};
