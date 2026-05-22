import { ComponentProps, UniformRichText, UniformText } from "@uniformdev/canvas-react";

type HeroProps = ComponentProps<{
  title: string;
  description?: string;
}>;

// This component is not using helpers for in-line editing
// const HeroPure: React.FC<HeroProps> = ({ title, description }) => (
//   <div>
//     <h1 className="title">{title}</h1>
//     <div className="description">{description}</div>
//   </div>
// );

const Hero: React.FC<HeroProps> = () => (
  <div>
    <UniformText
      className="title"
      parameterId="title"
      as="h1"
      data-test-id="hero-title"
      placeholder="Hero title goes here"
    />
    <UniformRichText parameterId="description" className="description" data-test-id="hero-description" />
  </div>
);

export default Hero;
