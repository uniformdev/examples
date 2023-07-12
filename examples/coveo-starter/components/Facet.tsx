import { FC, SyntheticEvent, useEffect, useMemo, useState } from "react";
import {
  FacetState,
  buildFacet,
  FacetValue,
  buildSearchBox,
} from "@coveo/headless";
import {
  ComponentProps,
  registerUniformComponent,
} from "@uniformdev/canvas-react";
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

//Coveo Facet docs https://docs.coveo.com/en/headless/latest/reference/search/controllers/facet/

const Facet: FC<FacetProps> = ({ field }) => {
  const facetsBuilder = useMemo(
    () =>
      buildFacet(headlessEngine, {
        options: {
          numberOfValues: 5,
          field,
        },
      }),
    [field, headlessEngine]
  );

  const [state, setState] = useState<FacetState & { inputValue?: string }>({
    ...facetsBuilder.state,
    inputValue: "",
  });

  const headlessSearchBox = useMemo(
    () => buildSearchBox(headlessEngine),
    [headlessEngine]
  );

  useEffect(() => {
    const updateState = () => {
      setState(facetsBuilder.state);
    };
    facetsBuilder.subscribe(updateState);

    if(!headlessSearchBox.state.isLoading) {
      headlessSearchBox.submit();
    }
  }, [field]);

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
    if(!state.values.length && !headlessSearchBox.state.isLoading) {
      return <Typography>Values not found</Typography>;
    }
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

type FacetConfigurationProps = ComponentProps<{
  facet?: {
    facetConfiguration?: {
      field?: string;
      isExpanded?: boolean;
      facetTitle?: string;
    };
  };
}>;

const FacetConfiguration: FC<FacetConfigurationProps> = ({ facet }) => {
  const {
    field = "",
    isExpanded = false,
    facetTitle = "",
  } = facet?.facetConfiguration || {};

  const [expand, setExpand] = useState<boolean>(isExpanded);

  useEffect(() => setExpand(isExpanded), [isExpanded]);

  const changeExpanded = () => {
    setExpand((prevState) => !prevState);
  };

  if (!field) {
    return <Typography>Facet field must be provided</Typography>;
  }

  return (
    <Box mt={1} mr={3} p={1}>
      <Accordion expanded={expand} onChange={changeExpanded}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>{facetTitle || capitalizeFirstLetter(field)}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Facet key={field} field={field} />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

registerUniformComponent({
  type: "coveo-facet",
  component: FacetConfiguration,
});

export default FacetConfiguration;
