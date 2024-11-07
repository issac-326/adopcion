export function signupValidator(formData: FormData) {
  const errors: Record<string, string> = {
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    firstName: '',
    lastName1: '',
  };

  // Obtén los valores de los campos
  const firstName = formData.get('firstName') as string;
  const lastName1 = formData.get('lastName1') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const phone = formData.get('phone') as string;

  let isValid = true;

  // Verifica que el primer nombre no esté vacío
  if (firstName === '') {
    errors.firstName = 'El primer nombre es requerido';
    isValid = false;
  }

  // Verifica que el primer apellido no esté vacío
  if (lastName1 === '') {
    errors.lastName1 = 'El primer apellido es requerido';
    isValid = false;
  }

  // Verifica que el correo no esté vacío y su formato
  if (email === '') {
    errors.email = 'El correo es requerido';
    isValid = false;
  } else {
    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegexp.test(email)) {
      errors.email = 'El correo no es válido';
      isValid = false;
    }
  }

  // Verifica formato de contraseña
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{6,}$/;
  if (!passwordRegex.test(password)) {
    errors.password = 'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial.';
    isValid = false;
  }

  // Verifica que la contraseña tenga al menos 6 caracteres
  if (password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
    isValid = false;
  }

  // Verifica que el teléfono no esté vacío y su formato
  if (phone === '') {
    errors.phone = 'El teléfono es requerido';
    isValid = false;
  } else {
    const phoneRegexp = /^\d{8}$/;
    if (!phoneRegexp.test(phone)) {
      errors.phone = 'El teléfono no es válido';
      isValid = false;
    }
  }

  // Verifica que la confirmación de la contraseña no esté vacía y coincida
  if (confirmPassword === '') {
    errors.confirmPassword = 'La confirmación de la contraseña es requerida';
    isValid = false;
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'La contraseña y su confirmación no coinciden';
    isValid = false;
  }

  return { isValid, errors };
}
