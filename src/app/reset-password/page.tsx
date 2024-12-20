'use client'

import Link from "next/link";
import InputField from "@/components/ui/InputField";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { searchUser } from "./actions";


export default function ResetPassword() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSearchUser = async (formData: FormData) => {
    if(formData.get('email') === '') {
      handleErrorNotification('El correo es requerido');
      return;
    }
    
    setErrorMessage('');
    try {
      await searchUser(formData);
      localStorage.setItem('email', formData.get('email') as string);
      router.push('/reset-password/code');
    } catch (error) {
      if (error instanceof Error) {
        handleErrorNotification('No se encontró el usuario');
      } else {
        handleErrorNotification('An unknown error occurred');
      }
    }
  };

  const handleErrorNotification = (error: string) => { 
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }
    

  return (
    <div className="min-h-screen flex items-center justify-center">
    <form>
      <div className="flex items-center flex-col">
        <p className="text-[24px] font-bold text-black">Cambia tu contraseña</p>
        <p className="text-[12px] text-black">Por favor ingresa tu correo para buscar tu cuenta.</p>
      </div>
      <div className="flex flex-col items-center">

        <div className="mt-5">
          <InputField id="email" name="email" type="email" placeholder="" value={formData.email} onChange={handleInputChange} />
          {errorMessage && <p className="mt-2 pl-5 animate-shake text-center text-red-500 text-xs">{errorMessage}</p>}
        </div>
        <div className="mt-5">
          <button className="bg-[#FFA07A] text-white rounded-[50px] pl-5 pt-2 mt-5 w-[330px] h-[35px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]" formAction={handleSearchUser}>Buscar</button>
        </div>
        <div>
          <Link href="/login" className="bg-[#e4e6eb] block flex justify-center text-[#4b4f5c] rounded-[50px] pl-5 pt-2 mt-2 w-[330px] h-[35px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">Cancelar</Link>
        </div>
        </div>
    </form>
    </div>
  );
}

