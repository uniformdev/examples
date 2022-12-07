import type { AppProps } from 'next/app';
import '../styles/styles.css';
import 'instantsearch.css/themes/algolia.css';

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
