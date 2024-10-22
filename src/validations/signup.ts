interface Error {
  email: string;
  password: string[];
  confirmPassword: string;
  phone: string;
}

export function signupValidator(formData: FormData) {
  const errors: Error = {
    email: '',
    password: [],
    confirmPassword: '',
    phone: '',
  };

  // Obtén los valores de los campos
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const phone = formData.get('phone') as string;

  let isValid = true;

  // Verifica que el correo no esté vacío
  if (email === '') {
    errors.email = 'El correo es requerido';
    isValid = false;
  }

  // Verifica formato de correo
  if (email) {
    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegexp.test(email)) {
      errors.email = 'El correo no es válido';
      isValid = false;
    }
  }
  
  // Verifica que la contraseña contenga al menos una minúscula
  if (!/[a-z]/.test(password)) {
    errors.password.push('Debe contener al menos una letra minúscula');
    isValid = false;
  }

  // Verifica que la contraseña contenga al menos una mayúscula
  if (!/[A-Z]/.test(password)) {
    errors.password.push('Debe contener al menos una letra mayúscula');
    isValid = false;
  }

  // Verifica que la contraseña contenga al menos un número
  if (!/[0-9]/.test(password)) {
    errors.password.push('Debe contener al menos un número');
    isValid = false;
  }

  // Verifica que la contraseña contenga al menos un carácter especial
  if (!/[\W_]/.test(password)) {
    errors.password.push('Debe contener al menos un carácter especial');
    isValid = false;
  }

  // Verifica que la contraseña tenga al menos 6 caracteres
  if (password.length < 6) {
    errors.password.push('La contraseña debe tener al menos 6 caracteres');
    isValid = false;
  }

  // Verifica que el teléfono no esté vacío
  if (phone === '') {
    errors.phone = 'El teléfono es requerido';
    isValid = false;
  }

  // Verifica formato del teléfono
  if (phone) {
    const phoneRegexp = /^\d{8}$/;
    if (!phoneRegexp.test(phone)) {
      errors.phone = 'El teléfono no es válido';
      isValid = false;
    }
  }

  // Verifica que la confirmación de la contraseña no esté vacía
  if (confirmPassword === '') {
    errors.confirmPassword = 'La confirmación de la contraseña es requerida';
    isValid = false;
  }

  // Verifica que la contraseña y su confirmación coincidan
  if (password !== confirmPassword) {
    errors.confirmPassword = 'La contraseña y su confirmación no coinciden';
    isValid = false;
  }

  return { isValid, errors };
}
