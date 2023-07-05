/* eslint-disable no-use-before-define */
import React, {FC, useEffect, useMemo, useState} from "react";
import {
  buildQuerySummary,
  QuerySummary as QuerySummaryType,
  QuerySummaryState,
} from "@coveo/headless";
import headlessEngine from "../context/Engine";
import {Box, Grid} from "@mui/material";


const QuerySummaryConfiguration: FC = () => {
  const headlessQuerySummary = useMemo(()=> buildQuerySummary(headlessEngine), []);
  const [state, setState] = useState(headlessQuerySummary.state);

  useEffect(() => {
    const updateState = () => {
      setState(headlessQuerySummary.state);
    };
    headlessQuerySummary.subscribe(updateState);
  }, [headlessQuerySummary]);

  const renderNoResults = () => <Box mt={5}>No results</Box>;

  const renderBold = (input: string) => (
      <Box component="span">
        <strong>{input}</strong>
      </Box>
  );

  const renderRange = () => renderBold(` ${state.firstResult}-${state.lastResult}`);

  const renderTotal = () => (
      <Box component="span">
        {' '}
        of {renderBold(state.total.toString())}
      </Box>
  );

  const renderQuery = () => {
    if (state.hasQuery) {
      return <Box component="span"> for {renderBold(state.query)}</Box>;
    }
  };

  const renderDuration = () => ` in ${state.durationInSeconds} seconds`;

  const renderHasResults = () => (
      <Box>
        Results{renderRange()}
        {renderTotal()}
        {renderQuery()}
        {renderDuration()}
      </Box>
  );

  return <Grid item xs={8}>
    {!state.hasResults ? renderNoResults() : renderHasResults()}
  </Grid>;
};

export interface QuerySummaryProps {
  querySummary: {
    querySummary: boolean;
  }
}

const QuerySummary: FC<QuerySummaryProps> = ({querySummary}) => {
  if(!querySummary.querySummary) {
    return <></>;
  }
  return <QuerySummaryConfiguration/>;
}

export default QuerySummary;
