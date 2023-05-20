import * as React from "react";

type CTAProps = { title: string | React.ReactNode; link: string };

export const CTA = ({ title, link }: CTAProps) => {
  return (
    <a href={link}>
      <button className="px-4 py-2 bg-[#c98686] rounded">{title}</button>
    </a>
  );
};
