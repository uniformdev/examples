/* eslint-disable no-use-before-define */
import React from "react";
import {
  buildQuerySummary,
  QuerySummary as QuerySummaryType,
  QuerySummaryState,
} from "@coveo/headless";
import headlessEngine from "../context/Engine";
import { Box } from "@mui/material";

export default class QuerySummary extends React.Component {
  private headlessQuerySummary: QuerySummaryType;
  state: QuerySummaryState;

  constructor(props: any) {
    super(props);

    this.headlessQuerySummary = buildQuerySummary(headlessEngine);

    this.state = this.headlessQuerySummary.state;
  }

  componentDidMount() {
    this.headlessQuerySummary.subscribe(() => this.updateState());
  }

  updateState() {
    this.setState(this.headlessQuerySummary.state);
  }

  renderNoResults() {
    return <Box mt={5}>No results</Box>;
  }

  renderBold(input: string) {
    return (
      <Box component="span">
        <strong>{input}</strong>
      </Box>
    );
  }

  renderRange() {
    return this.renderBold(
      ` ${this.state.firstResult}-${this.state.lastResult}`
    );
  }

  renderTotal() {
    return (
      <Box component="span">
        {" "}
        of {this.renderBold(this.state.total.toString())}
      </Box>
    );
  }

  renderQuery() {
    if (this.state.hasQuery) {
      return (
        <Box component="span"> for {this.renderBold(this.state.query)}</Box>
      );
    }
  }

  renderDuration() {
    return ` in ${this.state.durationInSeconds} seconds`;
  }

  renderHasResults() {
    return (
      <Box>
        Results{this.renderRange()}
        {this.renderTotal()}
        {this.renderQuery()}
        {this.renderDuration()}
      </Box>
    );
  }

  render() {
    if (!this.state.hasResults) {
      return this.renderNoResults();
    }
    return this.renderHasResults();
  }
}
