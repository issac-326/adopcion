'use client'

import React from 'react';

interface InputProps {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
  minLength?: number;
}

const InputField: React.FC<InputProps> = ({
  id,
  name,
  type,
  placeholder,
  required = false,
}) => {
  return (
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="focus:outline-none placeholder:text-gray-400 text-xs text-black bg-white rounded-[50px] pl-5 pt-2 mt-5 w-[330px] h-[35px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
      />
  );
};

export default InputField;
