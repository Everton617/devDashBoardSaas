import React from 'react';
import clsx from 'clsx';

const ButtonKanban = ({  className, children, onClick }) => {
  return (
    <button
      className={clsx(
        'rounded-md text-sm font-medium transition-colors outline-none focus:ring focus:ring-blue-300 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      onClick={onClick}
      
    >
      {children}
    </button>
  );
};

export default ButtonKanban;
