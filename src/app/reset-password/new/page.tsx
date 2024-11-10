'use client';

import Link from "next/link";
import InputField from "@/components/ui/InputField";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { changePassword } from "./actions";

export default function NewPassword() {
  const router = useRouter();
  const [errors, setErrors] = useState<{ password: string; confirmPassword: string }>({
    password: '',
    confirmPassword: ''
  });

  const [isValid, setIsValid] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleChangePassword = async (formData: FormData) => {
    setIsValid(true);
    setErrors({
      password: '',
      confirmPassword: ''
    });

    const password = formData.get('password') as string | null;
    if (password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.])(?=.{6,})/.test(password)) {
      setErrors((prev) => ({
        ...prev,
        password: 'La contraseña debe tener al menos una mayúscula, una minúscula y un carácter especial.'
      }));
      setIsValid(false);
    }

    if (formData.get('password')!.toString().length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: 'La contraseña debe de tener al menos 6 caracteres'
      }));
      setIsValid(false);
    }

    if (formData.get('password') !== formData.get('confirmPassword')) {

      setErrors((prev) => ({
        ...prev,
        confirmPassword: 'Las contraseñas no coinciden'
      }));
      setIsValid(false);
    }

    if(isValid) {
      try {
        const email = localStorage.getItem('email') as string;
        console.log('EXEC')
        await changePassword(formData, email);
        router.push('/login');
      } catch (error) {
        setIsValid(false);
        console.error(error);
      }
    }

    return;
  };


  return (
    <div className="min-h-screen flex items-center justify-center">
      <form>
        <div className="flex items-center flex-col">
          <p className="text-[24px] font-bold text-black">Contraseña Nueva</p>
          <p className="text-[12px] text-black">Por favor ingresa tu nueva contraseña</p>
        </div>
        <div className="flex flex-col items-center">
          <div>
            <InputField
              id="password"
              name="password"
              type="password"
              placeholder="Contraseña nueva"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <p className="text-red-500 pl-5 text-xs w-[330px] animate-shake mt-2">{errors.password}</p>}
          </div>
          <div>
            <InputField
              id="new-password"
              name="confirmPassword"
              type="password"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs w-[330px] animate-shake pl-5 mt-2">{errors.confirmPassword}</p>}
          </div>
          <div className="mt-5">
            <button
              className="bg-[#FFA07A] text-white rounded-[50px] pt-2 mt-5 w-[330px] h-[35px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
              formAction={handleChangePassword}
            >
              Continue
            </button>
          </div>
          <div>
            <Link
              href="/login"
              className="bg-[#e4e6eb] block flex justify-center text-[#4b4f5c] rounded-[50px] pt-2 mt-2 w-[330px] h-[35px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
