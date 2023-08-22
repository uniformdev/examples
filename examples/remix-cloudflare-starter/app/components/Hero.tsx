import { ComponentProps, UniformSlot } from '@uniformdev/canvas-react';

type HeroProps = ComponentProps<{
  copy: string;
  title: string;
}>;

export function Hero({ copy, title }: HeroProps) {
  return (
    <div style={{ border: '2px solid gray', padding: '1em', marginBottom: '1em' }}>
      <h1>{title}</h1>
      <div>{copy}</div>

      <UniformSlot name="items" />
    </div>
  );
}
