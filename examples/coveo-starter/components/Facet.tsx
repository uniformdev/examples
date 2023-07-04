import React from "react";
import {
  Facet as FacetType,
  FacetState,
  buildFacet,
  FacetValue,
} from "@coveo/headless";
import headlessEngine from "../context/Engine";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  TextField,
} from "@mui/material";

export interface IFacetProps {
  title: string;
  field: string;
}

export default class Facet extends React.Component<IFacetProps, {}> {
  private headlessFacet: FacetType;
  state: FacetState & {
    inputValue: "";
  };

  constructor(props: any) {
    super(props);

    this.headlessFacet = buildFacet(headlessEngine, {
      options: {
        numberOfValues: 5,
        field: this.props.field,
      },
    });

    this.state = {
      ...this.headlessFacet.state,
      inputValue: "",
    };
  }
  componentDidMount() {
    this.headlessFacet.subscribe(() => this.updateState());
  }

  componentWillUnmount() {
    this.headlessFacet.subscribe(() => {});
  }

  updateState() {
    this.setState(this.headlessFacet.state);
  }

  toggleSelect(value: FacetValue) {
    this.headlessFacet.toggleSelect(value);
  }

  showMore() {
    this.headlessFacet.showMoreValues();
  }

  showLess() {
    this.headlessFacet.showLessValues();
  }

  getFacetValues() {
    return this.state.values.map((value: FacetValue) => (
      <Box mb={1} key={value.value}>
        <FormControlLabel
          label={`${value.value} (${value.numberOfResults})`}
          control={
            <Checkbox
              checked={this.headlessFacet.isValueSelected(value)}
              color="secondary"
              onChange={(event) => this.toggleSelect(value)}
            />
          }
        />
      </Box>
    ));
  }

  getFacetSearch() {
    return (
      <Autocomplete
        inputValue={this.state.inputValue}
        onInputChange={(_, newInputValue) => {
          this.setState({ inputValue: newInputValue });
          this.headlessFacet.facetSearch.updateText(newInputValue);
          this.headlessFacet.facetSearch.search();
        }}
        onChange={(_, chosenValue: any) => {
          if (chosenValue != null) {
            this.headlessFacet.facetSearch.select(chosenValue);
          }
          this.setState({ inputValue: "" });
        }}
        options={this.state.facetSearch.values}
        getOptionLabel={(option: any) => option.displayValue}
        blurOnSelect
        clearOnBlur
        style={{ width: "auto" }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search"
            variant="outlined"
            size="small"
          />
        )}
      />
    );
  }

  getShowMore() {
    return (
      <Button
        onClick={() => {
          this.showMore();
        }}
      >
        Show More
      </Button>
    );
  }

  getShowLess() {
    return (
      <Button
        onClick={() => {
          this.showLess();
        }}
      >
        Show Less
      </Button>
    );
  }

  render() {
    return (
      <Box mt={5} mr={3} p={1}>
        <FormControl component="fieldset">
          <Box mb={1}>
            <FormLabel component="legend" color="primary">
              {this.props.title}
            </FormLabel>
          </Box>
          <FormGroup>{this.getFacetValues()}</FormGroup>
        </FormControl>
        {this.state.canShowMoreValues && this.getFacetSearch()}
        {this.state.canShowMoreValues && this.getShowMore()}
        {this.state.canShowLessValues && this.getShowLess()}
      </Box>
    );
  }
}
