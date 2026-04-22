import '../styles/globals.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MeshApp } from '@uniformdev/mesh-sdk-react';
import type { AppProps } from 'next/app';
import { useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <MeshApp>
        <Component {...pageProps} />
      </MeshApp>
    </QueryClientProvider>
  );
}

export default MyApp;
