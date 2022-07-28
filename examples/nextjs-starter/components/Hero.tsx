import { ComponentProps } from "@uniformdev/canvas-react";

type HeroProps = ComponentProps<{
  title: string;
  description?: string;
}>;

const Hero: React.FC<HeroProps> = ({ title, description }: HeroProps) => (
  <>
    <h1 className="title">{title}</h1>
    <div
      className="description"
      dangerouslySetInnerHTML={{ __html: description }}
    />
  </>
);

export default Hero;
