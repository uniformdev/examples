import { FC, useEffect } from "react";
import { buildResultsPerPage } from "@coveo/headless";
import headlessEngine from "../context/Engine";
import { FormControl, Typography } from "@mui/material";

interface ResultsPerPageProps {
  resultsPerPage: string;
}

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
