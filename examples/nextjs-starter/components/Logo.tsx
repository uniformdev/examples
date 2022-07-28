import React from "react";

interface LogoProps {
  width?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ width, className }: LogoProps) => {
  return (
    <svg
      width={width}
      height={width * 0.317}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 555.2 141.4"
      className={className}
    >
      <path
        d="M40.82 0L0 23.57v47.14l40.82-23.57 40.83-23.57z"
        fill="#83c6e1"
      />
      <path
        d="M40.82 94.28V47.14L0 70.71v47.14l40.82 23.57 40.83-23.57V70.71z"
        fill="#438fd5"
      />
      <path
        d="M81.65 23.57L40.82 47.14l40.83 23.57v47.14l40.82-23.57V47.14z"
        fill="#f4220b"
      />
      <path
        d="M298.92 47.1h14.79v53.96h-14.79zm-.54-24.83h15.86v14.79h-15.86zm37.13 7.23v17.6h-9.93v12.62h9.93v41.34h14.79V59.72h11.87V47.1H350.3V34.9h11.87V22.27h-14.14zm49 17.06l-12.52 7.23v40.58l12.52 7.23h22.99l12.52-7.23V53.79l-12.52-7.23h-22.99zm20.72 42.41h-18.46V59.18h18.46v29.79zm45.75-37.43l-7.69-4.44h-7.09v53.96h14.79V59.72h18.56V47.1h-10.88zm-193.21-4.98l-8.62 4.98-8.63-4.98h-5.81v54.5h14.79V59.18h18.45v41.88h14.79V53.79l-12.52-7.23zm-54.03 42.41h-18.46V47.1H170.5v47.27l12.52 7.23h13.04l7.66-4.43.01.01.01-.01v.01l7.65 4.42h7.13V47.1h-14.78zm339.95-42.41h-10.36l-10.14 5.82-10.04-5.82h-10.36l-7.66 4.42h0 0 0l-7.66-4.42h-7.13v54.5h14.79V59.18h15.76v41.88h14.78V59.18h15.76v41.88h14.78V53.79z"
        fill={"#000"}
      />
    </svg>
  );
};

export default Logo;
