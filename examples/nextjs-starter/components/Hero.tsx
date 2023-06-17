import {
  registerUniformComponent,
  ComponentProps,
  UniformText,
} from "@uniformdev/canvas-react";

type HeroProps = ComponentProps<{
  title: string;
  description?: string;
}>;

const Hero: React.FC<HeroProps> = () => (
  <div>
    <UniformText className="title" parameterId="title" as="h1" />
    <div className="description">
      <UniformText parameterId="description" />
    </div>
  </div>
);

registerUniformComponent({
  type: "hero",
  component: Hero,
});

export default Hero;
