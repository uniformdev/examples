import React, {FC, useEffect, useMemo, useState} from "react";
import {
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
    FormLabel, Grid,
    TextField,
} from "@mui/material";
import {capitalizeFirstLetter} from "../utils";


interface FacetProps {
    title: string;
    field: string;
}

const Facet: FC<FacetProps> = ({field, title}) => {
  const facetsBuilder = useMemo(() => buildFacet(headlessEngine, {
      options: {
          numberOfValues: 5,
          hasBreadcrumbs: true,
          field,
      },
  }), []);

  const [state, setState] = useState<FacetState & { inputValue?: string }>({
    ...facetsBuilder.state,
    inputValue: '',
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
                    onChange={(event) => toggleSelect(value)}
                />
              }
          />
        </Box>
    ));
  };

  const getFacetSearch = () => {
    return (
        <Autocomplete
            inputValue={state.inputValue}
            onInputChange={(_, newInputValue) => {
              setState((prevState) => ({ ...prevState, inputValue: newInputValue }));
                facetsBuilder.facetSearch.updateText(newInputValue);
                facetsBuilder.facetSearch.search();
            }}
            onChange={(_, chosenValue: any) => {
              if (chosenValue != null) {
                  facetsBuilder.facetSearch.select(chosenValue);
              }
              setState((prevState) => ({ ...prevState, inputValue: '' }));
            }}
            options={state.facetSearch.values}
            getOptionLabel={(option: any) => option.displayValue}
            blurOnSelect
            clearOnBlur
            style={{ width: 'auto' }}
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

    const getShowMore = () => (
        <Button onClick={showMore}>
            Show More
        </Button>
    );

    const getShowLess = () => (
        <Button onClick={showLess}>
            Show Less
        </Button>
    );

    return (
      <Box mt={5} mr={3} p={1}>
        <FormControl component="fieldset">
          <Box mb={1}>
            <FormLabel component="legend" color="primary">
                {title}
            </FormLabel>
          </Box>
          <FormGroup>{getFacetValues()}</FormGroup>
        </FormControl>
        {state.canShowMoreValues && getFacetSearch()}
        {state.canShowMoreValues && getShowMore()}
        {state.canShowLessValues && getShowLess()}
      </Box>
    );
}

interface FacetsConfigurationProps {
    facet: {
        facetConfiguration: {
            fields: string[];
        }
    }
}

const FacetsConfiguration: FC<FacetsConfigurationProps> = ({facet}) => {
    const {fields} = facet.facetConfiguration;

    return (
        <Grid item xs={4}>
            {fields.map((field)=><Facet key={field} title={capitalizeFirstLetter(field)} field={field} />)}
        </Grid>
    );
}

export default FacetsConfiguration;

