import { useCallback, useState } from "react";

import { KlevuBanner, KlevuRecommendations, KlevuSearchLandingPage } from "@klevu/ui-react";
import { FilterManager, KlevuRecord, KlevuResponseQueryObject } from "@klevu/core";

import { ComponentProps, UniformSlot, registerUniformComponent } from "@uniformdev/canvas-react";

import { UniformKlevuDataProvider } from "@/components/UniformKlevuDataProvider";
import { KlevuSearchLandingPageCustomEvent } from "@klevu/ui/dist/types/components";
import { useFallbackTranslation } from "@/components/UniformKlevuTranslationProvider";
import { useKlevuBanners } from "@/hooks/useKlevuBanners";

export type CanvasKlevuSearchLandingPageProps = ComponentProps<{
    tSearchTitle?: string;
    defaultSearchTerm?: string;
    showSearch?: boolean;
    usePagination?: boolean;
    limit?: string;
    useInfiniteScroll?: boolean;
    tLoadMore?: string;
    filterCount?: string;
    usePersonalisation?: boolean;
    priceInterval?: string;
    showPriceAsSlider?: boolean;
}>;

const CanvasKlevuSearchLandingPage = (componentProps: CanvasKlevuSearchLandingPageProps) => {
    const { component, defaultSearchTerm, ...rawProps } = componentProps;

    const fallbackTranslation = useFallbackTranslation();

    const [records, setRecords] = useState<KlevuRecord[]>([]);
    const [filterManager, setFilterManager] = useState<FilterManager | undefined>(undefined);
    const [resultObject, setResultObject] = useState<KlevuResponseQueryObject | undefined>(undefined);

    const { topBanners, bottomBanners } = useKlevuBanners(resultObject, 'quicksearch');

    const currentTerm = resultObject ? resultObject.func.params?.term : undefined;

    const finalProps: Parameters<typeof KlevuSearchLandingPage>[0] = {
        ...rawProps,
        // WORKAROUND:
        // fallback to `*`, with empty term `KlevuFetch` fails with an error (`Search term is required for search query banners`)
        term:  currentTerm ?? defaultSearchTerm ?? "*",
        limit: rawProps.limit ? Number(rawProps.limit) : undefined,
        filterCount: rawProps.filterCount ? Number(rawProps.filterCount) : undefined,
        priceInterval: rawProps.priceInterval ? Number(rawProps.priceInterval) : undefined,
        usePersonalisation: !!rawProps.usePersonalisation,
        tSearchTitle: rawProps.tSearchTitle || fallbackTranslation.searchLandingPage?.tSearchTitle,
        tLoadMore: rawProps.tLoadMore || fallbackTranslation.searchLandingPage?.tLoadMore,
    }

    const handleKlevuData = useCallback((e: KlevuSearchLandingPageCustomEvent<{
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
            // WORKAROUND:
            // fallback to `*`, with empty term `KlevuFetch` fails with an error (`Search term is required for search query banners`)
            const params = e.detail.resultObject.func.params;
            if (params && !params.term) {
                params.term = "*";
            }

            setResultObject(e.detail.resultObject)
        }
    }, [])

    return (
        <KlevuSearchLandingPage {...finalProps} onKlevuData={handleKlevuData}>
            <UniformKlevuDataProvider records={records} filterManager={filterManager} resultObject={resultObject}>
                <div slot="facets">
                    <div {...{ part: "search-landing-page-sidebar" }}>
                        <UniformSlot name="facets" />
                    </div>
                </div>
                <div slot="content">
                    <div {...{ part: "search-landing-page-content" }}>
                        <slot name="topbanners">
                            {topBanners.map((b, index) => (
                                <KlevuBanner
                                    key={`top-banner-${index}`}
                                    imageUrl={b.bannerImg}
                                    linkUrl={b.redirectUrl}
                                    altText={b.bannerAltTag}
                                />
                            ))}
                        </slot>

                        <UniformSlot name="content" />

                        <slot name="bottombanners">
                            {bottomBanners.map((b, index) => (
                                <KlevuBanner
                                    key={`bottom-banner-${index}`}
                                    imageUrl={b.bannerImg}
                                    linkUrl={b.redirectUrl}
                                    altText={b.bannerAltTag}
                                />
                            ))}
                        </slot>
                    </div>
                </div>
            </UniformKlevuDataProvider>
        </KlevuSearchLandingPage>
    );
};

export default CanvasKlevuSearchLandingPage;

registerUniformComponent({
    type: 'klevu-search-landing-page',
    component: CanvasKlevuSearchLandingPage,
});
