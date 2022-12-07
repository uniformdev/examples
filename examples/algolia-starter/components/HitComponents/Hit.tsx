import React from 'react';

type HitComponent = {
  objectID: string;
  [name: string]: any;
};

const Hit = ({ hit }: { hit: HitComponent }) => {
  const { objectID = 'unknown', ...properties } = hit || {};

  return (
    <div>
      <h3>{`objectID: ${objectID}`}</h3>
      <p style={{ wordBreak: 'break-all' }}>{JSON.stringify(properties)}</p>
    </div>
  );
};

export default Hit;
