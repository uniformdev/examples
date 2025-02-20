import { ComponentProps, UniformRichText, UniformText } from "@uniformdev/canvas-react";
import { Section, Row, Text, Column, Link, Img } from "@react-email/components";
import { flattenValues } from "@uniformdev/canvas";
import { AssetParamValue } from "@uniformdev/canvas";

type ProductGalleryProps = ComponentProps<{
  title: string;
  description?: string;
  gallery: AssetParamValue;
}>;

const ProductGallery: React.FC<ProductGalleryProps> = ({ gallery }) => {
  const images = flattenValues(gallery) as any;
  return (
    <Section style={{ marginTop: 16, marginBottom: 16 }}>
      <Section>
        <Row>
          <Text
            style={{
              margin: "0px",
              fontSize: 16,
              lineHeight: "24px",
              fontWeight: 600,
              color: "rgb(79,70,229)",
            }}
          >
            <UniformText parameterId="eyebrowText" placeholder="Eyebrow text goes here" />
          </Text>
          <Text
            style={{
              margin: "0px",
              marginTop: 8,
              fontSize: 24,
              lineHeight: "32px",
              fontWeight: 600,
              color: "rgb(17,24,39)",
            }}
          >
            <UniformText parameterId="title" placeholder="Title text goes here" />
          </Text>
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
        </Row>
      </Section>
      <Section style={{ marginTop: 16 }}>
        <Row style={{ marginTop: 16 }}>
          <Column style={{ width: "50%", paddingRight: 8 }}>
            {images[0] ? (
              <Row style={{ paddingBottom: 8 }}>
                <td>
                  <Link href="#">
                    <Img
                      alt={images[0]?.title}
                      height={images[0]?.height}
                      src={images[0]?.url}
                      style={{
                        width: "100%",
                        borderRadius: 12,
                        objectFit: "cover",
                      }}
                    />
                  </Link>
                </td>
              </Row>
            ) : null}
            {images[1] ? (
              <Row style={{ paddingTop: 8 }}>
                <td>
                  <Link href="#">
                    <Img
                      alt={images[1]?.title}
                      height={images[1]?.height}
                      src={images[1]?.url}
                      style={{
                        width: "100%",
                        borderRadius: 12,
                        objectFit: "cover",
                      }}
                    />
                  </Link>
                </td>
              </Row>
            ) : null}
          </Column>
          {images[2] ? (
            <Column
              style={{
                width: "50%",
                paddingLeft: 8,
                paddingTop: 8,
                paddingBottom: 8,
              }}
            >
              <Link href="#">
                <Img
                  alt={images[2]?.title}
                  height={152 + 152 + 8 + 8}
                  src={images[2]?.url}
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    objectFit: "cover",
                  }}
                />
              </Link>
            </Column>
          ) : null}
        </Row>
      </Section>
    </Section>
  );
};

export default ProductGallery;
