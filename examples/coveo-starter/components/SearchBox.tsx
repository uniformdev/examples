import { FC, SyntheticEvent, useEffect, useMemo, useState } from "react";
import {
  registerUniformComponent,
  ComponentProps,
} from "@uniformdev/canvas-react";
import { buildSearchBox } from "@coveo/headless";
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  IconButton,
  TextField,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import headlessEngine from "../context/Engine";

type SearchBoxProps = ComponentProps<{
  placeholder?: string;
  enableQuerySyntax?: boolean;
  clearFilters?: boolean;
}>;

//Coveo Search Box docs https://docs.coveo.com/en/headless/latest/reference/search/controllers/search-box/

const SearchBox: FC<SearchBoxProps> = ({
  placeholder = "",
  enableQuerySyntax = false,
  clearFilters = false,
}) => {
  const headlessSearchBox = useMemo(
    () =>
      buildSearchBox(headlessEngine, {
        options: {
          highlightOptions: {
            notMatchDelimiters: {
              open: "<strong>",
              close: "</strong>",
            },
            correctionDelimiters: {
              open: "<i>",
              close: "</i>",
            },
          },
          clearFilters,
          enableQuerySyntax,
        },
      }),
    [headlessEngine]
  );

  const [state, setState] = useState(headlessSearchBox.state);

  const handleSubmit = () => {
    headlessSearchBox.submit();
  };

  useEffect(() => {
    const updateState = () => {
      setState(headlessSearchBox.state);
    };

    if (!headlessSearchBox.state.isLoading) {
      headlessSearchBox.subscribe(updateState);
      handleSubmit();
    }
  }, []);

  const handleInputChange = (event: SyntheticEvent, newInputValue: string) => {
    headlessSearchBox.updateText(newInputValue);
  };

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      label={placeholder || "Search"}
      InputProps={{
        ...params.InputProps,
        type: "search",
        endAdornment: (
          <IconButton
            type="button"
            sx={{ p: "10px" }}
            aria-label="search"
            onClick={handleSubmit}
          >
            <Search />
          </IconButton>
        ),
      }}
    />
  );

  return (
    <Box my={1}>
      <Autocomplete
        freeSolo
        disableClearable
        inputValue={state.value}
        onInputChange={handleInputChange}
        onChange={handleSubmit}
        options={state.suggestions.map((s) => s.rawValue)}
        renderInput={renderInput}
      />
    </Box>
  );
};

registerUniformComponent({
  type: "coveo-searchBox",
  component: SearchBox,
});

export default SearchBox;
