import React, {FC, useEffect, useMemo, useState} from "react";
import { buildBreadcrumbManager } from "@coveo/headless";
import headlessEngine from "../context/Engine";
import {
  Breadcrumbs,
  Button,
  Typography,
} from "@mui/material";
import {capitalizeFirstLetter} from "../utils";

const FacetBreadcrumbsConfiguration: FC = () => {
  const headlessBreadcrumbManager = useMemo(() => buildBreadcrumbManager(headlessEngine), []);

  const [state, setState] = useState(headlessBreadcrumbManager.state);

  useEffect(() => {
    const updateState = () => {
      setState(headlessBreadcrumbManager.state);
    };
    headlessBreadcrumbManager.subscribe(updateState);
  }, []);

  return (
      <>
        {state.facetBreadcrumbs.map((breadcrumb, index) => (
            <div key={index}>
              <Typography>{capitalizeFirstLetter(breadcrumb.facetId)}</Typography>
              <Breadcrumbs>
                {breadcrumb.values.map((breadcrumbValue) => (
                    <Button onClick={() => breadcrumbValue.deselect()}>
                      <Typography color="text.primary">{`${breadcrumbValue.value.value}`}</Typography>
                    </Button>
                ))}
              </Breadcrumbs>
            </div>
        ))}
        {state.hasBreadcrumbs && (
            <Button onClick={() => headlessBreadcrumbManager.deselectAll()}>
              Clear all
            </Button>
        )}
      </>
  );
};

export interface FacetBreadcrumbsProps {
  facetBreadcrumbs: {
    facetBreadcrumbs: boolean;
  }
}

const FacetBreadcrumbs: FC<FacetBreadcrumbsProps> = ({facetBreadcrumbs}) => {
  if(!facetBreadcrumbs.facetBreadcrumbs) {
    return <></>;
  }
  return <FacetBreadcrumbsConfiguration/>;
}

export default FacetBreadcrumbs;
