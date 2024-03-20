
import { KlevuFacetList } from "@klevu/ui-react";

import { ComponentProps, registerUniformComponent } from "@uniformdev/canvas-react";

import { useKlevuDataContext } from "@/components/UniformKlevuDataProvider";
import { KlevuFacetMode } from "@klevu/ui/dist/types/components";

export type CanvasKlevuFacetListProps = ComponentProps<{
    mode?: KlevuFacetMode;
    accordion?: boolean;
    useApplyButton?: boolean;
    applyButtonText?: string;
    clearButtonText?: string;
    defaultPriceLabel?: string;
}>;

const CanvasKlevuFacetList = (componentProps: CanvasKlevuFacetListProps) => {
    const { component, ...rawProps } = componentProps;

    const { filterManager } = useKlevuDataContext();

    const finalProps: Omit<Parameters<typeof KlevuFacetList>[0], 'manager'> = {
        ...rawProps,
        applyButtonText: rawProps.applyButtonText || 'Apply',
        clearButtonText: rawProps.clearButtonText || 'Clear',
        defaultPriceLabel: rawProps.defaultPriceLabel || 'Price',
    }

    return filterManager ? (
        <KlevuFacetList manager={filterManager} {...finalProps} />
    ) : null;
};

export default CanvasKlevuFacetList;

registerUniformComponent({
    type: 'klevu-facet-list',
    component: CanvasKlevuFacetList,
});