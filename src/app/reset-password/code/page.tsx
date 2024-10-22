'use client'

import Link from "next/link";
import InputField from "@/components/ui/InputField";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { sendCode } from "./actions";

export default function Code() {
  const router = useRouter();
  const [isIncorrect, setIsIncorrect] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    code: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSendCode = async (formData: FormData) => {
    try {
      if (formData.get('code')!.toString().length !== 6) {
        setIsIncorrect(true);
        return;
      }
  
      const email = localStorage.getItem('email') as string;
      console.log('email', email);
  
      const res = await sendCode(formData, email);
      console.log('res', res);
  
      if (res.error) {
        console.error(res.error); 
        setIsIncorrect(true); 
        return;
      }
  
      if (res.isCorrect) {
        setIsIncorrect(false);
        router.push('/reset-password/new');
      } else {
        setIsIncorrect(true); 
      }
    } catch (error: any) {
      console.error('Error handling send code:', error);
      handleSetIncorrect(true); 
    }
  };

  const handleSetIncorrect = (value: boolean) => {
    setIsIncorrect(value);
    setTimeout(() => {
      setIsIncorrect(false);
    }, 2000);
  }
  


  return (
    <div className="min-h-screen flex items-center justify-center">
    <form>
      <div className="flex items-center flex-col">
        <p className="text-[24px] font-bold text-black">Code</p>
        <p className="text-[12px] text-black">Please enter your code to verify</p>
      </div>
      <div className="flex flex-col items-center">

        <div>
          <InputField id="code" name="code" type="text" placeholder="" value={formData.code} onChange={handleInputChange} />
        </div>
        {isIncorrect && <p className="text-red-500 text-sm mt-2 animate-shake text-left">Incorrect code</p>}
        <div className="mt-5">
          <button className="bg-[#FFA07A] text-white rounded-[50px] pl-5 mt-5 w-[330px] h-[35px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]" formAction={handleSendCode}>Continue</button>
        </div>
        <div>
          <Link href="/login" className="bg-[#e4e6eb] block flex justify-center pt-2 text-[#4b4f5c] rounded-[50px] pl-5 mt-2 w-[330px] h-[35px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">Cancel</Link>
        </div>
        </div>
    </form>
    </div>
  );
}

