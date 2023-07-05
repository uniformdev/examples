import React, {FC, useEffect, useMemo, useState} from "react";
import {buildPager, FacetState, Pager as PagerType, PagerState} from "@coveo/headless";
import headlessEngine from "../context/Engine";
import {Box, Grid, Pagination, Typography} from "@mui/material";
import ResultsPerPage from "@/components/ResultsPerPage";

export interface PagerProps {
    pager?: {
        pager?: {
            resultsPerPage?: string;
        }
    }
}

const Pager: FC<PagerProps> = ({pager}) => {

  const {resultsPerPage = '9' } = pager?.pager || {};

  const headlessPager = useMemo(() => buildPager(headlessEngine, { options: { numberOfPages: 3 } }), []);
  const [state, setState] = useState<PagerState>(headlessPager.state);


    useEffect(() => {
        const updateState = () => {
            setState(headlessPager.state);
        };
        headlessPager.subscribe(updateState);
    }, []);

  const setPage = (pageNumber: number) => {
    headlessPager.selectPage(pageNumber);
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
                          onChange={(e, page) => setPage(page)}
                          variant="outlined"
                          color="primary"
                      />
                  </Box>
              </Grid>
              <Grid item xs={6}>
                  <ResultsPerPage resultsPerPage={resultsPerPage}/>
              </Grid>
          </Grid>
      </Box>
  );
};

export default Pager;
