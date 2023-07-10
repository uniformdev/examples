import { FC, useEffect, useMemo, useState } from "react";
import {
  ComponentProps,
  registerUniformComponent,
} from "@uniformdev/canvas-react";
import { buildQuerySummary } from "@coveo/headless";
import { Box, Grid } from "@mui/material";
import headlessEngine from "../context/Engine";

//Coveo Query Summary docs https://docs.coveo.com/en/headless/latest/reference/search/controllers/query-summary/

const QuerySummaryConfiguration: FC = () => {
  const headlessQuerySummary = useMemo(
    () => buildQuerySummary(headlessEngine),
    [headlessEngine]
  );

  const [state, setState] = useState(headlessQuerySummary.state);

  useEffect(() => {
    const updateState = () => {
      setState(headlessQuerySummary.state);
    };
    headlessQuerySummary.subscribe(updateState);
  }, []);

  const renderBold = (input: string) => (
    <Box component="span">
      <strong>{input}</strong>
    </Box>
  );

  if (!state.hasResults) {
    return (
      <Grid item xs={8}>
        <Box mt={5}>No results</Box>
      </Grid>
    );
  }

  return (
    <Grid item xs={8}>
      <Box>
        Results{renderBold(` ${state.firstResult}-${state.lastResult}`)}
        <Box component="span"> of {renderBold(state.total.toString())}</Box>
        {Boolean(state.query) && (
          <Box component="span"> for {renderBold(state.query)}</Box>
        )}
        <Box component="span">{` in ${state.durationInSeconds} seconds`}</Box>
      </Box>
    </Grid>
  );
};

type QuerySummaryProps = ComponentProps<{
  querySummary?: {
    querySummaryConfiguration?: boolean;
  };
}>;

const QuerySummary: FC<QuerySummaryProps> = ({ querySummary }) => {
  if (!querySummary?.querySummaryConfiguration) {
    return null;
  }
  return <QuerySummaryConfiguration />;
};

registerUniformComponent({
  type: "coveo-querySummary",
  component: QuerySummary,
});

export default QuerySummary;
