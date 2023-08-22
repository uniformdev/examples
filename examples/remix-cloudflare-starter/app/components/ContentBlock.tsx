import { ComponentProps } from '@uniformdev/canvas-react';

type ContentBlockProps = ComponentProps<{
  text: string;
}>;

export function ContentBlock({ text }: ContentBlockProps) {
  return (
    <div style={{ border: '2px solid gray', padding: '1em', marginBottom: '1em' }}>
      <div>{text}</div>
    </div>
  );
}
