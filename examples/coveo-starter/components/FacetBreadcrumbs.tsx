import {FC, useEffect, useMemo, useState} from "react";
import { buildBreadcrumbManager } from "@coveo/headless";
import { Breadcrumbs, Button, Typography } from "@mui/material";
import headlessEngine from "../context/Engine";
import { capitalizeFirstLetter } from "../utils";

const FacetBreadcrumbsConfiguration: FC = () => {
  const headlessBreadcrumbManager = useMemo(()=>buildBreadcrumbManager(headlessEngine),[headlessEngine]);

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

export interface FacetBreadcrumbsProps {
  facetBreadcrumbs?: {
    facetBreadcrumbsConfiguration?: boolean;
  };
}

const FacetBreadcrumbs: FC<FacetBreadcrumbsProps> = ({ facetBreadcrumbs }) => {
  if (!facetBreadcrumbs?.facetBreadcrumbsConfiguration) {
    return <></>;
  }
  return <FacetBreadcrumbsConfiguration />;
};

export default FacetBreadcrumbs;
