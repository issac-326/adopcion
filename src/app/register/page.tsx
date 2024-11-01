'use client';

import Link from "next/link";
import { signupValidator } from "@/validations/signup";
import React, { useState } from 'react';
import InputField from "@/components/ui/InputField";
import { addUser } from "./actions";
import SuccessNotification from "@/components/ui/SuccesNotification";
import { useRouter } from "next/navigation";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Register() {
  const router = useRouter();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userExists, setUserExists] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName1: '',
    lastName2: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    image: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignUp = async (formData: FormData) => {
    const formResult = signupValidator(formData);

    if (formResult.isValid) {
      setUserExists(false);
      try {
        const data = await addUser(formData);
        console.log('User added successfully:', data);
        router.push('/login');
        setIsSuccess(true);
      } catch (error) {
        setUserExists(true);
        console.error("Error en el registro:", error);
      }
    } else {
      setErrors(formResult.errors);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {isSuccess && (
        <SuccessNotification message="Your account has been created successfully" />
      )}
      <form className="flex flex-col items-center p-6 rounded-lg">
        <div className="flex items-center flex-col mb-6">
          <p className="text-[24px] font-bold text-black">¡Bienvenido!</p>
          <p className="text-[12px] text-black">Crea tu cuenta</p>
        </div>

         {/* Fila de nombres */}
         <div className="flex space-x-4">
          <div className="flex flex-col">
            <InputField
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Primer Nombre"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            {errors.firstName && <div className="text-red-500 text-xs animate-shake mt-2">{errors.firstName}</div>}
          </div>

          <div className="flex flex-col">
            <InputField
              id="middleName"
              name="middleName"
              type="text"
              placeholder="Segundo Nombre (opcional)"
              value={formData.middleName}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Fila de apellidos */}
        <div className="flex space-x-4 mt-4">
          <div className="flex flex-col">
            <InputField
              id="lastName1"
              name="lastName1"
              type="text"
              placeholder="Primer Apellido"
              value={formData.lastName1}
              onChange={handleInputChange}
            />
            {errors.lastName1 && <div className="text-red-500 text-xs animate-shake mt-2">{errors.lastName1}</div>}
          </div>

          <div className="flex flex-col">
            <InputField
              id="lastName2"
              name="lastName2"
              type="text"
              placeholder="Segundo Apellido (opcional)"
              value={formData.lastName2}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Fila de correo y teléfono */}
        <div className="flex space-x-4 mt-4">
          <div className="flex flex-col">
            <InputField
              id="email"
              name="email"
              type="text"
              placeholder="Correo"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <div className="text-red-500 text-xs mt-2 w-56 break-words">{errors.email}</div>}
            {userExists && <div className="text-red-500 text-xs animate-shake mt-2">El correo ya está registrado</div>}
          </div>

          <div className="flex flex-col">
            <InputField
              id="phone"
              name="phone"
              type="text"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={handleInputChange}
            />
            {errors.phone && <div className="text-red-500 text-xs mt-2 w-56 break-words">{errors.phone}</div>}
          </div>
        </div>

        {/* Fila de contraseña */}
        <div className="flex space-x-4 mt-4">
          <div className="flex flex-col">
            <InputField
              id="password"
              name="password"
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <div className="text-red-500 text-xs mt-2 w-56 break-words">{errors.password}</div>}
          </div>

          <div className="flex flex-col">
            <InputField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirmar Contraseña"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            {errors.confirmPassword && <div className="text-red-500 text-xs mt-2 w-56 break-words">{errors.confirmPassword}</div>}
          </div>
        </div>

        {/* Fila para la imagen */}
        <div className="mt-4 w-full flex flex-col">
          <InputField
            id="image"
            name="image"
            type="text"
            placeholder="URL de la Imagen"
            value={formData.image}
            onChange={handleInputChange}
          />
        </div>

        {/* Botón de envío */}
        <button formAction={handleSignUp} className="hover:scale-105 mt-12 w-[270px] h-[40px] bg-[#FFA07A] rounded-[20px] text-sm text-white hover:bg-[#ff9060]">
          Registrarme
        </button>

        <div className="flex mt-6 justify-center">
          <p className="text-xs text-black">¿Ya tienes una cuenta?</p>
          <Link href="/login" className="text-xs text-[#FFA07A] pl-2">¡Inicia sesión aquí!</Link>
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