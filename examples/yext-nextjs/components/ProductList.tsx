import { ComponentProps } from "@uniformdev/canvas-react";
import { Product } from "types/models";

type ProductListProps = ComponentProps<{
  products?: Array<{ data: Product }>;
}>;

const ProductList: React.FC<ProductListProps> = ({
  products,
}: ProductListProps) => {
  if (!products || !Array.isArray(products) || products.length <= 0) {
    return null;
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <div
          key={index}
          className="card w-96 bg-base-100 ol-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
        >
          <figure>
            <img
              src={product.data.primaryPhoto?.image?.url}
              alt={product.data.name}
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{product.data.name}</h2>
            <p
              dangerouslySetInnerHTML={{
                __html: product.data.richTextDescription,
              }}
            ></p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
