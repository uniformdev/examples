import { ComponentProps } from "@uniformdev/canvas-react";
import { Product } from "types/models";

type FeaturedProductProps = ComponentProps<{
  product?: Array<Product>;
}>;

const FeaturedProduct: React.FC<FeaturedProductProps> = ({
  product,
}: FeaturedProductProps) => {
  const featuredProduct =
    product && Array.isArray(product) && product.length > 0
      ? product[0]
      : undefined;

  if (!featuredProduct) {
    return null;
  }
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src={featuredProduct.primaryPhoto.image.url}
          className="max-w-sm rounded-lg shadow-2xl"
        />
        <div>
          <h1 className="text-5xl font-bold text-white">
            {featuredProduct.name}
          </h1>
          <div
            className="py-6 text-white"
            dangerouslySetInnerHTML={{
              __html: featuredProduct.richTextDescription,
            }}
          />
          <button className="btn btn-primary">Buy</button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
