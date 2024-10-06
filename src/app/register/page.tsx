'use client'

import Link from "next/link";
import { signupValidator } from "@/validations/signup";
import React, { useState } from 'react';
import InputField from "@/components/ui/InputField";
import signup from "./actions";
import SuccessNotification from "@/components/ui/SuccesNotification";

export default function Register() {
  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  //función que valida los datos del formulario y envía los datos al servidor
  const SignUp = (formData: FormData) => {
    const errorsFromValidation = signupValidator(formData);

    //si hay errores en la validación, se muestran en pantalla sino registra al usuario
    if (errorsFromValidation.length > 0) {
      setErrors(errorsFromValidation);
    } else {
      signup(formData);
    }
  }

  // Función que captura el cambio en los inputs y actualiza el estado
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SuccessNotification message="Your account has been created successfully" />
      <form className="flex flex-col items-center bg-white">
        <div className="flex items-center flex-col bg-white">
          <p className="text-[24px] font-bold text-black">Welcome!</p>
          <p className="text-[12px] text-black">Create your account</p>
        </div>
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


        <button formAction={SignUp} className="mt-12 w-[270px] h-[40px] bg-[#FFA07A] rounded-[20px] text-sm text-white">
          Sign Up
        </button>
        <div className="flex mt-6 justify-center ">
          <p className="text-xs text-black">You already have an account?</p>
          <Link href="login" className="text-xs text-[#FFA07A] pl-2">Login here</Link>
        </div>
      </form>
    </div>
  );
}


