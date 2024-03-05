
import { useMemo } from "react";

import { KlevuFacet } from "@klevu/ui-react";
import { KlevuFacetMode } from "@klevu/ui/dist/types/components";
import { KlevuFilterType } from "@klevu/core";

import { ComponentProps, registerUniformComponent } from "@uniformdev/canvas-react";

import { useKlevuDataContext } from "@/components/UniformKlevuDataProvider";
import { useFallbackTranslation } from "@/components/UniformKlevuTranslationProvider";

export type CanvasKlevuAllowedFacetProps = ComponentProps<{
    facet?: {
        facetKey?: string;
    }
    mode?: KlevuFacetMode;
    accordion?: boolean;
    accordionStartOpen?: boolean;
    useColorSwatch?: boolean;
    tAll?: string;
    tMore?: string;
}>;

const CanvasKlevuAllowedFacet = (componentProps: CanvasKlevuAllowedFacetProps) => {
    const { component, facet, ...rawProps } = componentProps;

    const fallbackTranslation = useFallbackTranslation();

    const { filterManager } = useKlevuDataContext();

    const facetFilter = useMemo(() => {
        if (!filterManager || !facet?.facetKey) {
            return;
        }

        return filterManager.filters.find((x) => x.key === facet.facetKey);
    }, [filterManager?.filters, facet?.facetKey]);

    if (!facetFilter) {
        return null;
    }

    const finalProps: Omit<Parameters<typeof KlevuFacet>[0], 'manager'> = {
        ...rawProps,
        tAll: rawProps.tAll || fallbackTranslation.facet?.tAll,
        tMore: rawProps.tMore || fallbackTranslation.facet?.tMore,
        option: facetFilter.type === KlevuFilterType.Slider ? undefined : facetFilter,
        slider: facetFilter.type === KlevuFilterType.Slider ? facetFilter : undefined,
    }

    return filterManager ? (
        <KlevuFacet key={facetFilter.key} {...finalProps} manager={filterManager} />
    ) : null;
};

export default CanvasKlevuAllowedFacet;

registerUniformComponent({
    type: 'klevu-allowed-facet',
    component: CanvasKlevuAllowedFacet,
});