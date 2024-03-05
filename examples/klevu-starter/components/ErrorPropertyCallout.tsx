import React from 'react';

const ErrorPropertyCallout = ({ title, text }: { title?: string, text:string }) => (
  <div className="callout">
    <span className="callout-title">{title}</span>
    <span>
      {text}
    </span>
  </div>
);

export default ErrorPropertyCallout;
