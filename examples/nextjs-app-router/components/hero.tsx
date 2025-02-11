import {
  ComponentProps,
  UniformRichText,
  UniformText,
} from "@uniformdev/canvas-next-rsc/component";
import { ResolveComponentResultWithType } from "@/uniform/models";
import { AssetParamValue } from "@uniformdev/canvas";
import { flattenValues } from "@uniformdev/canvas";
import Image from "next/image";

export const HeroComponent = ({
  image1,
  component,
  context,
}: ComponentProps<HeroProps>) => {
  const asset = flattenValues(image1, {
    toSingle: true,
  });

  let isPdf = false;
  if (asset?.mediaType === "application/pdf") {
    isPdf = true;
  }

  return (
    <>
      <UniformText
        component={component}
        context={context}
        parameterId="title"
        as="h1"
        className="title"
        placeholder="Enter hero title"
      />
      <UniformRichText
        component={component}
        parameterId="description"
        className="description"
        placeholder="Enter hero description"
      />
      {isPdf ? (
        <a href={asset?.url} target="_blank">
          {asset?.title}
        </a>
      ) : null}
      {!isPdf && asset?.url ? (
        <Image
          src={asset.url}
          alt={asset.title!}
          width={asset.width as number}
          height={asset.height as number}
        />
      ) : null}
      <hr />
    </>
  );
};

export type HeroProps = {
  title: string;
  description: string;
  image1: AssetParamValue;
};

export const heroMapping: ResolveComponentResultWithType = {
  type: "hero",
  component: HeroComponent,
};
