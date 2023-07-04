import React from "react";
import {
  buildResultsPerPage,
  ResultsPerPage as ResultsPerPageType,
  ResultsPerPageState,
} from "@coveo/headless";
import headlessEngine from "../context/Engine";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

export default class ResultsPerPage extends React.Component {
  private headlessResultsPerPage: ResultsPerPageType;
  state: ResultsPerPageState;

  constructor(props: any) {
    super(props);

    this.headlessResultsPerPage = buildResultsPerPage(headlessEngine, {
      initialState: { numberOfResults: 9 },
    });

    this.state = this.headlessResultsPerPage.state;
  }

  componentDidMount() {
    this.headlessResultsPerPage.subscribe(() => this.updateState());
  }

  updateState() {
    this.setState(this.headlessResultsPerPage.state);
  }

  render() {
    return (
      <FormControl component="fieldset">
        <Typography>Results per page</Typography>
        <RadioGroup
          row
          name="test"
          defaultValue="9"
          onChange={(event) => {
            this.headlessResultsPerPage.set(parseInt(event.target.value, 10));
          }}
        >
          <FormControlLabel value="9" control={<Radio />} label="9" />
          <FormControlLabel value="27" control={<Radio />} label="27" />
          <FormControlLabel value="60" control={<Radio />} label="60" />
        </RadioGroup>
      </FormControl>
    );
  }
}
