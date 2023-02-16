import React from 'react';
import { Configure, Pagination } from 'react-instantsearch-hooks-web';
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
  pageSize?: number;
};

const CanvasPagination = ({ paginationParams, pageSize }: ComponentProps<CanvasPaginationProps>) => {
  const { paginationProps } = paginationParams || {};
  return (
    <>
      <Configure hitsPerPage={pageSize}/>
      <div className="pagination">
        <Pagination {...paginationProps} />
      </div>
    </>
  );
};

export default CanvasPagination;
