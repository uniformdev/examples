import {
  DefaultNotImplementedComponent,
  ResolveComponentFunction,
  ResolveComponentResult,
} from '@uniformdev/canvas-next-rsc/component';
import * as mappings from './mappings';

export const resolveComponent: ResolveComponentFunction = ({ component }) => {
  let result: ResolveComponentResult = {
    component: DefaultNotImplementedComponent
  };

  const keys = Object.keys(mappings);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!;

    const mapping = (mappings as any)[key] as mappings.ResolveComponentResultWithType | undefined;

    if (mapping?.type === component.type) {
      result = mapping;
      break;
    }
  }

  return result;
};
