import { ComponentProps, UniformRichText, UniformText } from "@uniformdev/canvas-react";
import UiHero from '../ui/Hero'

type HeroProps = ComponentProps<{
  title: string;
  description?: string;
}>;

const Hero: React.FC<HeroProps> = () => (
  <UiHero
    title={
      <UniformText
        parameterId="title"
        as="span"
        placeholder="Hero title goes here"
      />
    }
    description={
      <UniformRichText parameterId="description"/>
    }/>
);

export default Hero;
