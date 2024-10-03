'use client'

import Link from "next/link";
import { signupValidator } from "@/validations/signup";
import React, { useState } from 'react';
import InputField from "@/components/ui/InputField";

export default function Register() {
  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  // Función que captura el cambio en los inputs y actualiza el estado
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Función que maneja el evento de submit del formulario
  const handleSubmitClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita la recarga de la página
    const form = new FormData(e.currentTarget); // Captura los datos del formulario
    const errorsFromValidation = signupValidator(form);
    setErrors(errorsFromValidation); // Actualiza los errores
    console.log(errorsFromValidation);
    console.log('ejecutando');
  };

  return (
    <div>
      <div className="flex items-center flex-col mt-[220px] bg-white">
        <p className="text-[24px] font-bold text-black">Welcome!</p>
        <p className="text-[12px] text-black">Create your account</p>
      </div>
      <form className="flex flex-col items-center bg-white mb-5" onSubmit={handleSubmitClick}>
        <InputField 
          id="email" 
          name="email" 
          type="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleInputChange} 
        />
        <InputField 
          id="password" 
          name="password" 
          type="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleInputChange} 
        />
        <InputField 
          id="confirmPassword" 
          name="confirmPassword" 
          type="password" 
          placeholder="Confirm password" 
          value={formData.confirmPassword} 
          onChange={handleInputChange} 
        />
        <InputField 
          id="phone" 
          name="phone" 
          type="text" 
          placeholder="Phone" 
          value={formData.phone} 
          onChange={handleInputChange} 
        />

        {/* Mostrar errores si existen */}
        <div className="mt-5">
        {errors.length > 0 && errors.map((error, index) => (
          <div key={index} className="text-red-500 text-xs">{error}</div>
        ))}
        </div>


        <button type="submit" className="mt-12 w-[270px] h-[40px] bg-[#FFA07A] rounded-[20px] text-sm text-white">
          Sign in
        </button>
      </form>
      <div className="flex mt-6 justify-center ">
          <p className="text-xs text-black">You already have an account?</p>
          <Link href="login" className="text-xs text-[#FFA07A] pl-2">Login here</Link>
        </div>
    </div>
  );
}


