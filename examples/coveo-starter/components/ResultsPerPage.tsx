import {useEffect, useMemo, useState} from "react";
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


const ResultsPerPage = ({resultsPerPage}:{resultsPerPage: string}) => {
  const arrayResults = resultsPerPage.split(',');
  const headlessResultsPerPage = useMemo(()=>buildResultsPerPage(headlessEngine, { initialState: { numberOfResults: Number(arrayResults[0]) } }), []);
  const [state, setState] = useState(headlessResultsPerPage.state);

  useEffect(() => {
    const updateState = () => {
      setState(headlessResultsPerPage.state);
    };
    headlessResultsPerPage.subscribe(updateState);
  }, []);

  return (
      <FormControl component="fieldset">
        <Typography>Results per page</Typography>
        <RadioGroup
            row
            name="test"
            defaultValue={state.numberOfResults.toString()}
            onChange={(event) => {
              headlessResultsPerPage.set(parseInt(event.target.value, 10));
            }}
        >
            {resultsPerPage.split(',').map((value, index) => <FormControlLabel key={index} value={value} control={<Radio />} label={value} />)}
        </RadioGroup>
      </FormControl>
  );
};

export default ResultsPerPage;
