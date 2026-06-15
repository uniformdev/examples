import {
  ComponentParameter,
  ComponentProps,
  UniformText,
} from "@uniformdev/next-app-router/component";

export type CardProps = {
  title?: ComponentParameter<string>;
  description?: ComponentParameter<string>;
};

export const Card = ({
  parameters: { title, description },
  component,
}: ComponentProps<CardProps>) => {
  return (
    <div className="rounded border border-neutral-200 bg-white p-4 shadow-sm">
      {title ? (
        <UniformText
          component={component}
          parameter={title}
          as="div"
          className="font-medium"
          placeholder="Card title"
        />
      ) : null}
      {description ? (
        <UniformText
          component={component}
          parameter={description}
          as="p"
          className="mt-1 text-sm text-neutral-600"
          placeholder="Card description"
        />
      ) : null}
    </div>
  );
};
