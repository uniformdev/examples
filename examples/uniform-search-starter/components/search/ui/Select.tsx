import { FC, SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

const Select: FC<SelectProps> = ({ className = '', children, ...props }) => (
  <select className={className} {...props}>
    {children}
  </select>
);

export default Select;
