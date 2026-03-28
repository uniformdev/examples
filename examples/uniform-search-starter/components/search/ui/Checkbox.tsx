import { FC, InputHTMLAttributes, ReactNode, useId } from 'react';

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;
  value: string;
};

const Checkbox: FC<CheckboxProps> = ({ label, value, checked, ...props }) => {
  const id = useId();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <input
        type="checkbox"
        value={value}
        checked={checked}
        id={id}
        {...props}
      />
      <label htmlFor={id} style={{ cursor: 'pointer' }}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
