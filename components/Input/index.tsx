import React, { FC } from 'react';
import clsx from 'clsx';
import { cva } from 'class-variance-authority';
import InputProps from './input.type'; // Ajuste o caminho conforme necessário

const InputVariants = cva(
  'border p-2 bg-white rounded-lg hover:shadow-xl',
  {
    variants: {
      variant: {
        default: ' bg-white',
      },
      size: {
        default: 'w-0',
        sm: 'w-22',
        flex: 'w-80 rounded-lg',
        md: 'w-full h-40'
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Input: FC<InputProps> = ({
  variant = 'default',
  size = 'default',
  name,
  type = 'text',
  value,
  className,
  placeholder,
  onChange
}) => {
  const variantClasses = InputVariants({ variant, size });

  return (
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={clsx(variantClasses, className)}
    />
  );
};

export default Input;
