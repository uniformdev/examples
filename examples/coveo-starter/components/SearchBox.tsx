import {
  FC,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { buildSearchBox } from "@coveo/headless";
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  IconButton,
  TextField,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import headlessEngine from "../context/Engine";

interface SearchBoxProps {
  searchBox: {
    searchBox: {
      placeholder: string;
    };
  };
}

const SearchBox: FC<SearchBoxProps> = ({ searchBox }) => {
  const { placeholder } = searchBox?.searchBox || {};

  const headlessSearchBox = buildSearchBox(headlessEngine, {
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
    },
  });

  const [state, setState] = useState(headlessSearchBox.state);

  const handleSubmit = useCallback(() => {
    headlessSearchBox.submit();
  }, [headlessSearchBox]);

  useEffect(() => {
    const updateState = () => {
      setState(headlessSearchBox.state);
    };
    headlessSearchBox.subscribe(updateState);
    handleSubmit();
  }, []);

  const handleInputChange = (event: SyntheticEvent, newInputValue: string) => {
    headlessSearchBox.updateText(newInputValue);
  };

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      label={placeholder}
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
    <Autocomplete
      freeSolo
      disableClearable
      inputValue={state.value}
      onInputChange={handleInputChange}
      onChange={handleSubmit}
      options={state.suggestions.map((s) => s.rawValue)}
      renderInput={renderInput}
    />
  );
};
export default SearchBox;
