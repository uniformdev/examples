import {FC, useEffect, useMemo, useState} from "react";
import { buildSearchBox } from "@coveo/headless";
import headlessEngine from "../context/Engine";
import { Autocomplete, IconButton, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";

interface SearchBoxProps {
    searchBox: {
        searchBox: {
            placeholder: string;
        }
    }
}

const SearchBox: FC<SearchBoxProps> = ({searchBox}) => {
  const {placeholder} = searchBox?.searchBox || {};

  const headlessSearchBox = useMemo(()=>buildSearchBox(headlessEngine, {
      options: {
          highlightOptions: {
              notMatchDelimiters: {
                  open: '<strong>',
                  close: '</strong>',
              },
              correctionDelimiters: {
                  open: '<i>',
                  close: '</i>',
              },
          },
      },
  }), []);

  const [state, setState] = useState(headlessSearchBox.state);

  useEffect(() => {
    const updateState = () => {
      setState(headlessSearchBox.state);
    };
    headlessSearchBox.subscribe(updateState);
  }, []);

  return (
      <Autocomplete
          freeSolo
          disableClearable
          inputValue={state.value}
          onInputChange={(_, newInputValue) => {
            headlessSearchBox.updateText(newInputValue);
          }}
          onChange={() => {
            headlessSearchBox.submit();
          }}
          options={state.suggestions.map((s) => s.rawValue)}
          renderInput={(params) => (
              <TextField
                  {...params}
                  label={placeholder}
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                    endAdornment: (
                        <IconButton
                            type="button"
                            sx={{ p: '10px' }}
                            aria-label="search"
                            onClick={() => headlessSearchBox.submit()}
                        >
                          <Search />
                        </IconButton>
                    ),
                  }}
              />
          )}
      />
  );
};
export default SearchBox;
