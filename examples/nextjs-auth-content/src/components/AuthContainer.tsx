import { UniformSlot, ComponentProps } from '@uniformdev/next-app-router/component';

export type AuthContainerSlots = 'authorized' | 'unauthorized';

export const AuthContainer = ({ slots, context }: ComponentProps<{}, AuthContainerSlots>) =>
  context.pageState.keys?.authenticated === 'true' ? (
    <div style={{ margin: '1rem 0', padding: '1rem', border: '1px solid blue' }}>
      <UniformSlot slot={slots.authorized}/>
    </div>
  ) : (
    <div style={{ margin: '1rem 0', padding: '1rem', border: '1px solid orange' }}>
      <UniformSlot slot={slots.unauthorized}/>
    </div>
  );
