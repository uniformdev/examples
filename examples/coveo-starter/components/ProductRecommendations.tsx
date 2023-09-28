import {
  ProductRecommendation,
  loadClickAnalyticsActions,
  buildFrequentlyViewedTogetherList,
} from "@coveo/headless/product-recommendation";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { ProductRecommendationEngineContext } from "../context/PREngine";
import { registerUniformComponent } from "@uniformdev/canvas-react";

export const MAX_RECOMMENDATIONS = 50;

export const Recommendations: FC = () => {
  const productRecommendationsEngine = useContext(
    ProductRecommendationEngineContext
  );

  const frequentlyViewedTogetherBuild = useMemo(
    () =>
      buildFrequentlyViewedTogetherList(productRecommendationsEngine, {
        options: { maxNumberOfRecommendations: MAX_RECOMMENDATIONS },
      }),
    [productRecommendationsEngine]
  );

  const [state, setState] = useState(frequentlyViewedTogetherBuild.state);

  useEffect(() => {
    frequentlyViewedTogetherBuild.subscribe(() =>
      setState(frequentlyViewedTogetherBuild.state)
    );
    frequentlyViewedTogetherBuild.refresh();
  }, [frequentlyViewedTogetherBuild]);

  if (state.error) {
    return null;
  }
  const logClick = (recommendation: ProductRecommendation) => {
    if (!productRecommendationsEngine) {
      return;
    }

    const { logProductRecommendationOpen } = loadClickAnalyticsActions(
      productRecommendationsEngine
    );
    productRecommendationsEngine.dispatch(
      logProductRecommendationOpen(recommendation)
    );
  };

  return (
    <div className="recs-list">
      <h2>People also viewed</h2>
      <ul>
        {state.recommendations.map((recommendation) => {
          return (
            <li key={recommendation.permanentid}>
              <h2>
                <a
                  onClick={() => logClick(recommendation)}
                  onContextMenu={() => logClick(recommendation)}
                  onMouseDown={() => logClick(recommendation)}
                  onMouseUp={() => logClick(recommendation)}
                >
                  {recommendation.ec_name}
                </a>
              </h2>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

registerUniformComponent({
  type: "coveo-productRecommendations",
  component: Recommendations,
});

export default Recommendations;
