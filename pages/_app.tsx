import { UniformContext } from '@uniformdev/context-react';
import { type UniformAppProps } from '@uniformdev/context-next';
import { createUniformContext } from '../uniformContext';

import '../styles/style.css';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps, serverUniformContext }: UniformAppProps) {
  return (
    <UniformContext context={serverUniformContext || createUniformContext()}>
      <div className="leading-normal tracking-normal text-white gradient">
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </div>
    </UniformContext>
  );
}

export default MyApp;
