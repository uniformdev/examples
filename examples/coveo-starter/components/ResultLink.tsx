import {
  buildInteractiveResult,
  InteractiveResult,
  Result,
} from "@coveo/headless";
import { Link } from "@mui/material";
import React from "react";
import headlessEngine from "../context/Engine";

interface ResultLinkProps {
  result: Result;
}

const ResultLink: React.FC<ResultLinkProps> = (props) => {
  const { result } = props;
  const interactiveResult = buildInteractiveResult(headlessEngine, {
    options: { result },
  });

  const handleClick = () => {
    interactiveResult.select();
  };

  return (
      <Link href={result.clickUri} target="_blank" onClick={handleClick}>
        {result.title}
      </Link>
  );
};

export default ResultLink;
