import { Heading } from '@uniformdev/mesh-sdk-react';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <div style={{ padding: '1em' }}>
      <Heading level={4}>JSON Rules Engine personalization integration</Heading>
      <p>
        This integration registers a custom personalization selection algorithm named{' '}
        <code>json-rules-engine</code> on the Uniform canvas. Authors use it to define
        variant-matching rules based on visitor facts (e.g. appointment dates, segment IDs).
      </p>
      <p>The integration exposes two locations:</p>
      <ul>
        <li>
          <code>/rule-editor</code> — the criteria editor shown on each personalized variant.
        </li>
        <li>
          <code>/settings</code> — the integration settings page where editors configure the list
          of available facts.
        </li>
      </ul>
    </div>
  );
};

export default Home;
