import React from "react";
import ResultLink from "./ResultLink";
import {
  buildResultList,
  ResultList as ResultListType,
  Result,
  ResultListState,
} from "@coveo/headless";
import headlessEngine from "../context/Engine";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Rating,
  Typography,
} from "@mui/material";

export default class ResultList extends React.Component {
  private headlessResultList: ResultListType;
  state: ResultListState;

  constructor(props: any) {
    super(props);

    this.headlessResultList = buildResultList(headlessEngine, {
      options: {
        fieldsToInclude: ["ec_image", "ec_price", "ec_rating"],
      },
    });

    this.state = this.headlessResultList.state;
  }

  componentDidMount() {
    this.headlessResultList.subscribe(() => this.updateState());
  }

  updateState() {
    this.setState(this.headlessResultList.state);
  }

  componentWillUnmount() {
    this.headlessResultList.subscribe(() => {});
  }

  render() {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    return (
      <Grid container spacing={2}>
        {this.state.results.map((result: Result) => {
          return (
            <Grid
              item
              xs={4}
              display="grid"
              alignItems="stretch"
              key={result.uniqueId}
            >
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={`${result.raw.ec_image!}`}
                />
                <CardContent>
                  <Typography variant="h5">
                    {<ResultLink result={result} />}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {result.excerpt}
                  </Typography>
                  <Typography variant="h6" color="text.primary">
                    {formatter.format(result.raw.ec_price as number)}
                  </Typography>
                  <Rating
                    value={Math.round(result.raw.ec_rating as number)}
                    readOnly
                  />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  }
}
