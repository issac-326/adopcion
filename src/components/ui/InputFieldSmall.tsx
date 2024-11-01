'use client';

import React from 'react';

interface InputProps {
  id: string;
  name: string;
  type: string;
  value: string;
  placeholder: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  minLength?: number;
  readOnly?: boolean;
}

const InputFieldSmall: React.FC<InputProps> = ({
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  readOnly = false,
}) => {
  return (
    <div className="relative mb-2">
      <input
        id={id}
        name={name}
        type={type}
        placeholder=" "
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`peer h-10 w-full border border-gray-300 rounded-full bg-transparent px-4 pt-5 pb-1 outline-none text-sm transition duration-200 shadow-[0_4px_4px_rgba(0,0,0,0.25)] focus:border-orange-400 ${
          readOnly ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
        }`}
      />
      <label
        htmlFor={id}
        className="absolute left-3 top-2 bg-transparent px-1 text-gray-500 text-xs transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:left-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-orange-400"
      >
        {placeholder}
      </label>
    </div>
  );
};

export default InputFieldSmall;
