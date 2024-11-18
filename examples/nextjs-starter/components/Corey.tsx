import {
  AssetParamValue,
  flattenValues,
  RichTextParamValue,
} from "@uniformdev/canvas";
import { UniformRichText } from "@uniformdev/canvas-next";
import {
  registerUniformComponent,
  ComponentProps,
  UniformText,
} from "@uniformdev/canvas-react";
import Image from "next/image";
import useSWR from "swr";

type HeroProps = ComponentProps<{
  title: string;
  description?: RichTextParamValue;
  image: AssetParamValue;
}>;

const fetcher = (url) => fetch(url).then((res) => res.json());

const Corey: React.FC<HeroProps> = ({ image }) => {
  const { isLoading, data } = useSWR("https://catfact.ninja/fact", fetcher);
  const imageSrc = flattenValues(image, { toSingle: true })?.url;
  console.log({ isLoading, data });
  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div>{data?.fact}</div>
          <UniformText
            className="title"
            parameterId="title"
            as="h1"
            data-test-id="hero-title"
            placeholder="title goes here"
          />
          <UniformRichText
            parameterId="description"
            className="description"
            placeholder="description goes here"
            data-test-id="hero-description"
          />
          <Image src={imageSrc} alt="Corey" width={200} height={200} />
        </>
      )}
    </div>
  );
};

registerUniformComponent({
  type: "corey",
  component: Corey,
});

export default Corey;
