import { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import {
  ComponentProps,
  registerUniformComponent,
} from "@uniformdev/canvas-react";
import { buildPager, buildResultsPerPage, PagerState } from "@coveo/headless";
import { Box, Grid, Pagination, Typography } from "@mui/material";
import headlessEngine from "../context/Engine";

type PagerProps = ComponentProps<{
  resultsPerPage?: string;
  title?: string;
}>;

//Coveo Pager docs https://docs.coveo.com/en/headless/latest/reference/search/controllers/pager/

//Coveo Result Per Page docs https://docs.coveo.com/en/headless/latest/reference/search/controllers/results-per-page/

const Pager: FC<PagerProps> = ({ resultsPerPage = "9", title = "" }) => {
  const headlessPager = useMemo(
    () => buildPager(headlessEngine),
    [headlessEngine]
  );

  const [state, setState] = useState<PagerState>(headlessPager.state);

  useEffect(() => {
    const updateState = () => {
      setState(headlessPager.state);
    };
    headlessPager.subscribe(updateState);
  }, []);

  const headlessResultsPerPage = useMemo(
    () => buildResultsPerPage(headlessEngine),
    [headlessEngine]
  );

  useEffect(() => {
    headlessResultsPerPage.set(parseInt(resultsPerPage, 10) || 9);
  }, [resultsPerPage]);

  const setPage = (e: ChangeEvent<unknown>, page: number) => {
    headlessPager.selectPage(page);
  };

  return (
    <Box my={4}>
      <Grid container alignItems="center">
        <Grid item xs={6}>
          <Box>
            <Typography gutterBottom>{title || "Current page"}</Typography>
            <Pagination
              page={state.currentPage || 1}
              count={state.maxPage}
              onChange={setPage}
              variant="outlined"
              color="primary"
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography>{`Results per page: ${headlessResultsPerPage.state.numberOfResults}`}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

registerUniformComponent({
  type: "coveo-pager",
  component: Pager,
});

export default Pager;
