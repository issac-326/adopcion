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
    const loginValidated = loginValidator(formData); // Valida los datos del formulario
    if (!loginValidated.isValid) {
      setearError(loginValidated.errors.message);
      return;
    }

    try {
      const data = await loginUser(formData); // Obtener los datos del usuario tras el login exitoso

      // Almacenar el ID del usuario en LocalStorage
      if (data.id_usuario) {
        localStorage.setItem('userId', data.id_usuario); // Almacenar el ID del usuario
      }

      console.log('User added successfully:', data);
      router.push('/menu/inicio');
    } catch (error) {
      setearError(error.message);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  function setearError(message?: string) {
    setErrorMessage(message ? message : '');

    setTimeout(() => {
      setErrorMessage('');
    }, 2500);

  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <form className="bg-[#f7b699] py-8 px-4 rounded-xl shadow-[0_8px_16px_rgba(0,0,255,0.3),0_4px_8px_rgba(0,0,0,0.2)]">
        <div className="flex items-center flex-col">
          <p className="text-[24px] font-bold text-black">¡Bienvenido de vuelta!</p>
          <p className="text-[12px] text-black">Entra a tu cuenta</p>
        </div>
        <div className="flex flex-col items-center flex-wrap mt-10">
          <div>
            <InputField id="email" name="email" type="email" placeholder="correo" value={formData.email} onChange={handleInputChange} />
          </div>
          <div>
            <InputField id="password" name="password" type="password" placeholder="contraseña" value={formData.password} onChange={handleInputChange} />
            <div className="text-right"><Link href="/reset-password" className="text-xs text-[#fff] pl-2 ">Olvidé mi contraseña</Link></div>
          </div>

          <div className="mt-5">
            {errorMessage && <div className="text-red-500 text-xs animate-shake mt-2 text-left">{errorMessage}</div>}
          </div>

          <button formAction={handleLogin} className="mt-8 w-[270px] h-[40px] hover:scale-105 bg-[#F5C02D] rounded-[20px] text-sm text-white hover:bg-[#ff9060]">
            Iniciar sesión
          </button>
        </div>
        <div className="flex mt-8 justify-center">
          <p className="text-xs text-black">No tienes una cuenta</p>
          <Link href="/register" className="text-xs text-[#fff] pl-2 ">¡Registrate aquí!</Link>
        </div>

      </form>
      <div className="absolute bottom-0 right-0 flex items-center justify-center">
        <img
          src="/Logo.svg"
          alt="Descripción del logo"
          style={{
            color: "#ffa07a",
            width: '20rem',  // Cambia a un ancho adecuado
            height: '20rem', // Cambia a un alto adecuado
            objectFit: 'contain', // Asegura que la imagen se ajuste sin distorsión
            opacity: 0.4,
          }}
        />
      </div>

    </div>
  );
}


