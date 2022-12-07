import React from 'react';
import { RefinementList } from 'react-instantsearch-hooks-web';
import { ComponentProps } from '@uniformdev/canvas-react';
import ErrorPropertyCallout from '@/components/ErrorPropertyCallout';

type CanvasRefinementListProps = {
  refinementListParams?: {
    refinementListProps?: {
      allowedIndex?: string;
      attribute: string;
      operator: 'and' | 'or';
      limit?: number;
      showMore?: boolean;
      showMoreLimit?: number;
      searchable?: boolean;
      searchablePlaceholder?: string;
      escapeFacetValues?: boolean;
    };
  };
};

const CanvasRefinementList = ({ refinementListParams }: ComponentProps<CanvasRefinementListProps>) => {
  const { refinementListProps } = refinementListParams || {};

  if (!refinementListProps?.attribute) {
    return (
      <ErrorPropertyCallout title="Property 'attribute' was not defined for RefinementList component." />
    );
  }

  const { allowedIndex, ...props } = refinementListProps;

  return (
    <div className="refinementList">
      <span>{refinementListProps.attribute}</span>
      <RefinementList {...props} />
    </div>
  );
};

export default CanvasRefinementList;
