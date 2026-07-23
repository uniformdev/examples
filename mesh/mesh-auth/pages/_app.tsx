import '../styles/globals.css';

import { MeshApp } from '@uniformdev/mesh-sdk-react';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MeshApp>
      <Component {...pageProps} />
    </MeshApp>
  );
}

export default MyApp;
