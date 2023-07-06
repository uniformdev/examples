import { FC, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { FacetState, buildFacet, FacetValue } from "@coveo/headless";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import headlessEngine from "../context/Engine";
import { capitalizeFirstLetter } from "../utils";

interface FacetProps {
  field: string;
}

const Facet: FC<FacetProps> = ({ field }) => {
  const facetsBuilder = useMemo(
    () =>
      buildFacet(headlessEngine, {
        options: {
          numberOfValues: 5,
          hasBreadcrumbs: true,
          field,
        },
      }),
    [field, headlessEngine]
  );

  const [state, setState] = useState<FacetState & { inputValue?: string }>({
    ...facetsBuilder.state,
    inputValue: "",
  });

  useEffect(() => {
    const updateState = () => {
      setState(facetsBuilder.state);
    };
    facetsBuilder.subscribe(updateState);
  }, []);

  const toggleSelect = (value: FacetValue) => {
    facetsBuilder.toggleSelect(value);
  };

  const showMore = () => {
    facetsBuilder.showMoreValues();
  };

  const showLess = () => {
    facetsBuilder.showLessValues();
  };

  const getFacetValues = () => {
    return state.values.map((value: FacetValue) => (
      <Box mb={1} key={value.value}>
        <FormControlLabel
          label={`${value.value} (${value.numberOfResults})`}
          control={
            <Checkbox
              checked={facetsBuilder.isValueSelected(value) || false}
              color="secondary"
              onChange={() => toggleSelect(value)}
            />
          }
        />
      </Box>
    ));
  };

  const handleSearch = (_: SyntheticEvent, chosenValue: any) => {
    if (chosenValue != null) {
      facetsBuilder.facetSearch.select(chosenValue);
    }
    setState((prevState) => ({ ...prevState, inputValue: "" }));
  };

  const getFacetSearch = () => {
    return (
      <Autocomplete
        inputValue={state.inputValue}
        onInputChange={(_, newInputValue) => {
          setState((prevState) => ({
            ...prevState,
            inputValue: newInputValue,
          }));
          facetsBuilder.facetSearch.updateText(newInputValue);
          facetsBuilder.facetSearch.search();
        }}
        onChange={handleSearch}
        options={state.facetSearch.values}
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
  };

  const getShowMore = () => <Button onClick={showMore}>Show More</Button>;

  const getShowLess = () => <Button onClick={showLess}>Show Less</Button>;

  return (
    <>
      <FormControl component="fieldset">
        <FormGroup>{getFacetValues()}</FormGroup>
      </FormControl>
      {state.canShowMoreValues && getFacetSearch()}
      {state.canShowMoreValues && getShowMore()}
      {state.canShowLessValues && getShowLess()}
    </>
  );
};

interface FacetsConfigurationProps {
  facet?: {
    facetConfiguration?: {
      field?: string;
      isExpanded?: boolean;
    };
  };
}

const FacetsConfiguration: FC<FacetsConfigurationProps> = ({ facet }) => {
  const { field = "", isExpanded = false } = facet?.facetConfiguration || {};

  const [expand, setExpand] = useState<boolean>(isExpanded);

  useEffect(() => setExpand(isExpanded), [isExpanded]);

  const changeExpanded = () => {
    setExpand((prevState) => !prevState);
  };

  if (!field) {
    return <></>;
  }

  return (
    <Box mt={1} mr={3} p={1}>
      <Accordion expanded={expand} onChange={changeExpanded}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>{capitalizeFirstLetter(field)}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Facet key={field} field={field} />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FacetsConfiguration;
