'use client';

import Link from "next/link";
import { loginValidator } from "@/validations/login";
import InputField from "@/components/ui/InputField";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { loginUser } from "./actions";

export default function Login() {
  const router = useRouter();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  /**
   * Maneja el proceso de autenticación al enviar el formulario.
   * Valida los datos ingresados, intenta autenticar al usuario y redirige en caso de éxito.
   * Muestra un mensaje de error si ocurre algún problema.
   * @param formData - Objeto `FormData` con los datos del formulario de login.
   */
  async function handleLogin(formData: FormData) {
    setIsSending(true);

    // Valida los datos del formulario antes de proceder
    const loginValidated = loginValidator(formData);
    if (!loginValidated.isValid) {
      setearError(loginValidated.errors.message);
      setIsSending(false);
      return;
    }

    try {
        // Llama a la función de autenticación y obtiene los datos del usuario
        const userData = await loginUser(formData); // `loginUser` retorna { id_usuario, id_tipo_usuario }
        // Redirige según el rol del usuario
        if ([3, 1].includes(userData.id_tipo_usuario)
        ) {
          // Redirige al panel de administración si es administrador
          router.push('/admin');
        } else {
          // Redirige al inicio si es usuario normal
          router.push('/menu/inicio');
        }
        } catch (error) {
          // Maneja errores de autenticación y muestra mensajes apropiados
          if (error instanceof Error) {
            setearError(error.message);
          } else {
            setearError('An unknown error occurred');
          }
        } finally {
          setIsSending(false);
        }
  }

  /**
   * Actualiza el estado del formulario cuando el usuario cambia algún valor en los campos.
   * @param e - Evento de cambio en el campo de entrada.
   */
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  /**
   * Establece y muestra un mensaje de error temporalmente.
   * Borra el mensaje después de un período determinado.
   * @param message - Mensaje de error a mostrar.
   */
  function setearError(message?: string) {
    setErrorMessage(message || '');

    setTimeout(() => {
      setErrorMessage('');
    }, 2500);
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Formulario de inicio de sesión */}
      <form>
        <div className="flex items-center flex-col">
          <p className="text-[24px] font-bold text-black">¡Bienvenido de vuelta!</p>
          <p className="text-[12px] text-black">Entra a tu cuenta</p>
        </div>

        <div className="flex flex-col items-center flex-wrap mt-10">
          {/* Campo de correo electrónico */}
          <InputField
            id="email"
            name="email"
            type="text"
            placeholder="Correo"
            value={formData.email}
            onChange={handleInputChange}
          />

          {/* Campo de contraseña */}
          <InputField
            id="password"
            name="password"
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleInputChange}
          />
          <div className="text-right">
            <Link href="/reset-password" className="text-right text-xs pl-2 text-[#fe8a5b]">
              Olvidé mi contraseña
            </Link>
          </div>

          {/* Muestra el mensaje de error si existe */}
          <div className="mt-5">
            {errorMessage && <div className="text-red-500 text-xs animate-shake mt-2 text-left">{errorMessage}</div>}
          </div>

          {/* Botón de inicio de sesión */}
          <button
            formAction={handleLogin}
            className="mt-8 w-[270px] h-[40px] hover:scale-105 bg-[#FE8A5B] rounded-[20px] text-sm text-white hover:bg-[#ff9060]"
          >
            {isSending ? 'Cargando...' : 'Iniciar sesión'}
          </button>
        </div>

        {/* Enlace de registro */}
        <div className="flex mt-8 justify-center">
          <p className="text-xs text-black">No tienes una cuenta</p>
          <Link href="/register" className="text-xs text-[#fe8a5b] pl-2">
            ¡Registrate aquí!
          </Link>
        </div>
      </form>

      {/* Logo en el fondo */}
      <div className="absolute bottom-0 right-0 flex items-center justify-center">
        <img
          src="/Logo.svg"
          alt="Descripción del logo"
          style={{
            color: "#ffa07a",
            width: '20rem',// Cambia a un ancho adecuado
            height: '20rem',// Cambia a un alto adecuado
            objectFit: 'contain',// Asegura que la imagen se ajuste sin distorsión
            opacity: 0.4,
          }}
        />
      </div>
    </div>
  );
}
