import { FC } from 'react';
import {
  registerUniformComponent,
  ComponentProps,
} from '@uniformdev/canvas-react';
import { useSearch } from '@uniformdev/search/react';

type SearchTotalAmountProps = ComponentProps<{
  textTemplate?: string;
}>;

const SearchTotalAmount: FC<SearchTotalAmountProps> = ({
  textTemplate,
}) => {
  const { results, formatResultsSummary } = useSearch();

  if (!results.total) {
    return null;
  }

  return <div className="text-sm text-mono-500">{formatResultsSummary(textTemplate || '')}</div>;
};

registerUniformComponent({
  type: 'searchTotalAmount',
  component: SearchTotalAmount,
});

export default SearchTotalAmount;
