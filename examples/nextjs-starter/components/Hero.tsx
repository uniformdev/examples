import {
  registerUniformComponent,
  ComponentProps,
  UniformText,
} from "@uniformdev/canvas-react";

type HeroProps = ComponentProps<{
  title: string;
  description?: string;
}>;

const Hero: React.FC<HeroProps> = ({ description }) => (
  <div>
    <UniformText className="title" parameterId="title" as="h1" />
    <div
      className="description"
      dangerouslySetInnerHTML={{ __html: description }}
    />
  </div>
);

registerUniformComponent({
  type: "hero",
  component: Hero,
});

export default Hero;
