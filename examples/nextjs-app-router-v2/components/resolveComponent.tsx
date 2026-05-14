import { ResolveComponentFunction, type ResolveComponentResult } from '@uniformdev/next-app-router';
import { Page } from './page';
import { Text } from './text';

export const resolveComponent: ResolveComponentFunction = ({ component }) => {
  let result: ResolveComponentResult | undefined;

  if (component.type === 'page') {
    result = {
      component: Page,
    };
  } else if (component.type === 'text') {
    result = {
      component: Text,
    };
  }

  return (
    result || {
      component: () => <div>Component {component?.type} not found</div>,
    }
  );
};
