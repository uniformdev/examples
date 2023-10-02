import { FC, useContext, useEffect, useMemo, useState } from "react";
import {
  ComponentProps,
  registerUniformComponent,
} from "@uniformdev/canvas-react";
import { buildQuerySummary } from "@coveo/headless";
import { Box, Grid } from "@mui/material";
import { HeadlessEngineContext } from "../context/Engine";

type QuerySummaryProps = ComponentProps<{
  listName?: string;
  durationSettings?: DurationSetting;
}>;

enum DurationSetting {
  milliseconds = "milliseconds",
  seconds = "seconds",
}

//Coveo Query Summary docs https://docs.coveo.com/en/headless/latest/reference/search/controllers/query-summary/

const QuerySummary: FC<QuerySummaryProps> = ({
  durationSettings = "",
  listName = "",
}) => {
  const headlessEngine = useContext(HeadlessEngineContext);

  const headlessQuerySummary = useMemo(
    () => buildQuerySummary(headlessEngine),
    [headlessEngine]
  );

  const [state, setState] = useState(headlessQuerySummary.state);

  useEffect(() => headlessQuerySummary.subscribe(() => setState(headlessQuerySummary.state)), [headlessQuerySummary]);

  const renderBold = (input: string) => (
    <Box component="span">
      <strong>{input}</strong>
    </Box>
  );

  if (!state.hasResults) {
    return (
      <Grid item xs={8}>
        <Box mt={5}>{`No ${listName?.toLowerCase() || "results"}`}</Box>
      </Grid>
    );
  }

  return (
    <Box>
      {`${listName} `}
      {renderBold(`${state.firstResult}-${state.lastResult}`)}
      <Box component="span"> of {renderBold(state.total.toString())}</Box>
      {Boolean(state.query) && (
        <Box component="span"> for {renderBold(state.query)}</Box>
      )}
      {Boolean(durationSettings) && (
        <Box component="span">
          {durationSettings === DurationSetting.seconds
            ? ` in ${state.durationInSeconds} seconds`
            : ` in ${state.durationInMilliseconds} milliseconds`}
        </Box>
      )}
    </Box>
  );
};

registerUniformComponent({
  type: "coveo-querySummary",
  component: QuerySummary,
});

export default QuerySummary;
