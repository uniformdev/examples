import { ReactNode } from "react";

type CtaButtonProps = {
  label?: ReactNode;
  link?: string;
  variant?: string;
};

const variantStyles: Record<string, string> = {
  primary:
    "inline-flex items-center px-6 py-3 bg-[#1E293B] text-white text-sm font-semibold rounded-full hover:bg-[#334155] transition-colors",
  secondary:
    "inline-flex items-center gap-1.5 px-6 py-3 border border-gray-300 text-[#1E293B] text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors",
};

const CtaButton: React.FC<CtaButtonProps> = ({
  label,
  link = "#",
  variant = "primary",
}) => (
  <a href={link} className={variantStyles[variant] ?? variantStyles.primary}>
    {label}
    {variant === "secondary" && (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    )}
  </a>
);

export default CtaButton;
