'use client'

import Link from "next/link";
import { loginValidator } from "@/validations/login";
import InputField from "@/components/ui/InputField";
import React, { useState } from 'react';

export default function Login() {
  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  function handleSubmitClick(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); 
    const form = new FormData(e.currentTarget); 
    const errorsLoginValidation = loginValidator(form); // Valida los datos del formulario
    setErrors(errorsLoginValidation); // Actualiza los errores
  }


    return (
      <form onSubmit={handleSubmitClick}>
        <div className="flex items-center flex-col mt-[220px] bg-white">
          <p className="text-[24px] font-bold text-black">Welcome back!</p>
          <p className="text-[12px] text-black">Login to your account</p>
        </div>
        <div className="flex flex-col items-center bg-white">

          <InputField id="email" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleInputChange}/>
          <InputField id="password" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />

          <div className="mt-5">
            {errors.map((error, index) => (
              <p key={index} className="text-red-500 text-xs">{error}</p>
            ))}

          </div>

          <button type="submit" className="mt-12 w-[270px] h-[40px] bg-[#FFA07A] rounded-[20px] text-sm text-white">
            Login
          </button>
        </div>
        <div className="flex mt-8 flex mt-6 justify-center">
            <p className="text-xs text-black">Don't have an account</p>
            <Link href="/register" className="text-xs text-[#FFA07A] pl-2 ">Sign up here</Link>
          </div>
      </form>
    );
  }
  
  