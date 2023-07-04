import React from "react";
import { buildPager, Pager as PagerType, PagerState } from "@coveo/headless";
import headlessEngine from "../context/Engine";
import { Box, Pagination, Typography } from "@mui/material";

export default class Pager extends React.Component {
  private headlessPager: PagerType;
  state: PagerState;

  constructor(props: any) {
    super(props);

    this.headlessPager = buildPager(headlessEngine, {
      options: { numberOfPages: 3 },
    });

    this.state = this.headlessPager.state;
  }

  componentDidMount() {
    this.headlessPager.subscribe(() => this.updateState());
  }

  updateState() {
    this.setState(this.headlessPager.state);
  }

  setPage(pageNumber: number) {
    this.headlessPager.selectPage(pageNumber);
  }

  get page() {
    return this.headlessPager.state.currentPage;
  }

  get count() {
    return this.headlessPager.state.maxPage;
  }

  render() {
    return (
      <Box>
        <Typography gutterBottom>Current page</Typography>
        <Pagination
          page={this.page}
          count={this.count}
          onChange={(e, page) => this.setPage(page)}
          variant="outlined"
          color="primary"
        />
      </Box>
    );
  }
}
