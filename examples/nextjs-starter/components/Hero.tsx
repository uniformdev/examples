import {
  registerUniformComponent,
  ComponentProps,
} from "@uniformdev/canvas-react";

type HeroProps = ComponentProps<{
  title: string;
  description?: string;
}>;

const Hero: React.FC<HeroProps> = ({ title, description }: HeroProps) => (
  <div>
    <h1 className="title">{title}</h1>
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
