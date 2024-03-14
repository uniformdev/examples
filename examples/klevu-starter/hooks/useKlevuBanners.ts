import { useEffect, useState } from "react";

import { KlevuBanner, KlevuResponseQueryObject } from "@klevu/core";

export const useKlevuBanners = (
  resultObject: KlevuResponseQueryObject | null | undefined,
  searchType?: "quicksearch" | "landingpage"
): { 
  topBanners: KlevuBanner[]; 
  bottomBanners: KlevuBanner[];
} => {
  const [topBanners, setTopBanners] = useState<KlevuBanner[]>([]);
  const [bottomBanners, setBottomBanners] = useState<KlevuBanner[]>([]);
    
  useEffect(() => {
    if (!resultObject) {
        return;
    }

    (async() => {
      try {
        const allBanners = await resultObject.getBanners({ searchType });

        setTopBanners(allBanners.filter((x) => x.position === 'top'));
        setBottomBanners(allBanners.filter((x) => x.position === 'bottom'));

      } catch (e) {
        console.error(e);
      }
    })();
  }, [resultObject, searchType]);

  return { topBanners, bottomBanners };
};
