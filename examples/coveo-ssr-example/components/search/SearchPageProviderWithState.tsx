import { PropsWithChildren } from 'react';
import { connection } from 'next/server';
import { SearchPageProvider } from '@/components/search/SearchPageProvider';
import { fetchStaticState } from '../../lib/coveo/engine-definition';

export async function SearchPageProviderWithState({
  pipeline,
  children,
}: PropsWithChildren<{ pipeline: string | undefined }>) {
  // await connection();
  const staticState = await fetchStaticState(pipeline);
  return (
    <SearchPageProvider staticState={staticState} pipeline={pipeline}>
      {children}
    </SearchPageProvider>
  );
}
