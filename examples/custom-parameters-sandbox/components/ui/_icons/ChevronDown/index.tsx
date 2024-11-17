import { FC, SVGProps } from 'react';

const ChevronDown: FC<SVGProps<SVGElement>> = ({ width = 23, height = 23, fill = 'currentColor' }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
    <path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z" />
  </svg>
);

export default ChevronDown;
