import React from 'react';

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import { MeshApp } from '@uniformdev/mesh-sdk-react';
import { IconsProvider } from '@uniformdev/design-system';

import '../styles/global.css';

const PAGE_WITHOUT_MESH_LOCATION = ['/_error', '/'];

const App = ({ Component, pageProps }: AppProps) => {
  const { pathname } = useRouter();

  if (PAGE_WITHOUT_MESH_LOCATION.includes(pathname)) {
    return <Component {...pageProps} />;
  }

  return (
    <MeshApp>
      <IconsProvider>
        <Component {...pageProps} />
      </IconsProvider>
    </MeshApp>
  );
};

export default App;
