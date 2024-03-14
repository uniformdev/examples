import { useCallback, useState } from "react";

import { KlevuMerchandising } from "@klevu/ui-react";
import { FilterManager, KlevuRecord, KlevuResponseQueryObject } from "@klevu/core";

import { ComponentProps, UniformSlot, registerUniformComponent } from "@uniformdev/canvas-react";

import { UniformKlevuDataProvider } from "@/components/UniformKlevuDataProvider";
import { KlevuMerchandisingCustomEvent } from "@klevu/ui/dist/types/components";
import { useFallbackTranslation } from "@/components/UniformKlevuTranslationProvider";

export type CanvasKlevuMerchandisingProps = ComponentProps<{
    category?: string;
    categoryTitle?: string;
    usePagination?: boolean;
    limit?: string;
    useInfiniteScroll?: boolean;
    tLoadMore?: string;
    filterCount?: string;
    usePersonalisation?: boolean;
    useABTest?: boolean;
}>;

const CanvasKlevuMerchandising = (componentProps: CanvasKlevuMerchandisingProps) => {
    const { component, ...rawProps } = componentProps;

    const fallbackTranslation = useFallbackTranslation();

    const [records, setRecords] = useState<KlevuRecord[]>([]);
    const [filterManager, setFilterManager] = useState<FilterManager | undefined>(undefined);
    const [resultObject, setResultObject] = useState<KlevuResponseQueryObject | undefined>(undefined);

    const finalProps: Parameters<typeof KlevuMerchandising>[0] = {
        ...rawProps,
        category: rawProps.category ?? '',
        categoryTitle: rawProps.categoryTitle || getFallbackCategoryTitle(rawProps.category),
        limit: rawProps.limit ? Number(rawProps.limit) : undefined,
        usePersonalisation: !!rawProps.usePersonalisation,
        useABTest: !!rawProps.useABTest,
        filterCount: rawProps.filterCount ? Number(rawProps.filterCount) : undefined,
        tLoadMore: rawProps.tLoadMore || fallbackTranslation.merchandising?.tLoadMore,
    }

    const handleKlevuData = useCallback((e: KlevuMerchandisingCustomEvent<{
        resultObject: KlevuResponseQueryObject;
        records: KlevuRecord[];
        manager: FilterManager;
    }>) => {
        if (e.detail.records) {
            setRecords(e.detail.records);
        }
        if (e.detail.manager) {
            setFilterManager(e.detail.manager)
        }
        if (e.detail.resultObject) {
            setResultObject(e.detail.resultObject)
        }
    }, [])

    return (
        <KlevuMerchandising {...finalProps} onKlevuData={handleKlevuData}>
            <UniformKlevuDataProvider records={records} filterManager={filterManager} resultObject={resultObject}>
                <div slot="facets">
                    <div {...{ part: "merchandising-sidebar" }}>
                        <UniformSlot name="facets" />
                    </div>
                </div>
                <div slot="content">
                    <div {...{ part: "merchandising-content" }}>
                        <UniformSlot name="content" />
                    </div>
                </div>
            </UniformKlevuDataProvider>
        </KlevuMerchandising>
    );
};

export default CanvasKlevuMerchandising;

registerUniformComponent({
    type: 'klevu-merchandising',
    component: CanvasKlevuMerchandising,
});

const getFallbackCategoryTitle = (category: string | undefined): string => {
    if (!category) {
        return ''
    }

    const cleanCategory = category.replace(/[_-]/g, ' ').replace(/[ ]{2,}/g, ' ').trim();

    const capitalized = `${cleanCategory.charAt(0).toUpperCase()}${cleanCategory.slice(1)}`;
    return capitalized;
} 