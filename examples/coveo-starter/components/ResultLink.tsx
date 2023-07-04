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

export default class ResultLink extends React.Component<ResultLinkProps, {}> {
  private interactiveResult: InteractiveResult;
  private result: Result;

  constructor(props: ResultLinkProps) {
    super(props);
    this.result = props.result;
    this.interactiveResult = buildInteractiveResult(headlessEngine, {
      options: { result: props.result },
    });
  }

  render() {
    return (
      <Link
        href={this.result.clickUri}
        target="_blank"
        onClick={() => this.interactiveResult.select()}
      >
        {this.result.title}
      </Link>
    );
  }
}
