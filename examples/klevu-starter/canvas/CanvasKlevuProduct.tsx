

import { KlevuRecord } from "@klevu/core";
import { KlevuProduct } from "@klevu/ui-react";
import { KlevuProductVariant } from "@klevu/ui/dist/types/components";

import { ComponentProps, registerUniformComponent } from "@uniformdev/canvas-react";

import { useFallbackTranslation } from "@/components/UniformKlevuTranslationProvider";

export type CanvasKlevuProductProps = ComponentProps<{
    product?: Partial<KlevuRecord>;

    variant?: KlevuProductVariant;
    fixedWidth?: boolean;

    hideName?: boolean;
    hideDescription?: boolean;
    hideBrand?: boolean;
    hideImage?: boolean;
    hideHoverImage?: boolean;
    hidePrice?: boolean;
    hideSwatches?: boolean;

    showProductCode?: boolean;
    showRatings?: boolean;
    showRatingsCount?: boolean;
    showVariantsCount?: boolean;

    showAddToCart?: boolean;
    tAddToCart?: string;
    
    vatCaption?: string;
    outOfStockCaption?: string;
}>;

const CanvasKlevuProduct = (componentProps: CanvasKlevuProductProps) => {
    const { component, product, ...rawProps } = componentProps;

    const fallbackTranslation = useFallbackTranslation();

    const finalProps: Parameters<typeof KlevuProduct>[0] = {
        ...rawProps,
        variant: rawProps.variant || 'default',
        showProductCode: !!rawProps.showProductCode,
        showRatings: !!rawProps.showRatings,
        showRatingsCount: !!rawProps.showRatingsCount,
        showVariantsCount: !!rawProps.showVariantsCount,
        showAddToCart: !!rawProps.showAddToCart,
        tAddToCart: rawProps.tAddToCart || fallbackTranslation.product?.tAddToCart,
    }

    return product ? (
        <KlevuProduct {...finalProps} product={product} />
    ) : null;
};

export default CanvasKlevuProduct;

registerUniformComponent({
    type: 'klevu-product',
    component: CanvasKlevuProduct,
});