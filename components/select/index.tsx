import React from 'react';
import SelectProps from './select.type';

const Select = ({ name, value, onChange, children  }: SelectProps) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="border p-2 w-3/2 bg-white rounded-lg hover:shadow-xl"
    >
        {children}
    </select>
  );
};

export default Select;
