import Link from "next/link";
import { AssetParamValue, flattenValues } from "@uniformdev/canvas";
import { UniformRichText } from "@uniformdev/canvas-next";
import {
  registerUniformComponent,
  ComponentProps,
  UniformText,
} from "@uniformdev/canvas-react";

type HeroProps = ComponentProps<{
  titleText?: string;
  descriptionText?: string;
  backgroundImage?: AssetParamValue;
}>;

const Hero: React.FC<HeroProps> = ({ backgroundImage }) => {
  const image = flattenValues(backgroundImage, { toSingle: true });

  return (
    <div
      className={`relative flex items-center justify-center min-h-[400px] px-6 py-24 text-center bg-cover bg-center ${image?.url ? 'bg-gray-900' : 'bg-gray-100'}`}
      style={image?.url ? { backgroundImage: `url(${image.url})` } : undefined}
    >
      {image?.url && <div className="absolute inset-0 bg-black/50" />}
      <div className="relative z-10 max-w-2xl">
        <UniformText
          parameterId="titleText"
          as="h1"
          className={`text-4xl font-bold tracking-tight sm:text-5xl ${image?.url ? 'text-white' : 'text-gray-900'}`}
          placeholder="Hero title goes here"
        />
        <div className={`mt-4 text-lg ${image?.url ? 'text-white/80' : 'text-gray-600'}`}>
          <UniformRichText
            parameterId="descriptionText"
            placeholder="Hero description goes here"
          />
        </div>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/products"
            className={`px-6 py-3 text-sm font-semibold transition-colors ${image?.url ? 'bg-white text-gray-900 hover:bg-gray-200' : 'bg-white text-gray-900 border border-gray-900 hover:bg-gray-100'}`}
          >
            Product Search
          </Link>
          <Link
            href="/articles"
            className={`px-6 py-3 text-sm font-semibold border transition-colors ${image?.url ? 'border-white text-white hover:bg-white/10' : 'border-gray-900 text-gray-900 hover:bg-gray-100'}`}
          >
            Article Search
          </Link>
        </div>
      </div>
    </div>
  );
};

registerUniformComponent({
  type: "hero",
  component: Hero,
});

export default Hero;
