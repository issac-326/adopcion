'use server'
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export const sendCode = async (formData: FormData, email: string) => {
  const supabase = createClient();
  const code = formData.get('code');

  try {
    const { data, error } = await supabase
      .from('users')
      .select('reset_token')
      .eq('email', email)
      .single();

    if (error) {
      throw error; 
    }

    if (data.reset_token != code) {
      console.log('data.reset_token', data.reset_token);
      return { isCorrect: false,  };
    }

    return { isCorrect: true };
  } catch (error: any) {
    return { isCorrect: false, error: error.message || 'Unknown error occurred' };
  }
};
 