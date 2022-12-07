import React from 'react';
import { Pagination } from 'react-instantsearch-hooks-web';
import { ComponentProps } from '@uniformdev/canvas-react';

type CanvasPaginationProps = {
  paginationParams?: {
    paginationProps?: {
      totalPages?: number;
      padding?: number;
      showFirst?: boolean;
      showPrevious?: boolean;
      showNext?: boolean;
      showLast?: boolean;
    };
  };
};

const CanvasPagination = ({ paginationParams }: ComponentProps<CanvasPaginationProps>) => {
  const { paginationProps } = paginationParams || {};
  return (
    <div className="pagination">
      <Pagination {...paginationProps} />
    </div>
  );
};

export default CanvasPagination;
