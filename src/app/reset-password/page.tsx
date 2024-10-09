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
    try {
      await searchUser(formData);
      localStorage.setItem('email', formData.get('email') as string);
      router.push('/reset-password/code');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
    <form>
      <div className="flex items-center flex-col bg-white">
        <p className="text-[24px] font-bold text-black">Reset your password</p>
        <p className="text-[12px] text-black">Please enter your email to search for your account.</p>
      </div>
      <div className="flex flex-col items-center bg-white">

        <div>
          <InputField id="email" name="email" type="email" placeholder="" value={formData.email} onChange={handleInputChange} />
        </div>
        <div className="mt-5">
          <button className="bg-[#FFA07A] text-white rounded-[50px] pl-5 pt-2 mt-5 w-[330px] h-[35px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]" formAction={handleSearchUser}>Search</button>
        </div>
        <div>
          <Link href="/login" className="bg-[#e4e6eb] block flex justify-center text-[#4b4f5c] rounded-[50px] pl-5 pt-2 mt-2 w-[330px] h-[35px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">Cancel</Link>
        </div>
        </div>
    </form>
    </div>
  );
}

