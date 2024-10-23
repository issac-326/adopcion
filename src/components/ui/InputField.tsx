'use client'

import React from 'react';

interface InputProps {
  id: string;
  name: string;
  type: string;
  value: string;
  placeholder: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;  // Hacer onChange opcional
  minLength?: number;
  readOnly?: boolean;  // Añadimos readOnly como una propiedad opcional
}

const InputField: React.FC<InputProps> = ({
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  readOnly = false,  // Valor por defecto para readOnly
}) => {
  return (
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}  // Esto será opcional
        readOnly={readOnly}  // Aplicamos readOnly
        className="focus:outline-none focus:border-blue-800/2 placeholder:text-gray-400 text-xs text-black bg-white rounded-[50px] pl-5 pt-2 mb-5 w-[330px] h-[35px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
      />
  );
};

export default InputField;
