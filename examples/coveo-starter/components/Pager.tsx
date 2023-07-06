import { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import { buildPager, PagerState } from "@coveo/headless";
import headlessEngine from "../context/Engine";
import { Box, Grid, Pagination, Typography } from "@mui/material";
import ResultsPerPage from "@/components/ResultsPerPage";

export interface PagerProps {
  pager?: {
    pager?: {
      resultsPerPage?: string;
    };
  };
}

const Pager: FC<PagerProps> = ({ pager }) => {
  const { resultsPerPage = "9" } = pager?.pager || {};

  const headlessPager = buildPager(headlessEngine, {
    options: { numberOfPages: 3 },
  });

  const [state, setState] = useState<PagerState>(headlessPager.state);

  useEffect(() => {
    const updateState = () => {
      setState(headlessPager.state);
    };
    headlessPager.subscribe(updateState);
  }, []);

  const setPage = (e: ChangeEvent<unknown>, page: number) => {
    headlessPager.selectPage(page);
  };

  return (
    <Box my={4}>
      <Grid container alignItems="center">
        <Grid item xs={6}>
          <Box>
            <Typography gutterBottom>Current page</Typography>
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
          <ResultsPerPage resultsPerPage={resultsPerPage} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Pager;
