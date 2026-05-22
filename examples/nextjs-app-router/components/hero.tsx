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
    <section className="border-b border-neutral-200 bg-white px-6 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-3xl">
        <UniformText
          component={component}
          parameter={title}
          className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl"
          placeholder={"title goes here"}
          as="h1"
        />
        <UniformRichText
          component={component}
          parameter={description}
          className="mt-6 max-w-2xl text-base leading-7 text-neutral-600 [&_a]:font-medium [&_a]:text-neutral-900 [&_a]:underline [&_p+p]:mt-4"
          placeholder={"description goes here"}
        />
      </div>
    </section>
  );
};

export type HeroProps = {
  title: ComponentParameter<string>;
  description: ComponentParameter<string>;
};
