import React from 'react';
import clsx from 'clsx';
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: ' text-white ',
        destructive: 'bg-red-400 text-white hover:bg-red-600',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-gray-100',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const ButtonKanban = ({ variant = 'default' as 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link', size = 'default' as 'default' | 'sm' | 'lg' | 'icon', className, children, onClick }: { variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link', size?: 'default' | 'sm' | 'lg' | 'icon', className?: string, children?: React.ReactNode, onClick?: () => void }) => {
  const variantClasses = buttonVariants({
    variant,
    size,
  });

  return (
    <button
      className={clsx(variantClasses, className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};


export default ButtonKanban;
