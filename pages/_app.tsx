import { UniformContext } from '@uniformdev/context-react';
import { type UniformAppProps } from '@uniformdev/context-next';
import { createUniformContext } from '../uniformContext';

import '../styles/style.css';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import { EmbeddedContextDevTools } from "@uniformdev/context-devtools";
import '@uniformdev/context-devtools/style';

function MyApp({ Component, pageProps, serverUniformContext }: UniformAppProps) {
  return (
    <UniformContext context={serverUniformContext || createUniformContext()}>
      <div className="leading-normal tracking-normal text-white gradient">
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </div>
      <EmbeddedContextDevTools
        initialSettings={{
          apiHost: "https://canary.uniform.app",
          apiKey:
            "",
          projectId: "",
        }}
      />
    </UniformContext>
  );
}

export default MyApp;
