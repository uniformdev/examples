
import { KlevuProductGrid } from "@klevu/ui-react";

import { ComponentProps, registerUniformComponent } from "@uniformdev/canvas-react";

import { useKlevuDataContext } from "@/components/UniformKlevuDataProvider";
import { useTemplateComponentFromSlot } from "@/hooks/useTemplateComponentFromSlot";

export type CanvasKlevuProductGridProps = ComponentProps<{
    itemsPerRow?: string;
}>;

const PRODUCT_COMPONENT_SLOT = 'productComponent';

const CanvasKlevuProductGrid = (componentProps: CanvasKlevuProductGridProps) => {
    const { records = [] } = useKlevuDataContext();

    const itemsPerRowNum = componentProps.itemsPerRow ? Number(componentProps.itemsPerRow) : undefined;

    const { 
        props: productProps,
        Component: ProductComponent 
    } = useTemplateComponentFromSlot(componentProps.component, PRODUCT_COMPONENT_SLOT);

    return (
        <KlevuProductGrid itemsPerRow={itemsPerRowNum}>
            {ProductComponent ? records.map((record) => (
                <ProductComponent key={record.id} {...productProps} product={record} />
            )) : null}
        </KlevuProductGrid>
    );
};

export default CanvasKlevuProductGrid;

registerUniformComponent({
    type: 'klevu-product-grid',
    component: CanvasKlevuProductGrid,
});