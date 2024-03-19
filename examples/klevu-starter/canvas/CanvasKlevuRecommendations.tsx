
import { KlevuRecommendations } from "@klevu/ui-react";

import { ComponentProps, registerUniformComponent } from "@uniformdev/canvas-react";

type SharedRecommendationsProps = {
    recommendationId?: string;
    recommendationTitle?: string;
}

export type CanvasKlevuRecommendationsProps = ComponentProps<SharedRecommendationsProps>;

export const CanvasKlevuRecommendations = (componentProps: CanvasKlevuRecommendationsProps) => {
    const { recommendationId, recommendationTitle } = componentProps;

    return recommendationId ? (
        <KlevuRecommendations
            recommendationId={recommendationId}
            {...(recommendationTitle ? { recommendationTitle } : undefined)}
        />
    ) : null;
};

export type CanvasKlevuCategoryRecommendationsProps = ComponentProps<SharedRecommendationsProps & {
    categoryPath?: string;
}>;

export const CanvasKlevuCategoryRecommendations = (componentProps: CanvasKlevuCategoryRecommendationsProps) => {
    const { recommendationId, recommendationTitle, categoryPath } = componentProps;

    return recommendationId  && categoryPath ? (
        <KlevuRecommendations
            recommendationId={recommendationId} 
            categoryPath={categoryPath}
            {...(recommendationTitle ? { recommendationTitle } : undefined)}
        />
    ) : null;
};

export type CanvasKlevuProductRecommendationsProps = ComponentProps<SharedRecommendationsProps & {
    currentProductId?: string;
    itemGroupId?: string;
}>;

export const CanvasKlevuProductRecommendations = (componentProps: CanvasKlevuProductRecommendationsProps) => {
    const { recommendationId, recommendationTitle, currentProductId, itemGroupId } = componentProps;

    return recommendationId && currentProductId ? (
        <KlevuRecommendations
            recommendationId={recommendationId}
            currentProductId={currentProductId}
            itemGroupId={itemGroupId}
            {...(recommendationTitle ? { recommendationTitle } : undefined)}
        />
    ) : null;
};

registerUniformComponent({
    type: 'klevu-recommendations',
    component: CanvasKlevuRecommendations,
});

registerUniformComponent({
    type: 'klevu-category-recommendations',
    component: CanvasKlevuCategoryRecommendations,
});

registerUniformComponent({
    type: 'klevu-product-recommendations',
    component: CanvasKlevuProductRecommendations,
});