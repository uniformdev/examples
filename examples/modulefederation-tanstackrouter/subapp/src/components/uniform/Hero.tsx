import { ComponentProps, UniformRichText, UniformSlot, UniformText } from "@uniformdev/canvas-react";
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
    }
    ctas={
      <UniformSlot name="ctas" />
    }
  />
);

export default Hero;
