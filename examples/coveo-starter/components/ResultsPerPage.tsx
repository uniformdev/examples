import { FC, useEffect } from "react";
import { buildResultsPerPage } from "@coveo/headless";
import { FormControl, Typography } from "@mui/material";
import headlessEngine from "../context/Engine";

interface ResultsPerPageProps {
  resultsPerPage: string;
}

//Coveo Result Per Page docs https://docs.coveo.com/en/headless/latest/reference/search/controllers/results-per-page/

const ResultsPerPage: FC<ResultsPerPageProps> = ({ resultsPerPage }) => {
  useEffect(() => {
    buildResultsPerPage(headlessEngine, {
      initialState: { numberOfResults: Number(resultsPerPage) },
    });
  }, [resultsPerPage]);

  return (
    <FormControl component="fieldset">
      <Typography>{`Results per page: ${resultsPerPage}`}</Typography>
    </FormControl>
  );
};

export default ResultsPerPage;
