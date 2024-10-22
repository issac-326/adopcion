'use client';

import Link from "next/link";
import { loginValidator } from "@/validations/login";
import InputField from "@/components/ui/InputField";
import React, { useState } from 'react';
import { loginUser } from "./actions";
import { useRouter } from "next/navigation";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Login() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Modificacion de el handleLogin para almacenar el ID en LocalStorage
  async function handleLogin(formData: FormData) {
    setErrorMessage('');
    const loginValidated = loginValidator(formData); // Valida los datos del formulario
    if (!loginValidated.isValid) {
      setErrorMessageFunction(loginValidated.errors.message);
      return;
    }

    try {
      const data = await loginUser(formData); // Obtener los datos del usuario tras el login exitoso

      // Almacenar el ID del usuario en LocalStorage
      if (data.id_usuario) {
        localStorage.setItem('userId', data.id_usuario); // Almacenar el ID del usuario
      }

      router.push('/menu/inicio');
    } catch (error) {
      setErrorMessageFunction(error.message);
    }
  }

  async function setErrorMessageFunction(message?: string) {
    setErrorMessage(message ? message : '');

    setTimeout(() => {
      setErrorMessage('');
    }, 2500);
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
      <form className="relative">
        <div className="flex items-center flex-col">
          <p className="text-[24px] font-bold text-black">Welcome back!</p>
          <p className="text-[12px] text-black">Login to your account</p>
        </div>
        <div className="flex flex-col items-center flex-wrap">
          <div>
            <InputField id="email" name="email" type="text" placeholder="Correo" value={formData.email} onChange={handleInputChange} />
          </div>
          <div>
            <InputField id="password" name="password" type="password" placeholder="Contraseña" value={formData.password} onChange={handleInputChange} />
            <div className="text-right"><Link href="/reset-password" className="text-xs text-[#FFA07A] pl-2 ">forgot your password?</Link></div>
          </div>

          <div className="mt-5">
            {errorMessage && (
              <div className={`text-red-500 text-xs animate-shake ease-in-out duration-300 mt-2 text-left`}>
                {errorMessage}
              </div>
            )}
          </div>

          <button formAction={handleLogin} className="mt-12 w-[270px] h-[40px] bg-[#FFA07A] rounded-[20px] text-sm text-white hover:scale-105">
            Login
          </button>
        </div>
        <div className="flex mt-8 justify-center">
          <p className="text-xs text-black">Don't have an account</p>
          <Link href="/register" className="text-xs text-[#FFA07A] pl-2 ">Sign up here</Link>
        </div>
        <div className="fixed bottom-0 right-0 w-70 h-70 flex items-center justify-center">
          <FontAwesomeIcon
            icon={faPaw}
            rotation={180}
            style={{
              color: "#ffa07a",
              transform: 'rotate(20deg)',
              width: '100%',
              height: '100%',
              opacity: .7
            }}
          />
        </div>
      </form>
    </div>
  );
}


