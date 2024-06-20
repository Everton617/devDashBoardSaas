import React from 'react';
import clsx from 'clsx';
import { cva } from 'class-variance-authority';
import InputProps from './input.type';

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
        flex: 'w-60',
        md: 'w-full h-40'
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Input: React.FC<InputProps>= ({ variant = 'default' as 'default' | 'default', size = 'default' as 'default' | 'sm' | 'md' | 'flex', name, type, value, className, placeholder, onChange }: { variant?: 'default' , size?: 'default' | 'sm' | 'md' | 'flex' , type?:string, name?: string, placeholder?:string, value?: string, className?: string, onChange?: () => void }) => {
  const variantClasses = InputVariants({
    variant,
    size,
  });

  return (
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={clsx(variantClasses, className)}
    ></input>
  );
};


export default Input;