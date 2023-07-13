import { FC, useEffect, useMemo, useState } from "react";
import { registerUniformComponent } from "@uniformdev/canvas-react";
import { buildBreadcrumbManager } from "@coveo/headless";
import { Box, Breadcrumbs, Button, Typography } from "@mui/material";
import headlessEngine from "../context/Engine";
import { capitalizeFirstLetter } from "../utils";

//Coveo Facet Breadcrumbs docs https://docs.coveo.com/en/headless/latest/reference/search/controllers/breadcrumb-manager/

const FacetBreadcrumbs: FC = () => {
  const headlessBreadcrumbManager = useMemo(
    () => buildBreadcrumbManager(headlessEngine),
    [headlessEngine]
  );

  const [state, setState] = useState(headlessBreadcrumbManager.state);

  useEffect(() => {
    const updateState = () => {
      setState(headlessBreadcrumbManager.state);
    };
    headlessBreadcrumbManager.subscribe(updateState);
  }, []);

  const deselectAll = () => headlessBreadcrumbManager.deselectAll();

  return (
    <>
      {state.facetBreadcrumbs.map((breadcrumb, index) => (
        <div key={index}>
          <Typography>{capitalizeFirstLetter(breadcrumb.facetId)}</Typography>
          <Breadcrumbs>
            {breadcrumb.values.map((breadcrumbValue, index) => (
              <Button key={index} onClick={() => breadcrumbValue.deselect()}>
                <Typography color="text.primary">{`${breadcrumbValue.value.value}`}</Typography>
              </Button>
            ))}
          </Breadcrumbs>
        </div>
      ))}
      {state.hasBreadcrumbs && <Button onClick={deselectAll}>Clear all</Button>}
    </>
  );
};

registerUniformComponent({
  type: "coveo-facetBreadcrumbs",
  component: FacetBreadcrumbs,
});

export default FacetBreadcrumbs;
