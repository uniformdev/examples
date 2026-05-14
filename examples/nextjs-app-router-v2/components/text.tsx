import { ComponentParameter, ComponentProps, UniformText } from '@uniformdev/next-app-router/component';

export type TextProps = {
  text: ComponentParameter<string>;
};

export const Text = ({ parameters, component }: ComponentProps<TextProps>) => (
  <UniformText placeholder="Text goes here" parameter={parameters.text} component={component} />
);
