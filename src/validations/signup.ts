
export function signupValidator(formData: FormData) {
  const errors: Error = {
    email: '',
    password: '',
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
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{6,}$/; // Mínimo 8 caracteres y cumple con los requisitos

  if (!passwordRegex.test(password)) {
    errors.password = 'La contraseña debe contener minimo una letra minúscula, una letra mayúscula, un número y un carácter especial.';
    isValid = false;
  }

  // Verifica que la contraseña tenga al menos 6 caracteres
  if (password.length < 6) {
    errors.password = '';
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
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
