'use client';

import Link from "next/link";
import { signupValidator } from "@/validations/signup";
import React, { useState } from 'react';
import InputField from "@/components/ui/InputField";
import { signup } from "./actions";
import SuccessNotification from "@/components/ui/SuccesNotification";

export default function Register() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [isSuccess, setIsSuccess] = useState(false); // Control de éxito

  // Función que valida los datos del formulario y envía los datos al servidor
  const handleSignUp = async (formData : FormData) => {
    const formResult = signupValidator(formData);

    // Si hay errores en la validación, se muestran en pantalla; si no, se registra al usuario
    if (formResult.isValid) {
      try {
        await signup(formData);
        setIsSuccess(true); 
        setErrors({});
      } catch (error) {
        console.error("Error en el registro:", error);
      }
    } else {
      setErrors(formResult.errors);
    }
  };

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
      {isSuccess && (
        <SuccessNotification message="Your account has been created successfully" />
      )}
      <form className="flex flex-col items-center bg-white p-6 rounded-lg">
        <div className="flex items-center flex-col mb-6">
          <p className="text-[24px] font-bold text-black">Welcome!</p>
          <p className="text-[12px] text-black">Create your account</p>
        </div>

        {/* Input del correo */}
        <div>
        <InputField
          id="email"
          name="email"
          type="text"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && <div className="text-red-500 pl-5 text-xs animate-shake mt-2 text-left">{errors.email}</div>}

        </div>

        {/* Input de la contraseña */}
        <div>
          <InputField
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <div className="text-red-500 pl-5 animate-shake text-xs mt-2">{errors.password}</div>}
        </div>

        {/* Input de confirmación de contraseña */}
        <div>
          <InputField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          {errors.confirmPassword && <div className="text-red-500 animate-shake pl-5 text-xs mt-2">{errors.confirmPassword}</div>}
        </div>

        {/* Input del teléfono */}
        <div>
          <InputField
            id="phone"
            name="phone"
            type="text"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
          {errors.phone && <div className="text-red-500 animate-shake pl-5 text-xs mt-2">{errors.phone}</div>}
        </div>

        {/* Botón de envío */}
        <button formAction={handleSignUp} className="hover:scale-110 mt-12 w-[270px] h-[40px] bg-[#FFA07A] rounded-[20px] text-sm text-white">
          Sign Up
        </button>

        <div className="flex mt-6 justify-center">
          <p className="text-xs text-black">You already have an account?</p>
          <Link href="/login" className="text-xs text-[#FFA07A] pl-2">Login here</Link>
        </div>
      </form>
    </div>
  );
}
