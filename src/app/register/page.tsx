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
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [isSuccess, setIsSuccess] = useState(false); // Control de éxito

  // Función que valida los datos del formulario y envía los datos al servidor
  const handleSignUp = async (formData: FormData) => {
    const formResult = signupValidator(formData);

    // Si hay errores en la validación, se muestran en pantalla; si no, se registra al usuario
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
      <form className="flex flex-col items-center p-6 rounded-lg">
        <div className="flex items-center flex-col mb-6">
          <p className="text-[24px] font-bold text-black">¡Bienvenido!</p>
          <p className="text-[12px] text-black">Crea tu cuenta</p>
        </div>

        {/* Input del correo */}
        <div>
          <InputField
            id="email"
            name="email"
            type="text"
            placeholder="correo"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <div className="text-red-500 pl-5 text-xs animate-shake mt-2 text-left">{errors.email}</div>}
          {userExists && <div className="text-red-500 pl-5 text-xs animate-shake mt-2 text-left">El correo ya esta registrado</div>}
        </div>

        {/* Input de la contraseña */}
        <div>
          <InputField
            id="password"
            name="password"
            type="password"
            placeholder="contraseña"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <div className="text-red-500 animate-shake pl-5 text-xs mt-2 w-[334px]">{errors.password}</div>}


        </div>

        {/* Input de confirmación de contraseña */}
        <div>
          <InputField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="confirmar contraseña"
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
            placeholder="telefono"
            value={formData.phone}
            onChange={handleInputChange}
          />
          {errors.phone && <div className="text-red-500 animate-shake pl-5 text-xs mt-2">{errors.phone}</div>}
        </div>

        {/* Botón de envío */}
        <button formAction={handleSignUp} className="hover:scale-105 mt-12 w-[270px] h-[40px] bg-[#FFA07A] rounded-[20px] text-sm text-white">
          Registrarme
        </button>

        <div className="flex mt-6 justify-center">
          <p className="text-xs text-black">¿Ya tienes una cuenta?</p>
          <Link href="/login" className="text-xs text-[#FFA07A] pl-2">¡Inicia sesión aqui!</Link>
        </div>
        <div className="fixed bottom-0 right-0 w-70 h-70 flex items-center justify-center"> {/* Usando flex para centrar el ícono */}
          <FontAwesomeIcon
            icon={faPaw}
            rotation={180}
            style={{
              color: "#ffa07a",
              transform: 'rotate(20deg)',
              width: '100%',  // O '100%' aquí para ocupar el 100% del contenedor
              height: '100%',
              opacity: .7 // Si quieres que el ícono también ajuste su altura
            }}
          />
        </div>
      </form>
    </div>
  );
}