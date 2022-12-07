import React from 'react';
import { SearchBox } from 'react-instantsearch-hooks-web';
import { ComponentProps } from '@uniformdev/canvas-react';

type CanvasSearchBoxProps = {
  searchBoxParams?: {
    searchBoxProps?: {
      placeholder?: string;
      searchAsYouType?: boolean;
    };
  };
};

const CanvasSearchBox = ({ searchBoxParams }: ComponentProps<CanvasSearchBoxProps>) => {
  const { searchBoxProps } = searchBoxParams || {};
  return (
    <div className="searchBox">
      <SearchBox {...searchBoxProps} />
    </div>
  );
};

export default CanvasSearchBox;
