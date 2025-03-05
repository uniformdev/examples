import React from 'react';
import { Callout } from '@uniformdev/mesh-sdk-react';

interface ErrorCalloutProps {
  error: string;
}

// ErrorCallout component is used to display an error message in a callout.
export const ErrorCallout: React.FC<ErrorCalloutProps> = ({ error }) => {
  return (
    <Callout type="error">
      <p>An error occurred: {error}</p>
    </Callout>
  );
};
