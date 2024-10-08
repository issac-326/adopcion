'use client'

import Link from "next/link";
import { loginValidator } from "@/validations/login";
import InputField from "@/components/ui/InputField";
import React, { useState } from 'react';
import { loginUser } from "./actions";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  async function handleLogin(formData: FormData) {
    const loginValidated = loginValidator(formData); // Valida los datos del formulario
    if(!loginValidated.isValid) {
      setErrorMessage(loginValidated.errors.message);
      return;
    }

    try {
      const data = await loginUser(formData);
      console.log('User added successfully:', data);
      router.push('/home');
    } catch (error) {
      console.error("Error en el registro:", error);
    }

  }
  
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }



  return (
    <div className="min-h-screen flex items-center justify-center">
    <form>
      <div className="flex items-center flex-col bg-white">
        <p className="text-[24px] font-bold text-black">Welcome back!</p>
        <p className="text-[12px] text-black">Login to your account</p>
      </div>
      <div className="flex flex-col items-center bg-white">

        <div>
          <InputField id="email" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
        </div>
        <div>
          <InputField id="password" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />
          <div className="text-right"><Link href="/reset-password" className="text-xs text-[#FFA07A] pl-2 ">forgot your password?</Link></div>
          </div>

        <div className="mt-5">
          {errorMessage && <div className="text-red-500 text-xs animate-shake mt-2 text-left">{errorMessage}</div>}
        </div>

        <button formAction={handleLogin} className="mt-12 w-[270px] h-[40px] bg-[#FFA07A] rounded-[20px] text-sm text-white">
          Login
        </button>
      </div>
      <div className="flex mt-8 justify-center">
        <p className="text-xs text-black">Don't have an account</p>
        <Link href="/register" className="text-xs text-[#FFA07A] pl-2 ">Sign up here</Link>
      </div>
    </form>
    </div>
  );
}

