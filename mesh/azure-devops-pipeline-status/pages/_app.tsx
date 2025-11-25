import '../styles/globals.css';

import { MeshApp } from '@uniformdev/mesh-sdk-react';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // The <MeshApp> component must wrap the entire app to provide Uniform Mesh SDK services
    <MeshApp>
      <Component {...pageProps} />
    </MeshApp>
  );
}

export default MyApp;
