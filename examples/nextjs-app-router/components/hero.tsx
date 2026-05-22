import {
  ComponentParameter,
  ComponentProps,
  UniformRichText,
  UniformText,
} from "@uniformdev/next-app-router/component";

export const HeroComponent = ({
  parameters: { title, description },
  // you can get variant if needed
  // variant,
  component,
}: ComponentProps<HeroProps>) => {
  return (
    <>
      <UniformText
        component={component}
        parameter={title}
        className="title"
        placeholder={"title goes here"}
        as="h1"
      />
      <UniformRichText
        component={component}
        parameter={description}
        placeholder={"description goes here"}
      />
    </>
  );
};

export type HeroProps = {
  title: ComponentParameter<string>;
  description: ComponentParameter<string>;
};
