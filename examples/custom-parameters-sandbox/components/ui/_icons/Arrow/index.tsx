import { FC, SVGProps } from 'react';

const Arrow: FC<SVGProps<SVGElement>> = ({ width = 20, height = 20, stroke = 'currentColor' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 23 25" stroke={stroke}>
    <path d="M0 12.756L20.4878 12.756" stroke="inherit" strokeWidth="3" />
    <path fill="transparent" d="M10.8823 23L20.881 12.4956L10.8823 2" stroke="inherit" strokeWidth="3" />
  </svg>
);

export default Arrow;
