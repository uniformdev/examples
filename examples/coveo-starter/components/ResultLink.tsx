import { FC, useMemo } from "react";
import { buildInteractiveResult, Result } from "@coveo/headless";
import { Link } from "@mui/material";
import headlessEngine from "../context/Engine";

interface ResultLinkProps {
  result: Result;
}

const ResultLink: FC<ResultLinkProps> = ({ result }) => {
  const interactiveResult = useMemo(
    () =>
      buildInteractiveResult(headlessEngine, {
        options: { result },
      }),
    [headlessEngine, result]
  );

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
