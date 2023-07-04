import React from "react";
import {
  BreadcrumbManager as BreadcrumbManagerType,
  BreadcrumbManagerState,
  buildBreadcrumbManager,
} from "@coveo/headless";
import headlessEngine from "../context/Engine";
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { Clear } from "@mui/icons-material";

const hoveredStyle = {
  cursor: "pointer",
};

const clearStyle = {
  fontSize: "1em",
};

export default class FacetBreadcrumbs extends React.Component {
  private headlessBreadcrumbManager: BreadcrumbManagerType;
  state: BreadcrumbManagerState;

  constructor(props: {}) {
    super(props);

    this.headlessBreadcrumbManager = buildBreadcrumbManager(headlessEngine);

    this.state = this.headlessBreadcrumbManager.state;
  }

  componentDidMount() {
    this.headlessBreadcrumbManager.subscribe(() => this.updateState());
  }

  updateState() {
    this.setState(this.headlessBreadcrumbManager.state);
  }

  getFacetBreadcrumbs() {
    const breadcrumbs = this.state.facetBreadcrumbs;
    return breadcrumbs.map((breadcrumb) => (
      <div key={breadcrumb.field}>
        <Typography>
          {breadcrumb.field.charAt(0).toUpperCase() + breadcrumb.field.slice(1)}
          :
        </Typography>
        {breadcrumb.values.map((value) => (
          <div key={breadcrumb.field + value.value.value}>
            <Link
              onClick={() => value.deselect()}
              variant="caption"
              underline="none"
              style={hoveredStyle}
            >
              <Grid container>
                <Grid item>
                  <Box mt={0.3}>{value.value.value}</Box>
                </Grid>
                <Grid item>
                  <Clear fontSize="small" />
                </Grid>
              </Grid>
            </Link>
          </div>
        ))}
      </div>
    ));
  }

  getFacetTitle(facetId: string) {
    switch (facetId) {
      case "ec_brand":
        return "Brand";
      case "eng_frequencies":
        return "Frequencies";
      case "eng_processor":
        return "Processor";
      case "store_name":
        return "Store name";
    }
  }

  render() {
    return (
      <>
        {this.state.facetBreadcrumbs.map((breadcrumb) => {
          return (
            <>
              <Typography>{this.getFacetTitle(breadcrumb.facetId)}</Typography>
              <Breadcrumbs>
                {breadcrumb.values.map((breadcrumbValue) => {
                  return (
                    <Button onClick={() => breadcrumbValue.deselect()}>
                      <Typography color="text.primary">{`${breadcrumbValue.value.value}`}</Typography>
                    </Button>
                  );
                })}
              </Breadcrumbs>
            </>
          );
        })}
        {this.headlessBreadcrumbManager.state.hasBreadcrumbs && (
          <Button onClick={() => this.headlessBreadcrumbManager.deselectAll()}>
            Clear all
          </Button>
        )}
      </>
    );
  }
}
