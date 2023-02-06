import {
  ComponentProps,
  registerUniformComponent,
} from "@uniformdev/canvas-react";

type HeroProps = ComponentProps<{
  datasource?: {
    TeaserTitle: string;
    TeaserSummary?: string;
  };
}>;

const Hero: React.FC<HeroProps> = ({ datasource }: HeroProps) => {
  const { TeaserTitle, TeaserSummary } = datasource || {};
  return (
    <div>
      <h1 className="title">{TeaserTitle}</h1>
      <div
        className="description"
        dangerouslySetInnerHTML={{ __html: TeaserSummary }}
      />
    </div>
  );
};

// making sure `<UniformSlot />` how to render components with type 'hero'
registerUniformComponent({
  type: "hero",
  component: Hero,
});

export default Hero;
