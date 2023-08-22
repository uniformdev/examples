import type { ComponentInstance } from '@uniformdev/canvas';
import type { ComponentProps } from '@uniformdev/canvas-react';
import { DefaultNotImplementedComponent } from '@uniformdev/canvas-react';
import type { ComponentType } from 'react';

import { ContentBlock } from './ContentBlock';
import { Hero } from './Hero';

const mappings: ComponentMapping = {
  hero: Hero,
  contentBlock: ContentBlock,
};

type ComponentMapping = Record<string, ComponentType<any>>;

export function resolveRenderer(component: ComponentInstance): ComponentType<ComponentProps<any>> | null {
  const componentImpl = mappings[component.type];
  return componentImpl ? componentImpl : DefaultNotImplementedComponent;
}

export default mappings;
