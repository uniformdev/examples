import React from 'react';

const ErrorPropertyCallout = ({ title }: { title?: string }) => (
  <div className="callout">
    <span className="callout-title">{title}</span>
    <span>
      It appears the Algolia composition is not configured. Please visit composition Algolia to provide
      properties for components.
    </span>
  </div>
);

export default ErrorPropertyCallout;
