import React from 'react';
import { Index } from 'react-instantsearch-hooks-web';
import componentResolver from '@/components/componentResolver';
import { ComponentProps, Slot } from '@uniformdev/canvas-react';
import { getDefaultIndexName } from '../context/CanvasAlgoliaProvider';
import ErrorPropertyCallout from '@/components/ErrorPropertyCallout';

type CanvasIndexProps = {
  indexParams?: {
    indexProps?: {
      indexName?: string;
      indexId?: string;
    };
  };
};

const CanvasIndex = (componentProps: ComponentProps<CanvasIndexProps>) => {
  const { indexProps } = componentProps?.indexParams || {};
  const indexName = indexProps?.indexName || getDefaultIndexName();

  if (!indexName) {
    return <ErrorPropertyCallout title="Property 'indexName' was not defined for Index component." />;
  }

  return (
    <div className="index">
      <Index {...indexProps} indexName={indexName}>
        <Slot name="widgets" resolveRenderer={componentResolver} />
      </Index>
    </div>
  );
};

export default CanvasIndex;
