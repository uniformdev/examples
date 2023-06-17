import React from "react";
import { ComponentProps, UniformSlot } from "@uniformdev/canvas-react";
import componentResolver from "./componentResolver";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch-hooks-web";
import getConfig from "next/config";
import CanvasAlgoliaProvider from "../context/CanvasAlgoliaProvider";
import ErrorPropertyCallout from "@/components/ErrorPropertyCallout";
const {
  publicRuntimeConfig: { applicationId, algoliaApiKey },
} = getConfig();

const searchClient = algoliasearch(applicationId, algoliaApiKey);

type CanvasInstantSearchProps = {
  title?: string;
  instantSearchParams?: {
    instantSearchProps?: {
      indexName?: string;
      stalledSearchDelay?: number;
    };
  };
};

const CanvasInstantSearch = ({
  instantSearchParams,
  title,
}: ComponentProps<CanvasInstantSearchProps>) => {
  const { instantSearchProps } = instantSearchParams || {};

  if (!instantSearchProps?.indexName) {
    return (
      <ErrorPropertyCallout title="Property 'indexName' was not defined for InstantSearch component." />
    );
  }

  return (
    <CanvasAlgoliaProvider defaultIndexName={instantSearchProps.indexName}>
      {Boolean(title) && <h2>{title}</h2>}
      <InstantSearch
        {...instantSearchProps}
        indexName={instantSearchProps.indexName}
        searchClient={searchClient}
      >
        <UniformSlot name="widgets" resolveRenderer={componentResolver} />
      </InstantSearch>
    </CanvasAlgoliaProvider>
  );
};

export default CanvasInstantSearch;
