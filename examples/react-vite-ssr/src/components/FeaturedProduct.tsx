import { ComponentProps, UniformRichText, UniformText } from "@uniformdev/canvas-react";
import { Section, Img, Text, Heading, Button } from "@react-email/components";
import { AssetParamValue, flattenValues } from "@uniformdev/canvas";

type FeaturedProductProps = ComponentProps<{
  title: string;
  description?: string;
  image: AssetParamValue;
}>;

const FeaturedProduct: React.FC<FeaturedProductProps> = ({ image }) => {
  const { url, title, height } = (flattenValues(image, { toSingle: true }) as any) || {};
  return (
    <Section style={{ marginTop: 16, marginBottom: 16 }}>
      <Img
        alt={title}
        height={height}
        src={url}
        style={{
          width: "100%",
          borderRadius: 12,
          objectFit: "cover",
        }}
      />
      <Section style={{ marginTop: 32, textAlign: "center" }}>
        <Text
          style={{
            marginTop: 16,
            fontSize: 18,
            lineHeight: "28px",
            fontWeight: 600,
            color: "rgb(79,70,229)",
          }}
        >
          <UniformText parameterId="eyebrowText" placeholder="Eyebrow text goes here" />
        </Text>
        <Heading
          as="h1"
          style={{
            fontSize: 36,
            lineHeight: "40px",
            fontWeight: 600,
            letterSpacing: 0.4,
            color: "rgb(17,24,39)",
          }}
        >
          <UniformText parameterId="title" placeholder="Title text goes here" />
        </Heading>
        <Text
          style={{
            marginTop: 8,
            fontSize: 16,
            lineHeight: "24px",
            color: "rgb(107,114,128)",
          }}
        >
          <UniformRichText parameterId="description" placeholder="Description text goes here" />
        </Text>
        <Text
          style={{
            fontSize: 16,
            lineHeight: "24px",
            fontWeight: 600,
            color: "rgb(17,24,39)",
          }}
        >
          <UniformText parameterId="price" placeholder="Price text goes here" />
        </Text>
        <Button
          href="https://react.email"
          style={{
            marginTop: 16,
            borderRadius: 8,
            backgroundColor: "rgb(79,70,229)",
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 12,
            paddingBottom: 12,
            fontWeight: 600,
            color: "rgb(255,255,255)",
          }}
        >
          Buy now
        </Button>
      </Section>
    </Section>
  );
};

export default FeaturedProduct;
